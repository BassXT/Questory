import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SoftAdventureAvatarGraphic } from './soft-avatar-renderer';

export type AvatarSlot =
  | 'background'
  | 'body'
  | 'hair'
  | 'eyes'
  | 'mouth'
  | 'hat'
  | 'bottom'
  | 'top'
  | 'shoes'
  | 'glasses'
  | 'gadget'
  | 'weapon'
  | 'pet';

export interface AvatarItem {
  key: string;
  slot: AvatarSlot;
  name: string;
  description: string | null;
  requiredLevel: number;
  rarity: string;
  layerOrder: number;
  colorPrimary: string | null;
  colorSecondary: string | null;
  isUnlocked: boolean;
  unlockReason: 'LEVEL' | 'INVENTORY' | 'LOCKED';
}

export interface AvatarResponse {
  child: {
    id: string;
    displayName: string;
    level: number;
    xp: number;
    coins: number;
  };
  slots: AvatarSlot[];
  equippedItems: Record<string, string>;
  unlockedItemKeys: string[];
  items: AvatarItem[];
}

interface AvatarChildOption {
  id: string;
  displayName: string;
  level: number;
  xp: number;
  coins: number;
}

interface AvatarBuilderPanelProps {
  allowChildChange?: boolean;
  avatar: AvatarResponse | null;
  children: AvatarChildOption[];
  loading: boolean;
  saving: boolean;
  selectedChildId: string;
  onChildChange: (childProfileId: string) => void;
  onSave: (equippedItems: Record<string, string>) => void;
}

const slotLabels: Record<AvatarSlot, string> = {
  background: 'Szene',
  body: 'Figur',
  hair: 'Haare',
  eyes: 'Augen',
  mouth: 'Mund',
  hat: 'Hut',
  top: 'Oberteil',
  bottom: 'Hose',
  shoes: 'Schuhe',
  glasses: 'Brille',
  gadget: 'Gadget',
  weapon: 'Waffe',
  pet: 'Tier'
};

const slotOrder: AvatarSlot[] = ['background', 'body', 'hair', 'eyes', 'mouth', 'hat', 'top', 'bottom', 'shoes', 'glasses', 'gadget', 'weapon', 'pet'];
const optionalSlots = new Set<AvatarSlot>(['hat', 'glasses', 'gadget', 'weapon', 'pet']);
const styleOnlySlots = new Set<AvatarSlot>(['hair', 'eyes']);

const avatarAppearanceColors = {
  hairColor: [
    { label: 'Braun', color: '#5b3826' },
    { label: 'Dunkel', color: '#2f2a28' },
    { label: 'Kastanie', color: '#7a4729' },
    { label: 'Blond', color: '#e8c46a' },
    { label: 'Kupfer', color: '#b45a2a' },
    { label: 'Silber', color: '#d8dce6' },
    { label: 'Rosa', color: '#d96aa8' },
    { label: 'Lila', color: '#8a5bd8' },
    { label: 'Türkis', color: '#38a6a5' },
    { label: 'Blau', color: '#3c79d8' },
    { label: 'Rot', color: '#d63f61' }
  ],
  eyesColor: [
    { label: 'Dunkel', color: '#28384f' },
    { label: 'Blau', color: '#2f74d0' },
    { label: 'Grün', color: '#2f8f6f' },
    { label: 'Braun', color: '#6f4a2f' },
    { label: 'Grau', color: '#667085' },
    { label: 'Bernstein', color: '#c98b24' },
    { label: 'Violett', color: '#7a5ccf' },
    { label: 'Magieblau', color: '#29b6f6' }
  ]
} as const;

export function AvatarBuilderPanel({
  allowChildChange = true,
  avatar,
  children,
  loading,
  saving,
  selectedChildId,
  onChildChange,
  onSave
}: AvatarBuilderPanelProps) {
  const [draftLoadout, setDraftLoadout] = useState<Record<string, string>>({});
  const [selectedSlot, setSelectedSlot] = useState<AvatarSlot>('top');
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const itemsByKey = useMemo(() => new Map((avatar?.items ?? []).map((item) => [item.key, item])), [avatar?.items]);
  const visibleSlots = avatar?.slots.length ? orderSlots(avatar.slots) : slotOrder;
  const slotItems = useMemo(
    () => getVisibleSlotItems(avatar?.items ?? [], selectedSlot),
    [avatar?.items, selectedSlot]
  );
  const unlockedCount = avatar?.items.filter((item) => item.isUnlocked).length ?? 0;
  const normalizedDraft = normalizeLoadout(draftLoadout, visibleSlots);
  const normalizedSaved = normalizeLoadout(avatar?.equippedItems ?? {}, visibleSlots);
  const hasChanges = JSON.stringify(normalizedDraft) !== JSON.stringify(normalizedSaved);

  useEffect(() => {
    setDraftLoadout(avatar?.equippedItems ?? {});
  }, [avatar?.child.id, avatar?.equippedItems]);

  function equipItem(item: AvatarItem) {
    if (!item.isUnlocked) {
      return;
    }

    setDraftLoadout((currentLoadout) => ({
      ...currentLoadout,
      [item.slot]: item.key
    }));
  }

  function clearOptionalSlot(slot: AvatarSlot) {
    setDraftLoadout((currentLoadout) => {
      const nextLoadout = { ...currentLoadout };
      delete nextLoadout[slot];
      return nextLoadout;
    });
  }

  function selectAppearanceColor(key: keyof typeof avatarAppearanceColors, color: string) {
    setDraftLoadout((currentLoadout) => ({
      ...currentLoadout,
      [key]: color
    }));
  }

  return (
    <Paper elevation={0} sx={{ maxWidth: '100%', overflow: 'hidden', p: { xs: 1.25, sm: 2, md: 2.5 } }}>
      <Stack spacing={2} sx={{ maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
              <CheckroomRoundedIcon />
            </Box>
            <Typography variant="h6">Avatar-Werkstatt</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip icon={<AutoAwesomeRoundedIcon />} label={avatar ? `Level ${avatar.child.level}` : 'Kein Level'} variant="outlined" />
            <Chip label={`${unlockedCount}/${avatar?.items.length ?? 0} frei`} variant="outlined" />
          </Stack>
        </Box>

        <Box
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
            bgcolor: 'action.hover',
            borderRadius: 2,
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 0.6fr) minmax(0, 1fr)' },
            minWidth: 0,
            overflow: 'hidden',
            p: 1.25
          }}
        >
          {allowChildChange ? (
            <TextField
              disabled={children.length === 0}
              label="Aktives Kind"
              onChange={(event) => onChildChange(event.target.value)}
              select
              size="small"
              value={selectedChildId}
            >
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.displayName}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Box sx={{ minWidth: 0 }}>
              <Typography color="text.secondary" variant="body2">
                Aktives Kind
              </Typography>
              <Typography sx={{ fontWeight: 900 }} noWrap>
                {selectedChild ? selectedChild.displayName : 'Kein Kind'}
              </Typography>
            </Box>
          )}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
            <Chip label={selectedChild ? `${selectedChild.xp} XP` : '0 XP'} variant="outlined" />
            <Chip label={selectedChild ? `${selectedChild.coins} Münzen` : '0 Münzen'} variant="outlined" />
            <Chip label={selectedChild ? selectedChild.displayName : 'Kein Kind'} variant="outlined" />
          </Stack>
        </Box>

        {loading ? <LinearProgress /> : null}

        {avatar ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              minWidth: 0,
              overflow: 'hidden',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 0.8fr) minmax(0, 1.2fr)' }
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                gap: 1.5,
                justifyItems: 'center',
                maxWidth: '100%',
                minWidth: 0,
                overflow: 'hidden',
                p: { xs: 1, sm: 1.5 }
              }}
            >
              <AvatarPreview childName={avatar.child.displayName} equippedItems={draftLoadout} itemsByKey={itemsByKey} />
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip icon={<PaletteRoundedIcon />} label={avatar.child.displayName} variant="outlined" />
                <Chip label={`Level ${avatar.child.level}`} variant="outlined" />
              </Stack>
              <Button
                disabled={!hasChanges || saving}
                fullWidth
                onClick={() => onSave(normalizedDraft)}
                startIcon={<SaveRoundedIcon />}
                variant="contained"
              >
                Speichern
              </Button>
            </Box>

            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: { xs: 'nowrap', md: 'wrap' },
                  overflowX: { xs: 'auto', md: 'visible' },
                  pb: { xs: 0.5, md: 0 },
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {visibleSlots.map((slot) => (
                  <Chip
                    color={selectedSlot === slot ? 'primary' : 'default'}
                    key={slot}
                    label={slotLabels[slot]}
                    onClick={() => setSelectedSlot(slot)}
                    variant={selectedSlot === slot ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>

              {selectedSlot === 'hair' ? (
                <AppearanceColorPicker
                  label="Haarfarbe"
                  options={avatarAppearanceColors.hairColor}
                  selectedColor={getAppearanceColor(draftLoadout, 'hairColor')}
                  onSelect={(color) => selectAppearanceColor('hairColor', color)}
                />
              ) : null}

              {selectedSlot === 'eyes' ? (
                <AppearanceColorPicker
                  label="Augenfarbe"
                  options={avatarAppearanceColors.eyesColor}
                  selectedColor={getAppearanceColor(draftLoadout, 'eyesColor')}
                  onSelect={(color) => selectAppearanceColor('eyesColor', color)}
                />
              ) : null}

              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' }
                }}
              >
                {optionalSlots.has(selectedSlot) ? (
                  <AvatarItemOption
                    active={!draftLoadout[selectedSlot]}
                    item={null}
                    onSelect={() => clearOptionalSlot(selectedSlot)}
                  />
                ) : null}

                {slotItems.map((item) => (
                  <AvatarItemOption
                    active={isAvatarOptionActive(item, draftLoadout, itemsByKey)}
                    item={item}
                    key={item.key}
                    onSelect={() => equipItem(item)}
                  />
                ))}
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
            <Typography color="text.secondary">Noch kein Kind für den Avatar ausgewählt</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

interface AvatarItemOptionProps {
  active: boolean;
  item: AvatarItem | null;
  onSelect: () => void;
}

function AvatarItemOption({ active, item, onSelect }: AvatarItemOptionProps) {
  const locked = item ? !item.isUnlocked : false;

  return (
    <Button
      disabled={locked}
      disableRipple
      onClick={onSelect}
      sx={{
        alignItems: 'stretch',
        borderColor: active ? 'primary.main' : 'divider',
        color: 'text.primary',
        display: 'grid',
        gap: 0.75,
        justifyContent: 'stretch',
        minWidth: 0,
        minHeight: 108,
        p: 1.25,
        textAlign: 'left'
      }}
      variant="outlined"
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {item?.name ?? 'Leer'}
        </Typography>
        <Chip
          color={active ? 'primary' : locked ? 'default' : 'success'}
          icon={locked ? <LockRoundedIcon /> : undefined}
          label={item ? (locked ? `Level ${item.requiredLevel}` : rarityLabel(item.rarity)) : 'frei'}
          size="small"
          variant={active ? 'filled' : 'outlined'}
        />
      </Stack>
      <Typography color="text.secondary" sx={{ minHeight: 38 }} variant="body2">
        {item?.description ?? 'Kein Extra für diesen Slot.'}
      </Typography>
      {item && !styleOnlySlots.has(item.slot) ? (
        <Stack direction="row" spacing={0.75}>
          <ColorSwatch color={item.colorPrimary ?? '#7d8da8'} />
          <ColorSwatch color={item.colorSecondary ?? '#f2c078'} />
        </Stack>
      ) : null}
    </Button>
  );
}

function AppearanceColorPicker({
  label,
  options,
  selectedColor,
  onSelect
}: {
  label: string;
  options: ReadonlyArray<{ label: string; color: string }>;
  selectedColor: string;
  onSelect: (color: string) => void;
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        minWidth: 0,
        p: 1
      }}
    >
      <Typography sx={{ fontWeight: 900 }} variant="body2">
        {label}
      </Typography>
      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          minWidth: 0,
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: { xs: 0.25, sm: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {options.map((option) => {
          const active = selectedColor === option.color;

          return (
            <Button
              aria-label={option.label}
              key={option.color}
              onClick={() => onSelect(option.color)}
              sx={{
                borderColor: active ? 'primary.main' : 'divider',
                borderRadius: 999,
                flex: '0 0 auto',
                minWidth: 38,
                p: 0.35
              }}
              variant="outlined"
            >
              <Box
                sx={{
                  bgcolor: option.color,
                  border: '1px solid',
                  borderColor: active ? 'primary.main' : 'divider',
                  borderRadius: 999,
                  boxShadow: active ? '0 0 0 3px rgba(47, 116, 208, 0.2)' : 'none',
                  height: 26,
                  width: 26
                }}
              />
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}

function AvatarPreview({
  childName,
  equippedItems,
  itemsByKey
}: {
  childName: string;
  equippedItems: Record<string, string>;
  itemsByKey: Map<string, AvatarItem>;
}) {
  const background = getEquippedItem(equippedItems, itemsByKey, 'background');
  const body = getEquippedItem(equippedItems, itemsByKey, 'body');
  const hair = getEquippedItem(equippedItems, itemsByKey, 'hair');
  const eyes = getEquippedItem(equippedItems, itemsByKey, 'eyes');
  const mouth = getEquippedItem(equippedItems, itemsByKey, 'mouth');
  const hat = getEquippedItem(equippedItems, itemsByKey, 'hat');
  const top = getEquippedItem(equippedItems, itemsByKey, 'top');
  const bottom = getEquippedItem(equippedItems, itemsByKey, 'bottom');
  const shoes = getEquippedItem(equippedItems, itemsByKey, 'shoes');
  const glasses = getEquippedItem(equippedItems, itemsByKey, 'glasses');
  const gadget = getEquippedItem(equippedItems, itemsByKey, 'gadget');
  const weapon = getEquippedItem(equippedItems, itemsByKey, 'weapon');
  const pet = getEquippedItem(equippedItems, itemsByKey, 'pet');
  const hairColor = getAppearanceColor(equippedItems, 'hairColor');
  const eyesColor = getAppearanceColor(equippedItems, 'eyesColor');
  const equipmentChips = [
    hat ? `Hut: ${hat.name}` : null,
    glasses ? `Brille: ${glasses.name}` : null,
    gadget ? `Gadget: ${gadget.name}` : null,
    weapon ? `Waffe: ${weapon.name}` : null,
    pet ? `Tier: ${pet.name}` : null
  ].filter(Boolean);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        justifyItems: 'center',
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <Box
        sx={{
          aspectRatio: '9 / 13',
          bgcolor: background?.colorPrimary ?? '#d9f2df',
          borderStyle: 'solid',
          borderWidth: { xs: 6, sm: 8, md: 10 },
          borderColor: 'rgba(255,255,255,0.46)',
          borderRadius: 4,
          boxShadow: { xs: '0 10px 24px rgba(23, 32, 51, 0.14)', sm: '0 18px 45px rgba(23, 32, 51, 0.18)' },
          contain: 'layout paint',
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: { xs: 'min(190px, 56vw)', sm: 250, md: 310 }
        }}
      >
        <SoftAdventureAvatarGraphic
          ariaLabel={getAvatarAlt(childName)}
          background={background}
          body={body}
          bottom={bottom}
          eyes={eyes}
          eyesColor={eyesColor}
          gadget={gadget}
          glasses={glasses}
          hair={hair}
          hairColor={hairColor}
          hat={hat}
          mouth={mouth}
          pet={pet}
          shoes={shoes}
          style={{
            display: 'block',
            height: '100%',
            inset: 0,
            maxWidth: 'none',
            minWidth: 0,
            overflow: 'hidden',
            position: 'absolute',
            width: '100%'
          }}
          top={top}
          weapon={weapon}
        />
      </Box>
      {equipmentChips.length > 0 ? (
        <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'center', flexWrap: 'wrap', maxWidth: '100%', minWidth: 0 }}>
          {equipmentChips.map((label) => (
            <Chip key={label} label={label} size="small" variant="outlined" />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

function resolvePixelHair(itemKey: string | undefined) {
  switch (itemKey) {
    case 'hair-pixel-crop-blond':
      return 'short05';
    case 'hair-pixel-crop-black':
      return 'short02';
    case 'hair-pixel-sidepart-blond':
      return 'short06';
    case 'hair-pixel-sidepart-brown':
      return 'short07';
    case 'hair-pixel-bowl-brown':
      return 'short04';
    case 'hair-pixel-pixie-black':
    case 'hair-pixel-pixie-pink':
      return 'short18';
    case 'hair-pixel-bob-brown':
      return 'long04';
    case 'hair-pixel-bob-red':
      return 'long06';
    case 'hair-pixel-waves-black':
      return 'long10';
    case 'hair-pixel-waves-auburn':
      return 'long11';
    case 'hair-pixel-ponytail-gold':
      return 'long13';
    case 'hair-pixel-ponytail-black':
      return 'long14';
    case 'hair-pixel-curls-chestnut':
      return 'short15';
    case 'hair-pixel-curls-blond':
      return 'short16';
    case 'hair-pixel-braids-brown':
      return 'long19';
    case 'hair-pixel-braids-purple':
    case 'hair-pixel-twin-braids-blue':
      return 'long20';
    case 'hair-pixel-twin-braids-blond':
      return 'long17';
    case 'hair-pixel-spikes-black':
      return 'short20';
    case 'hair-pixel-spikes-green':
    case 'hair-pixel-mohawk-blue':
      return 'short22';
    case 'hair-pixel-long-rose':
      return 'long08';
    case 'hair-pixel-long-silver':
    case 'hair-pixel-comet-white':
      return 'long09';
    case 'hair-pixel-long-teal':
      return 'long12';
    case 'hair-pixel-buns-gold':
    case 'hair-pixel-space-buns-rose':
      return 'long18';
    case 'hair-pixel-buns-teal':
      return 'long21';
    case 'hair-pixel-afro-dark':
      return 'short23';
    case 'hair-pixel-afro-copper':
    case 'hair-pixel-fire-red':
      return 'short24';
    case 'hair-pixel-curly-purple':
      return 'short17';
    case 'hair-pixel-undercut-silver':
      return 'short19';
    case 'hair-pixel-long':
      return 'long05';
    case 'hair-pixel-wild':
      return 'short20';
    case 'hair-pixel-blue':
      return 'short13';
    case 'hair-buns':
      return 'long19';
    case 'hair-curly':
      return 'short15';
    case 'hair-silver':
      return 'long09';
    default:
      return 'short01';
  }
}

function resolvePixelEyes(itemKey: string | undefined) {
  switch (itemKey) {
    case 'eyes-smile':
    case 'eyes-happy-arc':
    case 'eyes-blue':
    case 'eyes-green':
    case 'eyes-brown':
    case 'eyes-gray':
    case 'eyes-amber':
      return 'variant01';
    case 'eyes-calm':
      return 'variant02';
    case 'eyes-round':
      return 'variant03';
    case 'eyes-curious':
      return 'variant04';
    case 'eyes-focus':
    case 'eyes-determined':
      return 'variant09';
    case 'eyes-wink':
      return 'variant05';
    case 'eyes-sleepy':
      return 'variant10';
    case 'eyes-violet':
    case 'eyes-star':
    case 'eyes-magic-blue':
    case 'eyes-emerald-spark':
    case 'eyes-night':
      return 'variant12';
    default:
      return 'variant08';
  }
}

function getAvatarAlt(childName: string) {
  return childName.toLowerCase().includes('avatar') ? childName : `${childName} Avatar`;
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <Box
      sx={{
        bgcolor: color,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 999,
        height: 18,
        width: 18
      }}
    />
  );
}

function getEquippedItem(
  equippedItems: Record<string, string>,
  itemsByKey: Map<string, AvatarItem>,
  slot: AvatarSlot
): AvatarItem | undefined {
  const itemKey = equippedItems[slot];
  const item = itemKey ? itemsByKey.get(itemKey) : undefined;
  return item?.slot === slot ? item : undefined;
}

function orderSlots(slots: AvatarSlot[]) {
  return slotOrder.filter((slot) => slots.includes(slot));
}

function compareAvatarItems(first: AvatarItem, second: AvatarItem) {
  return first.requiredLevel - second.requiredLevel || first.layerOrder - second.layerOrder || first.name.localeCompare(second.name);
}

function getVisibleSlotItems(items: AvatarItem[], selectedSlot: AvatarSlot) {
  const slotItems = items.filter((item) => item.slot === selectedSlot).sort(compareAvatarItems);

  if (!styleOnlySlots.has(selectedSlot)) {
    return slotItems;
  }

  const itemsByStyle = new Map<string, AvatarItem>();

  for (const item of slotItems) {
    const styleKey = getAvatarStyleKey(item);
    const existingItem = itemsByStyle.get(styleKey);

    if (!existingItem || compareAvatarItems(item, existingItem) < 0) {
      itemsByStyle.set(styleKey, toStyleOnlyItem(item));
    }
  }

  return Array.from(itemsByStyle.values()).sort(compareAvatarItems);
}

function isAvatarOptionActive(item: AvatarItem, loadout: Record<string, string>, itemsByKey: Map<string, AvatarItem>) {
  const equippedItem = getEquippedItem(loadout, itemsByKey, item.slot);

  if (!equippedItem) {
    return false;
  }

  if (styleOnlySlots.has(item.slot)) {
    return getAvatarStyleKey(equippedItem) === getAvatarStyleKey(item);
  }

  return equippedItem.key === item.key;
}

function getAvatarStyleKey(item: AvatarItem) {
  if (item.slot === 'hair') {
    return resolvePixelHair(item.key);
  }

  if (item.slot === 'eyes') {
    return resolvePixelEyes(item.key);
  }

  return item.key;
}

function toStyleOnlyItem(item: AvatarItem): AvatarItem {
  if (item.slot === 'hair') {
    return {
      ...item,
      name: getHairStyleName(resolvePixelHair(item.key), item.name),
      description: 'Frisur-Stil. Die Haarfarbe kannst du frei wählen.'
    };
  }

  if (item.slot === 'eyes') {
    return {
      ...item,
      name: getEyesStyleName(resolvePixelEyes(item.key), item.name),
      description: 'Blick-Stil. Die Augenfarbe kannst du frei wählen.'
    };
  }

  return item;
}

function getHairStyleName(styleKey: string, fallbackName: string) {
  const labels: Record<string, string> = {
    long04: 'Bob',
    long05: 'Langhaar',
    long06: 'Runder Bob',
    long08: 'Langes Haar',
    long09: 'Glattes Langhaar',
    long10: 'Weiche Wellen',
    long11: 'Wellen',
    long12: 'Langes Abenteuerhaar',
    long13: 'Pferdeschwanz',
    long14: 'Langer Zopf',
    long17: 'Doppelzöpfe',
    long18: 'Duttknoten',
    long19: 'Zöpfe',
    long20: 'Abenteuerzöpfe',
    long21: 'Hohe Duttknoten',
    short01: 'Abenteuer-Schopf',
    short02: 'Kurzschnitt',
    short04: 'Pilzkopf',
    short05: 'Kurzer Schopf',
    short06: 'Seitenscheitel',
    short07: 'Klassischer Seitenscheitel',
    short13: 'Strähnenlook',
    short15: 'Locken',
    short16: 'Runde Locken',
    short17: 'Wilde Locken',
    short18: 'Pixie',
    short19: 'Undercut',
    short20: 'Stachelhaare',
    short22: 'Iro',
    short23: 'Wolkenlocken',
    short24: 'Große Locken'
  };

  return labels[styleKey] ?? fallbackName;
}

function getEyesStyleName(styleKey: string, fallbackName: string) {
  const labels: Record<string, string> = {
    variant01: 'Freundlicher Blick',
    variant02: 'Ruhiger Blick',
    variant03: 'Runde Augen',
    variant04: 'Neugierblick',
    variant05: 'Zwinkerblick',
    variant08: 'Wache Augen',
    variant09: 'Fokusblick',
    variant10: 'Träumerblick',
    variant12: 'Funkelblick'
  };

  return labels[styleKey] ?? fallbackName;
}

function getAppearanceColor(loadout: Record<string, string>, key: keyof typeof avatarAppearanceColors) {
  const colors: string[] = avatarAppearanceColors[key].map((option) => option.color);
  const selectedColor = loadout[key];
  return colors.includes(selectedColor) ? selectedColor : colors[0];
}

function normalizeLoadout(loadout: Record<string, string>, slots: AvatarSlot[]) {
  const normalized = slots.reduce<Record<string, string>>((normalizedSlots, slot) => {
    if (loadout[slot]) {
      normalizedSlots[slot] = loadout[slot];
    }

    return normalizedSlots;
  }, {});

  normalized.hairColor = getAppearanceColor(loadout, 'hairColor');
  normalized.eyesColor = getAppearanceColor(loadout, 'eyesColor');

  return normalized;
}

function rarityLabel(rarity: string) {
  const labels: Record<string, string> = {
    COMMON: 'Basis',
    UNCOMMON: 'Selten',
    RARE: 'Rare',
    EPIC: 'Episch'
  };

  return labels[rarity] ?? rarity;
}

