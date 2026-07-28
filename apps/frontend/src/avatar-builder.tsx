import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export type AvatarSlot = 'character' | 'pet';

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
  audienceGender: string | null;
  isUnlocked: boolean;
  unlockReason: 'LEVEL' | 'INVENTORY' | 'LOCKED';
}

export interface AvatarResponse {
  child: {
    id: string;
    displayName: string;
    gender: string | null;
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

type HairColorKey = 'red' | 'pink' | 'blue' | 'brown' | 'blonde' | 'black';
type CharacterStyle =
  | 'smiley'
  | 'boy-side-swept'
  | 'boy-knight'
  | 'boy-astronaut'
  | 'explorer'
  | 'star'
  | 'wizard'
  | 'girl-knight'
  | 'girl-astronaut';

interface CharacterVariant {
  baseItemKey: string;
  color: HairColorKey;
  style: CharacterStyle;
}

const hairColors: Array<{ key: HairColorKey; label: string; value: string }> = [
  { key: 'red', label: 'Rot', value: '#b64b32' },
  { key: 'pink', label: 'Rosa', value: '#d8589d' },
  { key: 'blue', label: 'Blau', value: '#2877bd' },
  { key: 'brown', label: 'Braun', value: '#68422d' },
  { key: 'blonde', label: 'Blond', value: '#e7bd59' },
  { key: 'black', label: 'Schwarz', value: '#202531' }
];

const characterVariantGroups: Array<{
  baseColor: HairColorKey;
  baseItemKey: string;
  style: CharacterStyle;
}> = [
  { baseColor: 'red', baseItemKey: 'character-smiley', style: 'smiley' },
  { baseColor: 'red', baseItemKey: 'character-boy-side', style: 'boy-side-swept' },
  { baseColor: 'red', baseItemKey: 'character-boy-knight', style: 'boy-knight' },
  { baseColor: 'red', baseItemKey: 'character-boy-astronaut', style: 'boy-astronaut' },
  { baseColor: 'blonde', baseItemKey: 'character-explorer', style: 'explorer' },
  { baseColor: 'pink', baseItemKey: 'character-star', style: 'star' },
  { baseColor: 'blonde', baseItemKey: 'character-wizard', style: 'wizard' },
  { baseColor: 'pink', baseItemKey: 'character-girl-knight', style: 'girl-knight' },
  { baseColor: 'pink', baseItemKey: 'character-girl-astronaut', style: 'girl-astronaut' }
];

const characterVariants: Record<string, CharacterVariant> = Object.fromEntries(
  characterVariantGroups.flatMap((group) =>
    hairColors.map((color) => {
      const itemKey = color.key === group.baseColor ? group.baseItemKey : `${group.baseItemKey}-${color.key}`;

      return [
        itemKey,
        {
          baseItemKey: group.baseItemKey,
          color: color.key,
          style: group.style
        }
      ];
    })
  )
);

const avatarAssetPaths: Record<string, string> = {
  'character-astronaut': '/avatar-complete/v1/characters/astronaut.png',
  'character-hoodie-teal': '/avatar-complete/v1/characters/hoodie-teal.png',
  'character-knight': '/avatar-complete/v1/characters/knight.png',
  'character-sunflower': '/avatar-complete/v1/characters/sunflower.png',
  'pet-bunny': '/avatar-complete/v1/pets/bunny.png',
  'pet-cat': '/avatar-complete/v1/pets/cat.png',
  'pet-dog': '/avatar-complete/v1/pets/dog.png',
  'pet-dragon': '/avatar-complete/v1/pets/dragon.png',
  'pet-elephant': '/avatar-complete/v1/pets/elephant.png',
  'pet-fox': '/avatar-complete/v1/pets/fox.png',
  'pet-lion': '/avatar-complete/v1/pets/lion.png',
  'pet-tiger': '/avatar-complete/v1/pets/tiger.png'
};

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
  const [selectedSlot, setSelectedSlot] = useState<AvatarSlot>('character');
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const itemsByKey = useMemo(() => new Map((avatar?.items ?? []).map((item) => [item.key, item])), [avatar?.items]);
  const visibleItems = useMemo(() => getVisibleAvatarItems(avatar?.items ?? []), [avatar?.items]);
  const slotItems = useMemo(
    () => visibleItems.filter((item) => item.slot === selectedSlot).sort(compareAvatarItems),
    [selectedSlot, visibleItems]
  );
  const unlockedCount = visibleItems.filter((item) => item.isUnlocked).length;
  const selectedCharacterVariant = draftLoadout.character
    ? characterVariants[draftLoadout.character]
    : undefined;
  const normalizedDraft = normalizeLoadout(draftLoadout);
  const normalizedSaved = normalizeLoadout(avatar?.equippedItems ?? {});
  const hasChanges = JSON.stringify(normalizedDraft) !== JSON.stringify(normalizedSaved);

  useEffect(() => {
    setDraftLoadout(avatar?.equippedItems ?? {});
  }, [avatar?.child.id, avatar?.equippedItems]);

  function equipItem(item: AvatarItem) {
    if (!item.isUnlocked) {
      return;
    }

    const itemKey =
      item.slot === 'character'
        ? resolveCharacterVariantKey(
            item.key,
            selectedCharacterVariant?.color,
            itemsByKey
          )
        : item.key;

    setDraftLoadout((currentLoadout) => ({
      ...currentLoadout,
      [item.slot]: itemKey
    }));
  }

  function selectHairColor(color: HairColorKey) {
    const currentCharacterKey = draftLoadout.character;
    if (!currentCharacterKey || !characterVariants[currentCharacterKey]) {
      return;
    }

    const targetKey = resolveCharacterVariantKey(currentCharacterKey, color, itemsByKey);
    const targetItem = itemsByKey.get(targetKey);

    if (!targetItem?.isUnlocked) {
      return;
    }

    setDraftLoadout((currentLoadout) => ({
      ...currentLoadout,
      character: targetKey
    }));
  }

  function clearPet() {
    setDraftLoadout((currentLoadout) => {
      const nextLoadout = { ...currentLoadout };
      delete nextLoadout.pet;
      return nextLoadout;
    });
  }

  return (
    <Paper
      elevation={0}
      sx={{ boxSizing: 'border-box', maxWidth: '100%', overflow: 'hidden', p: { xs: 1.25, sm: 2, md: 2.5 }, width: '100%' }}
    >
      <Stack spacing={2} sx={{ maxWidth: '100%', minWidth: 0 }}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.25,
            justifyContent: 'space-between'
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
              <PaletteRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6">Avatar-Werkstatt</Typography>
              <Typography color="text.secondary" variant="body2">
                Wähle eine Figur und einen Begleiter.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip icon={<AutoAwesomeRoundedIcon />} label={avatar ? `Level ${avatar.child.level}` : 'Kein Level'} variant="outlined" />
            <Chip label={`${unlockedCount} freigeschaltet`} variant="outlined" />
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
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 0.8fr) minmax(0, 1.2fr)' },
              minWidth: 0
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                gap: 1.25,
                justifyItems: 'center',
                minWidth: 0,
                p: { xs: 1, sm: 1.5 }
              }}
            >
              <AvatarPreview
                childName={avatar.child.displayName}
                equippedItems={draftLoadout}
                itemsByKey={itemsByKey}
              />
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

            <Stack spacing={1.5} sx={{ maxWidth: '100%', minWidth: 0, overflow: 'hidden', width: '100%' }}>
              <Tabs
                aria-label="Avatar-Auswahl"
                onChange={(_event, value: AvatarSlot) => setSelectedSlot(value)}
                sx={{
                  maxWidth: '100%',
                  minWidth: 0,
                  '& .MuiTab-root': { minWidth: 0 }
                }}
                value={selectedSlot}
                variant="fullWidth"
              >
                <Tab icon={<PersonRoundedIcon />} iconPosition="start" label="Figur" value="character" />
                <Tab icon={<PetsRoundedIcon />} iconPosition="start" label="Tier" value="pet" />
              </Tabs>

              {selectedSlot === 'character' && selectedCharacterVariant ? (
                <HairColorPicker
                  onSelect={selectHairColor}
                  selectedColor={selectedCharacterVariant.color}
                />
              ) : null}

              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridAutoColumns: { xs: 'minmax(148px, 44vw)', sm: 'auto' },
                  gridAutoFlow: { xs: 'column', sm: 'row' },
                  gridTemplateColumns: { xs: 'none', sm: 'repeat(3, minmax(0, 1fr))' },
                  maxWidth: '100%',
                  minWidth: 0,
                  overflowX: { xs: 'auto', sm: 'visible' },
                  pb: { xs: 0.5, sm: 0 },
                  scrollSnapType: { xs: 'x proximity', sm: 'none' },
                  scrollbarWidth: 'none',
                  width: '100%',
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {selectedSlot === 'pet' ? (
                  <AvatarItemOption active={!draftLoadout.pet} item={null} onSelect={clearPet} />
                ) : null}
                {slotItems.map((item) => {
                  const previewItemKey =
                    item.slot === 'character'
                      ? resolveCharacterVariantKey(
                          item.key,
                          selectedCharacterVariant?.color,
                          itemsByKey
                        )
                      : item.key;
                  const active =
                    item.slot === 'character'
                      ? getBaseCharacterKey(draftLoadout.character) ===
                        getBaseCharacterKey(item.key)
                      : draftLoadout[item.slot] === item.key;

                  return (
                    <AvatarItemOption
                      active={active}
                      item={item}
                      key={item.key}
                      onSelect={() => equipItem(item)}
                      previewItemKey={previewItemKey}
                    />
                  );
                })}
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
            <Typography color="text.secondary">Noch kein Kind für den Avatar ausgewählt.</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
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
  const character = getEquippedItem(equippedItems, itemsByKey, 'character');
  const pet = getEquippedItem(equippedItems, itemsByKey, 'pet');
  const characterAsset = character ? getAvatarAssetPath(character.key) : undefined;
  const petAsset = pet ? avatarAssetPaths[pet.key] : undefined;
  const baseCharacterKey = getBaseCharacterKey(character?.key);
  const characterDisplayName = baseCharacterKey
    ? (itemsByKey.get(baseCharacterKey)?.name ?? character?.name)
    : undefined;

  return (
    <Stack spacing={1} sx={{ alignItems: 'center', maxWidth: '100%', minWidth: 0, width: '100%' }}>
      <Box
        aria-label={`${childName} Avatar${pet ? ` mit ${pet.name}` : ''}`}
        role="img"
        sx={{
          aspectRatio: '3 / 4',
          bgcolor: '#d9f1e2',
          border: '8px solid rgba(255,255,255,0.72)',
          borderRadius: 2,
          boxShadow: '0 16px 34px rgba(32, 48, 64, 0.17)',
          contain: 'layout paint',
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative',
          width: { xs: 'min(260px, 72vw)', sm: 300, md: 320 }
        }}
      >
        <Box sx={{ bgcolor: '#b7dfc5', bottom: 0, height: '31%', left: 0, position: 'absolute', width: '100%' }} />
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.34)',
            borderRadius: '50%',
            height: 76,
            left: -18,
            position: 'absolute',
            top: 40,
            width: 76
          }}
        />
        <Box
          sx={{
            bgcolor: 'rgba(94, 169, 206, 0.2)',
            borderRadius: '50%',
            height: 96,
            position: 'absolute',
            right: -24,
            top: 74,
            width: 96
          }}
        />
        {characterAsset ? (
          <Box
            alt={characterDisplayName ?? ''}
            component="img"
            decoding="async"
            src={characterAsset}
            sx={{
              bottom: '2%',
              height: '94%',
              left: petAsset ? '44%' : '50%',
              objectFit: 'contain',
              position: 'absolute',
              transform: 'translateX(-50%)',
              width: '88%'
            }}
          />
        ) : null}
        {petAsset ? (
          <Box
            alt={pet?.name ?? ''}
            component="img"
            decoding="async"
            src={petAsset}
            sx={{
              bottom: '2%',
              height: '34%',
              objectFit: 'contain',
              position: 'absolute',
              right: '-3%',
              width: '42%'
            }}
          />
        ) : null}
      </Box>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
        <Chip icon={<PersonRoundedIcon />} label={characterDisplayName ?? 'Keine Figur'} size="small" variant="outlined" />
        {pet ? <Chip icon={<PetsRoundedIcon />} label={pet.name} size="small" variant="outlined" /> : null}
      </Stack>
    </Stack>
  );
}

function HairColorPicker({
  onSelect,
  selectedColor
}: {
  onSelect: (color: HairColorKey) => void;
  selectedColor: HairColorKey;
}) {
  return (
    <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.25 }}>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 900, mb: 1 }}>
        Haarfarbe
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
      >
        {hairColors.map((color) => {
          const active = color.key === selectedColor;

          return (
            <Tooltip key={color.key} title={color.label}>
              <ButtonBase
                aria-label={`Haarfarbe ${color.label}`}
                aria-pressed={active}
                onClick={() => onSelect(color.key)}
                sx={{
                  bgcolor: color.value,
                  border: '3px solid',
                  borderColor: active ? 'primary.main' : 'background.paper',
                  borderRadius: '50%',
                  boxShadow: active
                    ? '0 0 0 2px rgba(47, 116, 208, 0.28)'
                    : '0 1px 4px rgba(23, 32, 51, 0.18)',
                  flex: '0 0 auto',
                  height: 38,
                  width: 38
                }}
              >
                {active ? (
                  <CheckCircleRoundedIcon
                    sx={{
                      color: color.key === 'blonde' ? '#27323d' : '#ffffff',
                      fontSize: 22
                    }}
                  />
                ) : null}
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}

function AvatarItemOption({
  active,
  item,
  onSelect,
  previewItemKey
}: {
  active: boolean;
  item: AvatarItem | null;
  onSelect: () => void;
  previewItemKey?: string;
}) {
  const locked = item ? !item.isUnlocked : false;
  const assetPath = item ? getAvatarAssetPath(previewItemKey ?? item.key) : undefined;
  const isCharacter = item?.slot === 'character';

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
        overflow: 'hidden',
        p: 0.75,
        scrollSnapAlign: 'start',
        textAlign: 'left',
        whiteSpace: 'normal',
        width: '100%'
      }}
      variant="outlined"
    >
      <Box
        sx={{
          aspectRatio: isCharacter ? '3 / 4' : '1 / 1',
          bgcolor: active ? 'rgba(47, 116, 208, 0.08)' : 'action.hover',
          borderRadius: 1,
          display: 'grid',
          overflow: 'hidden',
          placeItems: 'center',
          position: 'relative',
          width: '100%'
        }}
      >
        {assetPath ? (
          <Box
            alt=""
            component="img"
            decoding="async"
            loading="lazy"
            src={assetPath}
            sx={{
              filter: locked ? 'blur(10px) saturate(0.45)' : 'none',
              height: '94%',
              objectFit: 'contain',
              opacity: locked ? 0.72 : 1,
              transform: locked ? 'scale(1.06)' : 'none',
              transition: 'filter 180ms ease, opacity 180ms ease',
              width: '94%'
            }}
          />
        ) : (
          <PetsRoundedIcon color="disabled" sx={{ fontSize: 42 }} />
        )}
        {active ? (
          <CheckCircleRoundedIcon color="primary" sx={{ position: 'absolute', right: 6, top: 6 }} />
        ) : null}
        {locked ? (
          <Chip
            icon={<LockRoundedIcon />}
            label={`Level ${item?.requiredLevel ?? 1}`}
            size="small"
            sx={{ bottom: 6, position: 'absolute' }}
          />
        ) : null}
      </Box>
      <Typography
        sx={{ fontSize: { xs: '0.78rem', sm: '0.86rem' }, fontWeight: 900, lineHeight: 1.2, overflowWrap: 'anywhere' }}
      >
        {item?.name ?? 'Ohne Tier'}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{
          display: { xs: 'none', sm: '-webkit-box' },
          fontSize: '0.76rem',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2
        }}
      >
        {item?.description ?? 'Der Avatar reist allein.'}
      </Typography>
      <Chip
        color={active ? 'primary' : 'default'}
        label={item ? (locked ? `Level ${item.requiredLevel}` : rarityLabel(item.rarity)) : 'Frei'}
        size="small"
        variant={active ? 'filled' : 'outlined'}
      />
    </Button>
  );
}

function getEquippedItem(
  equippedItems: Record<string, string>,
  itemsByKey: Map<string, AvatarItem>,
  slot: AvatarSlot
) {
  const itemKey = equippedItems[slot];
  const item = itemKey ? itemsByKey.get(itemKey) : undefined;
  return item?.slot === slot ? item : undefined;
}

function getVisibleAvatarItems(items: AvatarItem[]) {
  return items.filter((item) => {
    if (item.slot !== 'character') {
      return true;
    }

    const variant = characterVariants[item.key];
    return !variant || variant.baseItemKey === item.key;
  });
}

function getAvatarAssetPath(itemKey: string) {
  const variant = characterVariants[itemKey];

  if (variant) {
    return `/avatar-complete/v2/characters/${variant.style}/${variant.color}.webp`;
  }

  return avatarAssetPaths[itemKey];
}

function getBaseCharacterKey(itemKey: string | undefined) {
  if (!itemKey) {
    return undefined;
  }

  return characterVariants[itemKey]?.baseItemKey ?? itemKey;
}

function resolveCharacterVariantKey(
  itemKey: string,
  preferredColor: HairColorKey | undefined,
  itemsByKey: Map<string, AvatarItem>
) {
  const currentVariant = characterVariants[itemKey];
  if (!currentVariant || !preferredColor) {
    return itemKey;
  }

  const matchingEntry = Object.entries(characterVariants).find(
    ([_candidateKey, candidate]) =>
      candidate.style === currentVariant.style && candidate.color === preferredColor
  );
  const matchingKey = matchingEntry?.[0];

  return matchingKey && itemsByKey.has(matchingKey) ? matchingKey : itemKey;
}

function normalizeLoadout(loadout: Record<string, string>) {
  const normalized: Record<string, string> = {};

  if (loadout.character) {
    normalized.character = loadout.character;
  }

  if (loadout.pet) {
    normalized.pet = loadout.pet;
  }

  return normalized;
}

function compareAvatarItems(first: AvatarItem, second: AvatarItem) {
  return first.requiredLevel - second.requiredLevel || first.name.localeCompare(second.name);
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
