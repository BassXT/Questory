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

export type AvatarSlot = 'background' | 'body' | 'hair' | 'eyes' | 'bottom' | 'top' | 'shoes' | 'glasses' | 'gadget';

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
  top: 'Oberteil',
  bottom: 'Hose',
  shoes: 'Schuhe',
  glasses: 'Brille',
  gadget: 'Gadget'
};

const slotOrder: AvatarSlot[] = ['background', 'body', 'hair', 'eyes', 'top', 'bottom', 'shoes', 'glasses', 'gadget'];
const optionalSlots = new Set<AvatarSlot>(['glasses', 'gadget']);

export function AvatarBuilderPanel({
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
    () => (avatar?.items ?? []).filter((item) => item.slot === selectedSlot).sort(compareAvatarItems),
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

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
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
            p: 1.25
          }}
        >
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
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label={selectedChild ? `${selectedChild.xp} XP` : '0 XP'} variant="outlined" />
            <Chip label={selectedChild ? `${selectedChild.coins} Muenzen` : '0 Muenzen'} variant="outlined" />
            <Chip label={selectedChild ? selectedChild.displayName : 'Kein Kind'} variant="outlined" />
          </Stack>
        </Box>

        {loading ? <LinearProgress /> : null}

        {avatar ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
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
                p: 1.5
              }}
            >
              <AvatarPreview equippedItems={draftLoadout} itemsByKey={itemsByKey} />
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

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
                    active={draftLoadout[item.slot] === item.key}
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
            <Typography color="text.secondary">Noch kein Kind fuer den Avatar ausgewaehlt</Typography>
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
      onClick={onSelect}
      sx={{
        alignItems: 'stretch',
        borderColor: active ? 'primary.main' : 'divider',
        color: 'text.primary',
        display: 'grid',
        gap: 0.75,
        justifyContent: 'stretch',
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
        {item?.description ?? 'Kein Extra fuer diesen Slot.'}
      </Typography>
      {item ? (
        <Stack direction="row" spacing={0.75}>
          <ColorSwatch color={item.colorPrimary ?? '#7d8da8'} />
          <ColorSwatch color={item.colorSecondary ?? '#f2c078'} />
        </Stack>
      ) : null}
    </Button>
  );
}

function AvatarPreview({
  equippedItems,
  itemsByKey
}: {
  equippedItems: Record<string, string>;
  itemsByKey: Map<string, AvatarItem>;
}) {
  const background = getEquippedItem(equippedItems, itemsByKey, 'background');
  const body = getEquippedItem(equippedItems, itemsByKey, 'body');
  const hair = getEquippedItem(equippedItems, itemsByKey, 'hair');
  const eyes = getEquippedItem(equippedItems, itemsByKey, 'eyes');
  const top = getEquippedItem(equippedItems, itemsByKey, 'top');
  const bottom = getEquippedItem(equippedItems, itemsByKey, 'bottom');
  const shoes = getEquippedItem(equippedItems, itemsByKey, 'shoes');
  const glasses = getEquippedItem(equippedItems, itemsByKey, 'glasses');
  const gadget = getEquippedItem(equippedItems, itemsByKey, 'gadget');
  const skin = body?.colorPrimary ?? '#f0b07a';
  const skinShadow = body?.colorSecondary ?? '#d99061';
  const hairColor = hair?.colorPrimary ?? '#5b3827';
  const topColor = top?.colorPrimary ?? '#3978d8';
  const topAccent = top?.colorSecondary ?? '#f4c95d';
  const bottomColor = bottom?.colorPrimary ?? '#2f5f9b';
  const shoeColor = shoes?.colorPrimary ?? '#cf4f44';
  const eyeColor = eyes?.colorPrimary ?? '#2b3848';

  return (
    <Box sx={{ aspectRatio: '7 / 8', maxWidth: 360, width: '100%' }}>
      <svg aria-label="Avatar Vorschau" role="img" viewBox="0 0 280 320" width="100%" height="100%">
        <defs>
          <linearGradient id="avatar-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={background?.colorPrimary ?? '#b9e7d3'} />
            <stop offset="100%" stopColor={background?.colorSecondary ?? '#78a9e6'} />
          </linearGradient>
          <filter id="avatar-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1b2a3f" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect width="280" height="320" rx="28" fill="url(#avatar-bg)" />
        <BackgroundDetails itemKey={background?.key} />
        <ellipse cx="140" cy="282" rx="74" ry="14" fill="#203047" opacity="0.16" />

        {top?.key === 'top-cape-purple' ? <path d="M98 130 C62 166 60 236 92 270 L122 246 L119 146 Z" fill={topAccent} opacity="0.9" /> : null}
        {gadget?.key === 'gadget-backpack' ? <rect x="86" y="142" width="38" height="86" rx="15" fill={gadget.colorPrimary ?? '#6f7d8d'} opacity="0.92" /> : null}

        <g filter="url(#avatar-shadow)">
          <path d="M96 151 C101 128 119 117 140 117 C161 117 179 128 184 151 L194 233 C196 251 183 266 165 266 H115 C97 266 84 251 86 233 Z" fill={topColor} />
          <path d="M111 156 C123 169 157 169 169 156 L163 235 H117 Z" fill={topAccent} opacity={top?.key === 'top-shirt-green' ? 0.55 : 0.25} />
          {top?.key === 'top-armor-gold' ? <path d="M108 154 H172 L162 213 H118 Z" fill={topAccent} opacity="0.75" /> : null}
          {top?.key === 'top-jacket-orange' ? <path d="M103 153 H127 L122 239 H99 Z M153 153 H177 L181 239 H158 Z" fill={topAccent} opacity="0.72" /> : null}

          <path d="M113 235 H136 V279 H108 C101 263 102 247 113 235 Z" fill={bottomColor} />
          <path d="M144 235 H167 C178 247 179 263 172 279 H144 Z" fill={bottomColor} />
          {bottom?.key === 'bottom-space' ? <circle cx="126" cy="252" r="5" fill={bottom.colorSecondary ?? '#95f2d9'} /> : null}
          {bottom?.key === 'bottom-cargo' ? <rect x="112" y="252" width="18" height="13" rx="4" fill={bottom.colorSecondary ?? '#8aa568'} /> : null}

          <ellipse cx="119" cy="284" rx="22" ry="10" fill={shoeColor} />
          <ellipse cx="161" cy="284" rx="22" ry="10" fill={shoeColor} />
          {shoes?.key === 'shoes-glow' ? (
            <>
              <ellipse cx="119" cy="289" rx="21" ry="4" fill={shoes.colorSecondary ?? '#8ff7ff'} opacity="0.8" />
              <ellipse cx="161" cy="289" rx="21" ry="4" fill={shoes.colorSecondary ?? '#8ff7ff'} opacity="0.8" />
            </>
          ) : null}

          <circle cx="140" cy="88" r="46" fill={skin} />
          <path d="M106 93 C111 118 127 132 148 132 C166 129 179 117 184 96 C176 122 158 139 132 135 C117 130 109 116 106 93 Z" fill={skinShadow} opacity="0.35" />
          <HairShape itemKey={hair?.key} color={hairColor} accent={hair?.colorSecondary ?? '#7b4b34'} />
          <EyeShape itemKey={eyes?.key} color={eyeColor} />
          <path d="M128 111 C136 117 145 117 153 111" fill="none" stroke="#7a3e3b" strokeLinecap="round" strokeWidth="4" />
          <GlassesShape item={glasses} />
        </g>

        <GadgetShape item={gadget} />
      </svg>
    </Box>
  );
}

function BackgroundDetails({ itemKey }: { itemKey: string | undefined }) {
  if (itemKey === 'background-night') {
    return (
      <g fill="#fff9d8" opacity="0.9">
        <circle cx="54" cy="55" r="4" />
        <circle cx="218" cy="48" r="3" />
        <circle cx="232" cy="112" r="2.5" />
        <path d="M70 104 L76 118 L91 120 L79 130 L82 145 L70 137 L58 145 L61 130 L49 120 L64 118 Z" />
      </g>
    );
  }

  if (itemKey === 'background-lab') {
    return (
      <g fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.42">
        <path d="M30 78 H96 V34" />
        <path d="M188 34 V94 H250" />
        <circle cx="96" cy="34" r="9" fill="#ffffff" stroke="none" />
        <circle cx="188" cy="94" r="9" fill="#ffffff" stroke="none" />
      </g>
    );
  }

  if (itemKey === 'background-room') {
    return (
      <g opacity="0.45">
        <rect x="22" y="214" width="236" height="54" rx="16" fill="#ffffff" />
        <rect x="48" y="176" width="58" height="38" rx="8" fill="#ffffff" />
        <rect x="178" y="164" width="54" height="68" rx="10" fill="#ffffff" />
      </g>
    );
  }

  return (
    <g fill="#ffffff" opacity="0.42">
      <circle cx="54" cy="230" r="34" />
      <circle cx="222" cy="224" r="42" />
      <circle cx="238" cy="198" r="20" />
    </g>
  );
}

function HairShape({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  if (itemKey === 'hair-buns') {
    return (
      <g fill={color}>
        <circle cx="100" cy="70" r="17" />
        <circle cx="180" cy="70" r="17" />
        <path d="M101 83 C108 42 171 42 179 83 C165 66 117 66 101 83 Z" />
      </g>
    );
  }

  if (itemKey === 'hair-curly') {
    return (
      <g fill={color}>
        {[102, 118, 134, 150, 166, 182].map((x, index) => (
          <circle cx={x} cy={61 + (index % 2) * 8} r="15" key={x} />
        ))}
        <path d="M99 82 C112 60 166 57 183 82 C171 72 114 72 99 82 Z" fill={accent} opacity="0.58" />
      </g>
    );
  }

  if (itemKey === 'hair-silver') {
    return <path d="M96 84 C103 42 155 28 185 70 C174 61 148 75 137 93 C129 75 111 74 96 84 Z" fill={color} />;
  }

  return <path d="M96 86 C100 45 154 33 184 66 C171 63 151 73 139 91 C126 75 110 77 96 86 Z" fill={color} />;
}

function EyeShape({ itemKey, color }: { itemKey: string | undefined; color: string }) {
  if (itemKey === 'eyes-smile') {
    return (
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="5">
        <path d="M118 92 C123 87 129 87 134 92" />
        <path d="M148 92 C153 87 159 87 164 92" />
      </g>
    );
  }

  if (itemKey === 'eyes-focus') {
    return (
      <g fill={color}>
        <rect x="116" y="86" width="17" height="7" rx="3" />
        <rect x="148" y="86" width="17" height="7" rx="3" />
      </g>
    );
  }

  return (
    <g fill={color}>
      <circle cx="124" cy="91" r="5" />
      <circle cx="156" cy="91" r="5" />
    </g>
  );
}

function GlassesShape({ item }: { item: AvatarItem | undefined }) {
  if (!item) {
    return null;
  }

  const color = item.colorPrimary ?? '#263447';

  if (item.key === 'glasses-star') {
    return (
      <g fill="none" stroke={color} strokeLinejoin="round" strokeWidth="4">
        <path d="M124 76 L129 87 L141 88 L132 96 L134 108 L124 102 L113 108 L116 96 L107 88 L119 87 Z" />
        <path d="M156 76 L161 87 L173 88 L164 96 L166 108 L156 102 L145 108 L148 96 L139 88 L151 87 Z" />
        <path d="M139 92 H145" />
      </g>
    );
  }

  if (item.key === 'glasses-goggles') {
    return (
      <g fill="none" stroke={color} strokeWidth="5">
        <rect x="104" y="78" width="36" height="24" rx="10" />
        <rect x="140" y="78" width="36" height="24" rx="10" />
        <path d="M140 90 H140" />
      </g>
    );
  }

  return (
    <g fill="none" stroke={color} strokeWidth="4">
      <circle cx="124" cy="90" r="15" />
      <circle cx="156" cy="90" r="15" />
      <path d="M139 90 H141" />
    </g>
  );
}

function GadgetShape({ item }: { item: AvatarItem | undefined }) {
  if (!item) {
    return null;
  }

  const color = item.colorPrimary ?? '#7d8da8';
  const accent = item.colorSecondary ?? '#f4c95d';

  if (item.key === 'gadget-drone') {
    return (
      <g transform="translate(204 70)">
        <rect x="0" y="13" width="36" height="18" rx="8" fill={color} />
        <circle cx="-4" cy="12" r="12" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="40" cy="12" r="12" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="18" cy="22" r="4" fill={accent} />
      </g>
    );
  }

  if (item.key === 'gadget-robot') {
    return (
      <g transform="translate(198 194)">
        <rect x="0" y="0" width="48" height="50" rx="12" fill={color} />
        <circle cx="16" cy="20" r="4" fill={accent} />
        <circle cx="32" cy="20" r="4" fill={accent} />
        <path d="M16 34 H32" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      </g>
    );
  }

  if (item.key === 'gadget-compass') {
    return (
      <g transform="translate(208 186)">
        <circle cx="22" cy="22" r="22" fill={color} />
        <path d="M22 7 L31 24 L22 37 L13 24 Z" fill={accent} />
      </g>
    );
  }

  return null;
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

function normalizeLoadout(loadout: Record<string, string>, slots: AvatarSlot[]) {
  return slots.reduce<Record<string, string>>((normalized, slot) => {
    if (loadout[slot]) {
      normalized[slot] = loadout[slot];
    }

    return normalized;
  }, {});
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
