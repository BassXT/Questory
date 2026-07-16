import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '../prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAvatarLoadoutDto } from './dto/update-avatar-loadout.dto';

const avatarSlots = ['background', 'body', 'hair', 'eyes', 'bottom', 'top', 'shoes', 'glasses', 'gadget'] as const;

const defaultEquippedItems: Record<string, string> = {
  background: 'background-meadow',
  body: 'body-sunrise',
  hair: 'hair-swoop',
  eyes: 'eyes-bright',
  bottom: 'bottom-jeans',
  top: 'top-hoodie-blue',
  shoes: 'shoes-sneaker-red'
};

const avatarChildSelect = {
  id: true,
  familyId: true,
  userId: true,
  displayName: true,
  avatarKey: true,
  level: true,
  xp: true,
  coins: true
};

@Injectable()
export class AvatarService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvatar(user: AuthenticatedUser, childId: string) {
    const child = await this.getAccessibleChild(user, childId);
    const [items, inventory, loadout] = await Promise.all([
      this.prisma.avatarItem.findMany({
        where: { isActive: true },
        orderBy: [{ layerOrder: 'asc' }, { requiredLevel: 'asc' }, { name: 'asc' }]
      }),
      this.prisma.childAvatarItem.findMany({
        where: { childProfileId: child.id },
        select: { itemKey: true, source: true, unlockedAt: true }
      }),
      this.prisma.childAvatarLoadout.findUnique({
        where: { childProfileId: child.id }
      })
    ]);

    const inventoryItemKeys = new Set(inventory.map((item) => item.itemKey));
    const unlockedItemKeys = new Set(
      items.filter((item) => item.requiredLevel <= child.level || inventoryItemKeys.has(item.key)).map((item) => item.key)
    );
    const equippedItems = this.resolveEquippedItems(loadout?.equippedItems, items, unlockedItemKeys);

    return {
      child,
      slots: avatarSlots,
      equippedItems,
      unlockedItemKeys: Array.from(unlockedItemKeys),
      items: items.map((item) => ({
        key: item.key,
        slot: item.slot,
        name: item.name,
        description: item.description,
        requiredLevel: item.requiredLevel,
        rarity: item.rarity,
        layerOrder: item.layerOrder,
        colorPrimary: item.colorPrimary,
        colorSecondary: item.colorSecondary,
        isUnlocked: unlockedItemKeys.has(item.key),
        unlockReason: item.requiredLevel <= child.level ? 'LEVEL' : inventoryItemKeys.has(item.key) ? 'INVENTORY' : 'LOCKED'
      }))
    };
  }

  async updateLoadout(user: AuthenticatedUser, childId: string, dto: UpdateAvatarLoadoutDto) {
    const child = await this.getAccessibleChild(user, childId);
    const avatar = await this.getAvatar(user, child.id);
    const itemsByKey = new Map(avatar.items.map((item) => [item.key, item]));
    const unlockedItemKeys = new Set(avatar.unlockedItemKeys);
    const equippedItems: Record<string, string> = {};

    for (const [slot, itemKey] of Object.entries(dto.equippedItems ?? {})) {
      if (!avatarSlots.includes(slot as (typeof avatarSlots)[number])) {
        throw new BadRequestException(`Unknown avatar slot: ${slot}`);
      }

      if (!itemKey) {
        continue;
      }

      const item = itemsByKey.get(itemKey);

      if (!item) {
        throw new BadRequestException(`Unknown avatar item: ${itemKey}`);
      }

      if (item.slot !== slot) {
        throw new BadRequestException(`Avatar item ${itemKey} does not belong to slot ${slot}.`);
      }

      if (!unlockedItemKeys.has(itemKey)) {
        throw new BadRequestException(`Avatar item ${itemKey} is not unlocked yet.`);
      }

      equippedItems[slot] = itemKey;
    }

    const normalizedEquippedItems = this.resolveEquippedItems(equippedItems, avatar.items, unlockedItemKeys);

    await this.prisma.childAvatarLoadout.upsert({
      where: { childProfileId: child.id },
      create: {
        childProfileId: child.id,
        equippedItems: normalizedEquippedItems
      },
      update: {
        equippedItems: normalizedEquippedItems
      }
    });

    return this.getAvatar(user, child.id);
  }

  private async getAccessibleChild(user: AuthenticatedUser, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: childId,
        familyId: user.familyId
      },
      select: avatarChildSelect
    });

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (user.role === Role.CHILD) {
      const ownsProfile =
        (user.childProfileId && user.childProfileId === child.id) || (!user.childProfileId && child.userId === user.sub);

      if (!ownsProfile) {
        throw new ForbiddenException('Children can only edit their own avatar.');
      }
    }

    return child;
  }

  private resolveEquippedItems(
    storedEquippedItems: Prisma.JsonValue | Record<string, string> | null | undefined,
    items: Array<{ key: string; slot: string; requiredLevel: number }>,
    unlockedItemKeys: Set<string>
  ) {
    const stored =
      storedEquippedItems && typeof storedEquippedItems === 'object' && !Array.isArray(storedEquippedItems)
        ? (storedEquippedItems as Record<string, unknown>)
        : {};
    const itemsByKey = new Map(items.map((item) => [item.key, item]));
    const resolved: Record<string, string> = {};

    for (const slot of avatarSlots) {
      const storedItemKey = typeof stored[slot] === 'string' ? (stored[slot] as string) : undefined;
      const storedItem = storedItemKey ? itemsByKey.get(storedItemKey) : undefined;

      if (storedItem && storedItem.slot === slot && unlockedItemKeys.has(storedItem.key)) {
        resolved[slot] = storedItem.key;
        continue;
      }

      const defaultItemKey = defaultEquippedItems[slot];
      const defaultItem = defaultItemKey ? itemsByKey.get(defaultItemKey) : undefined;

      if (defaultItem && defaultItem.slot === slot && unlockedItemKeys.has(defaultItem.key)) {
        resolved[slot] = defaultItem.key;
      }
    }

    return resolved;
  }
}
