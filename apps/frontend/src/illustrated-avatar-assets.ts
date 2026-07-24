const ART_ROOT = '/avatar-art/v1';

export type IllustratedAvatarAsset =
  | 'backpack-brown'
  | 'backpack-pink'
  | 'backpack-purple'
  | 'backpack-teal'
  | 'bottom-cargo-black'
  | 'bottom-cargo-green'
  | 'bottom-skirt-denim'
  | 'bottom-skirt-purple'
  | 'gadget-camera'
  | 'glasses-heart'
  | 'glasses-round-black'
  | 'glasses-square-red'
  | 'glasses-square-teal'
  | 'hair-braid-blonde'
  | 'hair-buns-pink'
  | 'hair-cap-red'
  | 'hair-curly-black'
  | 'hair-long-blonde'
  | 'hair-short-red'
  | 'hair-spiky-black'
  | 'hair-wavy-brown'
  | 'hat-beanie-gold'
  | 'hat-cap-blue'
  | 'hat-cap-teal'
  | 'hat-wizard-purple'
  | 'pet-cat'
  | 'pet-dragon'
  | 'shoes-blue'
  | 'shoes-boots-brown'
  | 'shoes-teal'
  | 'shoes-yellow'
  | 'top-hoodie-purple'
  | 'top-hoodie-teal'
  | 'top-mountain'
  | 'top-sun-yellow'
  | 'weapon-staff'
  | 'weapon-sword'
  | 'weapon-wand';

export function illustratedAssetUrl(asset: IllustratedAvatarAsset) {
  return `${ART_ROOT}/${asset}.webp`;
}

export type AvatarRigAnchor =
  | 'back'
  | 'face'
  | 'feet'
  | 'ground-left'
  | 'ground-right'
  | 'head'
  | 'head-top'
  | 'hips'
  | 'shoulders';

export interface IllustratedAttachmentLayout {
  anchor: AvatarRigAnchor;
  height: number;
  offsetX?: number;
  offsetY?: number;
  originX: number;
  originY: number;
  width: number;
}

const AVATAR_RIG_ANCHORS: Record<AvatarRigAnchor, { x: number; y: number }> = {
  back: { x: 180, y: 250 },
  face: { x: 180, y: 110 },
  feet: { x: 180, y: 462 },
  'ground-left': { x: 63, y: 458 },
  'ground-right': { x: 292, y: 460 },
  head: { x: 180, y: 94 },
  'head-top': { x: 180, y: 48 },
  hips: { x: 180, y: 315 },
  shoulders: { x: 180, y: 201 }
};

const ATTACHMENT_LAYOUTS: Record<IllustratedAvatarAsset, IllustratedAttachmentLayout> = {
  'backpack-brown': attachment('back', 154, 164, 0.5, 0.45, 0, 5),
  'backpack-pink': attachment('back', 154, 164, 0.5, 0.45, 0, 5),
  'backpack-purple': attachment('back', 154, 164, 0.5, 0.45, 0, 5),
  'backpack-teal': attachment('back', 154, 164, 0.5, 0.45, 0, 5),
  'bottom-cargo-black': attachment('hips', 126, 108, 0.5, 0.1, 0, -9),
  'bottom-cargo-green': attachment('hips', 126, 108, 0.5, 0.1, 0, -9),
  'bottom-skirt-denim': attachment('hips', 132, 94, 0.5, 0.12, 0, -9),
  'bottom-skirt-purple': attachment('hips', 134, 92, 0.5, 0.12, 0, -9),
  'gadget-camera': attachment('shoulders', 118, 91, 0.5, -0.54, 0, -1),
  'glasses-heart': attachment('face', 116, 42, 0.5, 0.5, 0, 1),
  'glasses-round-black': attachment('face', 116, 44, 0.5, 0.5, 0, 1),
  'glasses-square-red': attachment('face', 116, 42, 0.5, 0.5, 0, 1),
  'glasses-square-teal': attachment('face', 116, 42, 0.5, 0.5, 0, 1),
  'hair-braid-blonde': attachment('head', 166, 224, 0.5, 0.38, 0, -1),
  'hair-buns-pink': attachment('head', 162, 224, 0.5, 0.38, 0, -1),
  'hair-cap-red': attachment('head', 158, 224, 0.5, 0.38, 0, -1),
  'hair-curly-black': attachment('head', 166, 224, 0.5, 0.38, 0, -1),
  'hair-long-blonde': attachment('head', 166, 218, 0.5, 0.38, 0, -1),
  'hair-short-red': attachment('head', 158, 210, 0.5, 0.38, 0, -1),
  'hair-spiky-black': attachment('head', 158, 210, 0.5, 0.38, 0, -1),
  'hair-wavy-brown': attachment('head', 158, 210, 0.5, 0.38, 0, -1),
  'hat-beanie-gold': attachment('head-top', 140, 106, 0.5, 0.5, 0, -5),
  'hat-cap-blue': attachment('head-top', 146, 94, 0.5, 0.5, 0, -6),
  'hat-cap-teal': attachment('head-top', 142, 104, 0.5, 0.5, 0, -5),
  'hat-wizard-purple': attachment('head-top', 184, 152, 0.5, 0.5, 0, -18),
  'pet-cat': attachment('ground-right', 94, 132, 0.5, 1),
  'pet-dragon': attachment('ground-right', 112, 146, 0.5, 1, -2),
  'shoes-blue': attachment('feet', 132, 64, 0.5, 1),
  'shoes-boots-brown': attachment('feet', 136, 66, 0.5, 1),
  'shoes-teal': attachment('feet', 130, 66, 0.5, 1),
  'shoes-yellow': attachment('feet', 132, 64, 0.5, 1),
  'top-hoodie-purple': attachment('shoulders', 142, 146, 0.5, 0.14, 0, -1),
  'top-hoodie-teal': attachment('shoulders', 142, 148, 0.5, 0.14, 0, -1),
  'top-mountain': attachment('shoulders', 146, 145, 0.5, 0.14, 0, -1),
  'top-sun-yellow': attachment('shoulders', 142, 144, 0.5, 0.14, 0, -1),
  'weapon-staff': attachment('ground-left', 56, 320, 0.5, 1),
  'weapon-sword': attachment('ground-right', 68, 244, 0.5, 1, -9),
  'weapon-wand': attachment('ground-right', 50, 220, 0.5, 1, -9)
};

export function getIllustratedAttachmentRect(asset: IllustratedAvatarAsset) {
  const layout = ATTACHMENT_LAYOUTS[asset];
  const anchor = AVATAR_RIG_ANCHORS[layout.anchor];

  return {
    height: layout.height,
    width: layout.width,
    x: anchor.x - layout.width * layout.originX + (layout.offsetX ?? 0),
    y: anchor.y - layout.height * layout.originY + (layout.offsetY ?? 0)
  };
}

function attachment(
  anchor: AvatarRigAnchor,
  width: number,
  height: number,
  originX: number,
  originY: number,
  offsetX = 0,
  offsetY = 0
): IllustratedAttachmentLayout {
  return { anchor, height, offsetX, offsetY, originX, originY, width };
}

export function resolveIllustratedHair(itemKey: string | undefined): IllustratedAvatarAsset {
  const key = itemKey ?? '';

  if (key.includes('afro') || key.includes('curly') || key.includes('curls')) {
    return 'hair-curly-black';
  }
  if (key.includes('bun')) {
    return 'hair-buns-pink';
  }
  if (key.includes('braid') || key.includes('ponytail')) {
    return 'hair-braid-blonde';
  }
  if (key.includes('long') || key.includes('bob')) {
    return 'hair-long-blonde';
  }
  if (key.includes('sidepart') || key.includes('wave') || key.includes('swoop')) {
    return 'hair-wavy-brown';
  }
  if (key.includes('fire') || key.includes('red') || key.includes('wild')) {
    return 'hair-short-red';
  }
  return 'hair-spiky-black';
}

export function resolveIllustratedHat(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  const key = itemKey ?? '';

  if (key.includes('witch') || key.includes('wizard') || key.includes('mage')) {
    return 'hat-wizard-purple';
  }
  if (key.includes('beanie')) {
    return 'hat-beanie-gold';
  }
  if (key.includes('cap-red')) {
    return 'hat-cap-teal';
  }
  if (key.includes('cap')) {
    return 'hat-cap-blue';
  }
  return undefined;
}

export function resolveIllustratedGlasses(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  const key = itemKey ?? '';

  if (key.includes('heart')) {
    return 'glasses-heart';
  }
  if (key.includes('round')) {
    return 'glasses-round-black';
  }
  if (key.includes('square')) {
    return 'glasses-square-red';
  }
  if (key.includes('rainbow') || key.includes('magic') || key.includes('star')) {
    return 'glasses-square-teal';
  }
  return undefined;
}

export function resolveIllustratedTop(itemKey: string | undefined): IllustratedAvatarAsset {
  const key = itemKey ?? '';

  if (key.includes('hoodie') || key.includes('sweater')) {
    return key.includes('purple') || key.includes('heart') ? 'top-hoodie-purple' : 'top-hoodie-teal';
  }
  if (key.includes('smiley') || key.includes('sun')) {
    return 'top-sun-yellow';
  }
  if (key.includes('mage') || key.includes('cape') || key.includes('royal')) {
    return 'top-hoodie-purple';
  }
  return 'top-mountain';
}

export function resolveIllustratedBottom(itemKey: string | undefined): IllustratedAvatarAsset {
  const key = itemKey ?? '';

  if (key.includes('skirt')) {
    return key.includes('purple') || key.includes('rainbow') || key.includes('striped')
      ? 'bottom-skirt-purple'
      : 'bottom-skirt-denim';
  }
  if (key.includes('cargo') || key.includes('green')) {
    return 'bottom-cargo-green';
  }
  return 'bottom-cargo-black';
}

export function resolveIllustratedShoes(itemKey: string | undefined): IllustratedAvatarAsset {
  const key = itemKey ?? '';

  if (key.includes('boot')) {
    return 'shoes-boots-brown';
  }
  if (key.includes('gold') || key.includes('yellow')) {
    return 'shoes-yellow';
  }
  if (key.includes('blue')) {
    return 'shoes-blue';
  }
  return 'shoes-teal';
}

export function resolveIllustratedBackpack(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  const key = itemKey ?? '';

  if (!key.includes('backpack') && !key.includes('bag')) {
    return undefined;
  }
  if (key.includes('pink')) {
    return 'backpack-pink';
  }
  if (key.includes('purple') || key.includes('magic')) {
    return 'backpack-purple';
  }
  if (key.includes('brown')) {
    return 'backpack-brown';
  }
  return 'backpack-teal';
}

export function resolveIllustratedGadget(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  return itemKey?.includes('camera') ? 'gadget-camera' : undefined;
}

export function resolveIllustratedWeapon(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  const key = itemKey ?? '';

  if (key.includes('wand')) {
    return 'weapon-wand';
  }
  if (key.includes('sword')) {
    return 'weapon-sword';
  }
  if (key.includes('stick') || key.includes('staff')) {
    return 'weapon-staff';
  }
  return undefined;
}

export function resolveIllustratedPet(itemKey: string | undefined): IllustratedAvatarAsset | undefined {
  const key = itemKey ?? '';

  if (key.includes('cat')) {
    return 'pet-cat';
  }
  if (key.includes('dragon')) {
    return 'pet-dragon';
  }
  return undefined;
}

export function resolveIllustratedAssetForItem(slot: string, itemKey: string): IllustratedAvatarAsset | undefined {
  if (slot === 'hair') {
    return resolveIllustratedHair(itemKey);
  }
  if (slot === 'hat') {
    return resolveIllustratedHat(itemKey);
  }
  if (slot === 'glasses') {
    return resolveIllustratedGlasses(itemKey);
  }
  if (slot === 'top') {
    return resolveIllustratedTop(itemKey);
  }
  if (slot === 'bottom') {
    return resolveIllustratedBottom(itemKey);
  }
  if (slot === 'shoes') {
    return resolveIllustratedShoes(itemKey);
  }
  if (slot === 'gadget') {
    return resolveIllustratedGadget(itemKey) ?? resolveIllustratedBackpack(itemKey);
  }
  if (slot === 'weapon') {
    return resolveIllustratedWeapon(itemKey);
  }
  if (slot === 'pet') {
    return resolveIllustratedPet(itemKey);
  }
  return undefined;
}
