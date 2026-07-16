import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { createAvatar } from '@dicebear/core';
import * as toonHead from '@dicebear/toon-head';
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
      disableRipple
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
  const top = getEquippedItem(equippedItems, itemsByKey, 'top');
  const bottom = getEquippedItem(equippedItems, itemsByKey, 'bottom');
  const shoes = getEquippedItem(equippedItems, itemsByKey, 'shoes');
  const glasses = getEquippedItem(equippedItems, itemsByKey, 'glasses');
  const gadget = getEquippedItem(equippedItems, itemsByKey, 'gadget');
  const skin = body?.colorPrimary ?? '#f2b28d';
  const skinShadow = body?.colorSecondary ?? '#d98a62';
  const topColor = top?.colorPrimary ?? '#2568d8';
  const topAccent = top?.colorSecondary ?? '#1d4f9f';
  const bottomColor = bottom?.colorPrimary ?? '#355f9f';
  const bottomAccent = bottom?.colorSecondary ?? '#233f6c';
  const shoeColor = shoes?.colorPrimary ?? '#d63f61';
  const shoeAccent = shoes?.colorSecondary ?? '#8f263d';
  const avatarDataUri = useMemo(
    () =>
      createAvatar(toonHead, {
        seed: `${childName}:${Object.values(equippedItems).join(':')}`,
        backgroundColor: [stripHex(background?.colorPrimary ?? '#d9f2df')],
        skinColor: [stripHex(body?.colorPrimary ?? '#f2b28d')],
        hairColor: [stripHex(hair?.colorPrimary ?? '#5b3826')],
        hair: [resolveToonHeadHair(hair?.key)],
        hairProbability: 100,
        rearHair: [resolveToonHeadRearHair(hair?.key)],
        rearHairProbability: shouldUseToonHeadRearHair(hair?.key) ? 100 : 0,
        eyes: [resolveToonHeadEyes(eyes?.key)],
        eyebrows: [resolveToonHeadEyebrows(eyes?.key)],
        mouth: [resolveToonHeadMouth(eyes?.key)],
        clothes: [resolveToonHeadClothes(top?.key)],
        clothesColor: [stripHex(top?.colorPrimary ?? '#2568d8')],
        beardProbability: 0
      }).toDataUri(),
    [background, body, childName, equippedItems, eyes, hair, top]
  );
  const equipmentChips = [
    glasses ? `Brille: ${glasses.name}` : null,
    gadget ? `Gadget: ${gadget.name}` : null
  ].filter(Boolean);

  return (
    <Box sx={{ display: 'grid', gap: 1, justifyItems: 'center', maxWidth: 310, width: '100%' }}>
      <Box
        component="svg"
        aria-label={getAvatarAlt(childName)}
        role="img"
        viewBox="0 0 360 520"
        sx={{
          aspectRatio: '9 / 13',
          bgcolor: background?.colorPrimary ?? '#d9f2df',
          border: '10px solid',
          borderColor: 'rgba(255,255,255,0.46)',
          borderRadius: 4,
          boxShadow: '0 18px 45px rgba(23, 32, 51, 0.18)',
          display: 'block',
          maxWidth: 310,
          width: '100%'
        }}
      >
        <defs>
          <linearGradient id="questory-full-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={background?.colorPrimary ?? '#d9f2df'} />
            <stop offset="100%" stopColor={background?.colorSecondary ?? '#8dd3a5'} />
          </linearGradient>
          <linearGradient id="questory-full-skin" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={lightenColor(skin, 0.14)} />
            <stop offset="100%" stopColor={skin} />
          </linearGradient>
          <linearGradient id="questory-full-top" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={lightenColor(topColor, 0.16)} />
            <stop offset="100%" stopColor={topColor} />
          </linearGradient>
          <linearGradient id="questory-full-bottom" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={lightenColor(bottomColor, 0.12)} />
            <stop offset="100%" stopColor={bottomColor} />
          </linearGradient>
          <linearGradient id="questory-full-shoes" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={lightenColor(shoeColor, 0.12)} />
            <stop offset="100%" stopColor={shoeColor} />
          </linearGradient>
          <filter id="questory-full-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#1b2a3f" floodOpacity="0.2" />
          </filter>
          <filter id="questory-full-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#1b2a3f" floodOpacity="0.18" />
          </filter>
          <clipPath id="questory-full-head-clip">
            <circle cx="180" cy="118" r="76" />
          </clipPath>
        </defs>
        <rect width="360" height="520" rx="34" fill="url(#questory-full-bg)" />
        <rect x="18" y="18" width="324" height="484" rx="27" fill="#ffffff" opacity="0.16" />
        <FullAvatarBackground itemKey={background?.key} />
        <ellipse cx="180" cy="454" rx="108" ry="22" fill="#203047" opacity="0.15" />

        <g filter="url(#questory-full-shadow)">
          <FullAvatarBackGadget item={gadget} />
          <path d="M156 165 H204 V210 H156 Z" fill="url(#questory-full-skin)" />
          <path d="M157 178 C167 188 193 188 203 178 V211 H157 Z" fill={skinShadow} opacity="0.25" />

          <path d="M116 203 C132 189 228 189 244 203 L229 319 C213 333 147 333 131 319 Z" fill="url(#questory-full-top)" />
          <path d="M132 214 C147 228 213 228 228 214" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.34" />
          <FullAvatarTopDetails itemKey={top?.key} accent={topAccent} color={topColor} />

          <path d="M123 214 C101 247 106 302 128 328 C136 337 148 327 140 316 C124 292 128 252 144 226 Z" fill="url(#questory-full-skin)" />
          <path d="M237 214 C259 247 254 302 232 328 C224 337 212 327 220 316 C236 292 232 252 216 226 Z" fill="url(#questory-full-skin)" />
          <circle cx="132" cy="329" r="13" fill="url(#questory-full-skin)" />
          <circle cx="228" cy="329" r="13" fill="url(#questory-full-skin)" />

          <FullAvatarBottom itemKey={bottom?.key} accent={bottomAccent} />
          <FullAvatarShoes itemKey={shoes?.key} accent={shoeAccent} />

          <circle cx="180" cy="120" r="82" fill="#ffffff" opacity="0.48" />
          <image href={avatarDataUri} x="66" y="-10" width="228" height="228" clipPath="url(#questory-full-head-clip)" />
          <circle cx="180" cy="120" r="77" fill="none" stroke="#ffffff" strokeWidth="7" opacity="0.42" />

          <FullAvatarFrontGadget item={gadget} />
        </g>
      </Box>
      {equipmentChips.length > 0 ? (
        <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {equipmentChips.map((label) => (
            <Chip key={label} label={label} size="small" variant="outlined" />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

function resolveToonHeadHair(itemKey: string | undefined) {
  switch (itemKey) {
    case 'hair-buns':
      return 'bun';
    case 'hair-curly':
      return 'spiky';
    case 'hair-silver':
      return 'sideComed';
    default:
      return 'undercut';
  }
}

function resolveToonHeadRearHair(itemKey: string | undefined) {
  switch (itemKey) {
    case 'hair-buns':
      return 'shoulderHigh';
    case 'hair-curly':
      return 'neckHigh';
    case 'hair-silver':
      return 'longWavy';
    default:
      return 'neckHigh';
  }
}

function shouldUseToonHeadRearHair(itemKey: string | undefined) {
  return itemKey === 'hair-buns' || itemKey === 'hair-curly' || itemKey === 'hair-silver';
}

function resolveToonHeadEyes(itemKey: string | undefined) {
  switch (itemKey) {
    case 'eyes-smile':
      return 'happy';
    case 'eyes-focus':
      return 'humble';
    default:
      return 'wide';
  }
}

function resolveToonHeadEyebrows(itemKey: string | undefined) {
  switch (itemKey) {
    case 'eyes-smile':
      return 'happy';
    case 'eyes-focus':
      return 'neutral';
    default:
      return 'raised';
  }
}

function resolveToonHeadMouth(itemKey: string | undefined) {
  switch (itemKey) {
    case 'eyes-smile':
      return 'laugh';
    case 'eyes-focus':
      return 'smile';
    default:
      return 'smile';
  }
}

function resolveToonHeadClothes(itemKey: string | undefined) {
  switch (itemKey) {
    case 'top-shirt-green':
      return 'tShirt';
    case 'top-jacket-orange':
      return 'openJacket';
    case 'top-cape-purple':
      return 'dress';
    case 'top-armor-gold':
      return 'turtleNeck';
    default:
      return 'shirt';
  }
}

function stripHex(color: string) {
  return color.replace('#', '').trim();
}

function getAvatarAlt(childName: string) {
  return childName.toLowerCase().includes('avatar') ? childName : `${childName} Avatar`;
}

function FullAvatarBackground({ itemKey }: { itemKey: string | undefined }) {
  if (itemKey === 'background-night') {
    return (
      <g>
        <path d="M28 398 C88 368 151 392 194 357 C238 322 286 350 332 314 V500 H28 Z" fill="#18213d" opacity="0.22" />
        <g fill="#fff9d8" opacity="0.9">
          <circle cx="58" cy="73" r="4" />
          <circle cx="306" cy="68" r="3" />
          <circle cx="294" cy="170" r="2.5" />
          <path d="M69 151 L76 165 L92 167 L80 177 L83 193 L69 184 L55 193 L58 177 L46 167 L62 165 Z" />
          <path d="M288 106 C270 106 258 93 258 76 C248 87 248 113 266 125 C280 134 298 126 304 111 C300 114 294 106 288 106 Z" />
        </g>
      </g>
    );
  }

  if (itemKey === 'background-lab') {
    return (
      <g fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.43">
        <path d="M35 96 H114 V45" />
        <path d="M246 44 V126 H325" />
        <path d="M49 226 H105" />
        <path d="M255 218 H312" />
        <circle cx="114" cy="45" r="9" fill="#ffffff" stroke="none" />
        <circle cx="246" cy="126" r="9" fill="#ffffff" stroke="none" />
      </g>
    );
  }

  if (itemKey === 'background-room') {
    return (
      <g opacity="0.48">
        <rect x="28" y="365" width="304" height="86" rx="22" fill="#ffffff" />
        <rect x="48" y="274" width="68" height="54" rx="10" fill="#ffffff" />
        <rect x="252" y="264" width="58" height="96" rx="13" fill="#ffffff" />
        <path d="M49 326 H116 M253 356 H310" stroke="#d49a67" strokeLinecap="round" strokeWidth="5" opacity="0.45" />
      </g>
    );
  }

  return (
    <g>
      <path d="M25 399 C82 360 132 381 180 351 C227 321 272 344 335 306 V500 H25 Z" fill="#ffffff" opacity="0.28" />
      <g fill="#ffffff" opacity="0.38">
        <circle cx="56" cy="350" r="39" />
        <circle cx="301" cy="340" r="48" />
        <circle cx="315" cy="299" r="21" />
      </g>
    </g>
  );
}

function FullAvatarTopDetails({ itemKey, accent, color }: { itemKey: string | undefined; accent: string; color: string }) {
  if (itemKey === 'top-armor-gold') {
    return (
      <g>
        <path d="M141 214 H219 L207 296 H153 Z" fill={accent} opacity="0.82" />
        <path d="M158 232 H202 M153 254 H207 M150 278 H210" stroke={lightenColor(color, 0.35)} strokeLinecap="round" strokeWidth="4" opacity="0.65" />
        <circle cx="180" cy="249" r="9" fill="#fff3b0" opacity="0.9" />
      </g>
    );
  }

  if (itemKey === 'top-jacket-orange') {
    return (
      <g>
        <path d="M126 208 H157 L151 318 H124 Z M203 208 H234 L236 318 H209 Z" fill={accent} opacity="0.72" />
        <path d="M158 219 L180 244 L202 219" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.52" />
        <circle cx="180" cy="260" r="4" fill="#ffffff" opacity="0.72" />
        <circle cx="180" cy="286" r="4" fill="#ffffff" opacity="0.72" />
      </g>
    );
  }

  if (itemKey === 'top-cape-purple') {
    return (
      <g>
        <path d="M106 208 C92 267 100 354 143 400 L168 326 L142 220 Z" fill={accent} opacity="0.78" />
        <path d="M143 220 L180 255 L217 220" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.9" />
      </g>
    );
  }

  if (itemKey === 'top-shirt-green') {
    return (
      <g>
        <path d="M145 234 C160 247 200 247 215 234" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.5" />
        <path d="M148 284 H212" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.32" />
      </g>
    );
  }

  return (
    <g>
      <path d="M149 224 L180 252 L211 224" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.75" />
      <path d="M148 280 H212" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.28" />
    </g>
  );
}

function FullAvatarBottom({ itemKey, accent }: { itemKey: string | undefined; accent: string }) {
  if (itemKey === 'bottom-shorts') {
    return (
      <g>
        <path d="M130 310 C148 323 212 323 230 310 L220 354 H188 L180 329 L172 354 H140 Z" fill="url(#questory-full-bottom)" />
        <path d="M145 361 V414 M215 361 V414" stroke="url(#questory-full-skin)" strokeLinecap="round" strokeWidth="27" />
        <path d="M139 340 H221" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.36" />
      </g>
    );
  }

  return (
    <g>
      <path d="M130 309 C150 322 210 322 230 309 L221 420 H188 L181 332 L172 420 H139 Z" fill="url(#questory-full-bottom)" />
      <path d="M180 331 V417" stroke={darkenColor(accent, 0.1)} strokeLinecap="round" strokeWidth="4" opacity="0.25" />
      {itemKey === 'bottom-space' ? (
        <g fill={accent} opacity="0.86">
          <circle cx="154" cy="354" r="5" />
          <circle cx="207" cy="386" r="4" />
          <path d="M193 342 L197 350 L206 351 L199 357 L201 366 L193 361 L185 366 L187 357 L180 351 L189 350 Z" />
        </g>
      ) : null}
      {itemKey === 'bottom-cargo' ? (
        <g fill={accent} opacity="0.78">
          <rect x="141" y="361" width="23" height="18" rx="5" />
          <rect x="198" y="361" width="23" height="18" rx="5" />
        </g>
      ) : null}
    </g>
  );
}

function FullAvatarShoes({ itemKey, accent }: { itemKey: string | undefined; accent: string }) {
  return (
    <g>
      <ellipse cx="151" cy="431" rx="34" ry="13" fill="url(#questory-full-shoes)" />
      <ellipse cx="209" cy="431" rx="34" ry="13" fill="url(#questory-full-shoes)" />
      {itemKey === 'shoes-glow' ? (
        <g>
          <ellipse cx="151" cy="438" rx="30" ry="5" fill={accent} opacity="0.85" />
          <ellipse cx="209" cy="438" rx="30" ry="5" fill={accent} opacity="0.85" />
        </g>
      ) : (
        <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.62">
          <path d="M138 428 H159" />
          <path d="M200 428 H221" />
        </g>
      )}
    </g>
  );
}

function FullAvatarBackGadget({ item }: { item: AvatarItem | undefined }) {
  if (item?.key !== 'gadget-backpack') {
    return null;
  }

  return (
    <g transform="translate(109 216)" filter="url(#questory-full-soft-shadow)">
      <rect x="0" y="0" width="56" height="110" rx="20" fill={item.colorPrimary ?? '#d04c73'} />
      <path d="M12 22 H44" stroke={item.colorSecondary ?? '#7a5ccf'} strokeLinecap="round" strokeWidth="6" opacity="0.75" />
      <circle cx="38" cy="69" r="9" fill={item.colorSecondary ?? '#7a5ccf'} opacity="0.85" />
    </g>
  );
}

function FullAvatarFrontGadget({ item }: { item: AvatarItem | undefined }) {
  if (!item || item.key === 'gadget-backpack') {
    return null;
  }

  const color = item.colorPrimary ?? '#7d8da8';
  const accent = item.colorSecondary ?? '#f4c95d';

  if (item.key === 'gadget-drone') {
    return (
      <g transform="translate(254 101)" filter="url(#questory-full-soft-shadow)">
        <rect x="0" y="15" width="48" height="23" rx="10" fill={color} />
        <circle cx="-6" cy="14" r="15" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="54" cy="14" r="15" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="24" cy="26" r="4" fill={accent} />
      </g>
    );
  }

  if (item.key === 'gadget-robot') {
    return (
      <g transform="translate(251 345)" filter="url(#questory-full-soft-shadow)">
        <rect x="0" y="8" width="54" height="58" rx="14" fill={color} />
        <rect x="15" y="0" width="24" height="13" rx="6" fill={accent} />
        <circle cx="18" cy="31" r="4" fill={accent} />
        <circle cx="36" cy="31" r="4" fill={accent} />
        <path d="M18 47 H36" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      </g>
    );
  }

  if (item.key === 'gadget-compass') {
    return (
      <g transform="translate(246 342)" filter="url(#questory-full-soft-shadow)">
        <circle cx="25" cy="25" r="25" fill={color} />
        <circle cx="25" cy="25" r="18" fill="#ffffff" opacity="0.22" />
        <path d="M25 8 L36 27 L25 43 L14 27 Z" fill={accent} />
      </g>
    );
  }

  return null;
}

function BackgroundDetails({ itemKey }: { itemKey: string | undefined }) {
  if (itemKey === 'background-night') {
    return (
      <g>
        <path d="M30 271 C82 250 238 250 290 271 V344 H30 Z" fill="#18213d" opacity="0.22" />
        <g fill="#fff9d8" opacity="0.92">
          <circle cx="58" cy="62" r="4" />
          <circle cx="246" cy="53" r="3" />
          <circle cx="264" cy="126" r="2.5" />
          <circle cx="104" cy="37" r="2.5" />
          <path d="M73 118 L80 132 L96 134 L84 144 L87 160 L73 151 L59 160 L62 144 L50 134 L66 132 Z" />
          <path d="M247 84 C230 84 218 72 218 55 C208 65 208 90 225 101 C238 109 254 102 260 88 C256 91 252 84 247 84 Z" />
        </g>
      </g>
    );
  }

  if (itemKey === 'background-lab') {
    return (
      <g>
        <rect x="30" y="244" width="260" height="74" rx="22" fill="#ffffff" opacity="0.25" />
        <g fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.45">
          <path d="M34 82 H109 V36" />
          <path d="M211 38 V108 H286" />
          <path d="M52 173 H98" />
          <path d="M226 170 H274" />
          <circle cx="109" cy="36" r="9" fill="#ffffff" stroke="none" />
          <circle cx="211" cy="108" r="9" fill="#ffffff" stroke="none" />
        </g>
      </g>
    );
  }

  if (itemKey === 'background-room') {
    return (
      <g opacity="0.48">
        <rect x="24" y="247" width="272" height="64" rx="18" fill="#ffffff" />
        <rect x="50" y="192" width="64" height="46" rx="9" fill="#ffffff" />
        <rect x="206" y="184" width="58" height="78" rx="12" fill="#ffffff" />
        <path d="M51 235 H116 M207 260 H263" stroke="#d49a67" strokeLinecap="round" strokeWidth="5" opacity="0.45" />
      </g>
    );
  }

  return (
    <g>
      <path d="M24 276 C76 235 120 265 158 239 C197 212 239 235 296 204 V344 H24 Z" fill="#ffffff" opacity="0.28" />
      <g fill="#ffffff" opacity="0.42">
        <circle cx="55" cy="250" r="36" />
        <circle cx="253" cy="242" r="45" />
        <circle cx="273" cy="213" r="21" />
      </g>
    </g>
  );
}

function HairBackShape({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  if (itemKey === 'hair-buns') {
    return (
      <g>
        <circle cx="111" cy="77" r="24" fill={darkenColor(color, 0.05)} />
        <circle cx="209" cy="77" r="24" fill={darkenColor(color, 0.05)} />
        <path d="M111 101 C113 47 207 47 209 101 C191 75 129 75 111 101 Z" fill={color} />
        <path d="M126 56 C144 45 178 45 196 58" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.34" />
      </g>
    );
  }

  if (itemKey === 'hair-curly') {
    return (
      <g>
        {[110, 128, 146, 164, 182, 200, 211].map((x, index) => (
          <circle cx={x} cy={70 + (index % 2) * 9} r="18" fill={color} key={x} />
        ))}
        <path d="M108 97 C122 65 198 62 213 97 C194 83 128 83 108 97 Z" fill={accent} opacity="0.36" />
      </g>
    );
  }

  if (itemKey === 'hair-silver') {
    return (
      <g>
        <path d="M103 101 C109 41 179 25 216 73 C196 68 171 78 155 103 C140 83 121 84 103 101 Z" fill={color} />
        <path d="M106 102 C112 134 134 157 160 158 C131 163 105 139 96 112 Z" fill={darkenColor(color, 0.16)} opacity="0.82" />
      </g>
    );
  }

  return (
    <g>
      <path d="M102 101 C107 42 176 32 215 72 C196 70 173 80 158 104 C143 84 121 86 102 101 Z" fill={color} />
      <path d="M106 103 C113 134 135 157 160 158 C130 163 105 139 96 113 Z" fill={darkenColor(color, 0.12)} opacity="0.72" />
    </g>
  );
}

function HairFrontShape({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  if (itemKey === 'hair-buns') {
    return (
      <g clipPath="url(#avatar-face-clip)">
        <path d="M111 92 C122 59 198 59 209 92 C195 78 176 76 160 83 C144 76 125 78 111 92 Z" fill={color} />
        <path d="M116 91 C130 76 151 75 160 84 C170 74 191 76 205 92" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity="0.45" />
      </g>
    );
  }

  if (itemKey === 'hair-curly') {
    return (
      <g clipPath="url(#avatar-face-clip)">
        {[117, 135, 153, 171, 189, 205].map((x, index) => (
          <circle cx={x} cy={83 + (index % 2) * 7} r="16" fill={color} key={x} />
        ))}
        <path d="M112 99 C130 84 187 82 208 98" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.32" />
      </g>
    );
  }

  if (itemKey === 'hair-silver') {
    return (
      <g clipPath="url(#avatar-face-clip)">
        <path d="M105 92 C115 47 180 34 214 75 C192 69 169 81 154 104 C139 85 120 84 105 92 Z" fill={color} />
        <path d="M153 45 C142 66 145 86 155 106" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="9" opacity="0.9" />
      </g>
    );
  }

  return (
    <g clipPath="url(#avatar-face-clip)">
      <path d="M104 94 C110 44 177 34 214 73 C195 70 171 80 156 104 C143 83 122 85 104 94 Z" fill={color} />
      <path d="M123 59 C145 46 181 50 201 69" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.34" />
      <path d="M119 90 C134 78 147 82 158 104" fill="none" stroke={darkenColor(color, 0.18)} strokeLinecap="round" strokeWidth="5" opacity="0.42" />
    </g>
  );
}

function EyeShape({ itemKey, color }: { itemKey: string | undefined; color: string }) {
  if (itemKey === 'eyes-smile') {
    return (
      <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="5">
        <path d="M134 100 C140 94 148 94 154 100" />
        <path d="M166 100 C172 94 180 94 186 100" />
      </g>
    );
  }

  if (itemKey === 'eyes-focus') {
    return (
      <g fill={color}>
        <rect x="133" y="94" width="20" height="8" rx="4" />
        <rect x="167" y="94" width="20" height="8" rx="4" />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx="143" cy="100" rx="9" ry="8" fill="#ffffff" opacity="0.85" />
      <ellipse cx="177" cy="100" rx="9" ry="8" fill="#ffffff" opacity="0.85" />
      <circle cx="143" cy="100" r="5" fill={color} />
      <circle cx="177" cy="100" r="5" fill={color} />
      <circle cx="145" cy="98" r="1.8" fill="#ffffff" />
      <circle cx="179" cy="98" r="1.8" fill="#ffffff" />
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
        <path d="M143 84 L149 96 L162 97 L152 106 L155 119 L143 112 L131 119 L134 106 L124 97 L137 96 Z" />
        <path d="M177 84 L183 96 L196 97 L186 106 L189 119 L177 112 L165 119 L168 106 L158 97 L171 96 Z" />
        <path d="M156 101 H164" />
      </g>
    );
  }

  if (item.key === 'glasses-goggles') {
    return (
      <g fill="none" stroke={color} strokeWidth="5">
        <rect x="122" y="88" width="43" height="27" rx="11" />
        <rect x="155" y="88" width="43" height="27" rx="11" />
        <path d="M165 101 H155" />
        <path d="M128 89 C144 83 176 83 193 89" opacity="0.45" />
      </g>
    );
  }

  return (
    <g fill="none" stroke={color} strokeWidth="4">
      <circle cx="143" cy="101" r="16" />
      <circle cx="177" cy="101" r="16" />
      <path d="M159 101 H161" />
      <path d="M127 99 L115 94 M193 99 L205 94" strokeLinecap="round" />
    </g>
  );
}

function TopDetails({ itemKey, accent, color }: { itemKey: string | undefined; accent: string; color: string }) {
  if (itemKey === 'top-armor-gold') {
    return (
      <g>
        <path d="M125 172 H195 L184 236 H136 Z" fill={accent} opacity="0.82" />
        <path d="M143 184 H177 M139 204 H181 M135 224 H185" stroke={lightenColor(color, 0.35)} strokeLinecap="round" strokeWidth="4" opacity="0.65" />
        <circle cx="160" cy="196" r="8" fill="#fff3b0" opacity="0.9" />
      </g>
    );
  }

  if (itemKey === 'top-jacket-orange') {
    return (
      <g>
        <path d="M113 170 H143 L137 263 H108 Z M177 170 H207 L212 263 H183 Z" fill={accent} opacity="0.7" />
        <path d="M144 176 L160 196 L176 176" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.5" />
        <circle cx="160" cy="210" r="4" fill="#ffffff" opacity="0.72" />
        <circle cx="160" cy="231" r="4" fill="#ffffff" opacity="0.72" />
      </g>
    );
  }

  if (itemKey === 'top-cape-purple') {
    return <path d="M125 174 L160 206 L195 174" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.85" />;
  }

  if (itemKey === 'top-shirt-green') {
    return (
      <g>
        <path d="M128 188 C144 200 176 200 192 188" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.5" />
        <path d="M133 230 H187" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.32" />
      </g>
    );
  }

  return (
    <g>
      <path d="M134 180 L160 203 L186 180" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.75" />
      <path d="M133 224 H187" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.28" />
    </g>
  );
}

function BottomDetails({ itemKey, accent }: { itemKey: string | undefined; accent: string }) {
  if (itemKey === 'bottom-space') {
    return (
      <g fill={accent} opacity="0.86">
        <circle cx="143" cy="278" r="5" />
        <circle cx="183" cy="292" r="4" />
        <path d="M172 268 L176 276 L185 277 L178 283 L180 292 L172 287 L164 292 L166 283 L159 277 L168 276 Z" />
      </g>
    );
  }

  if (itemKey === 'bottom-cargo') {
    return (
      <g fill={accent} opacity="0.78">
        <rect x="129" y="280" width="21" height="16" rx="5" />
        <rect x="171" y="280" width="21" height="16" rx="5" />
      </g>
    );
  }

  if (itemKey === 'bottom-shorts') {
    return <path d="M124 282 H196" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.38" />;
  }

  return <path d="M132 270 H152 M168 270 H188" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.24" />;
}

function ShoeDetails({ itemKey, accent }: { itemKey: string | undefined; accent: string }) {
  if (itemKey === 'shoes-glow') {
    return (
      <g>
        <ellipse cx="137" cy="324" rx="27" ry="5" fill={accent} opacity="0.85" />
        <ellipse cx="183" cy="324" rx="27" ry="5" fill={accent} opacity="0.85" />
      </g>
    );
  }

  if (itemKey === 'shoes-boots') {
    return (
      <g fill="#ffffff" opacity="0.36">
        <rect x="122" y="311" width="28" height="5" rx="2" />
        <rect x="170" y="311" width="28" height="5" rx="2" />
      </g>
    );
  }

  return (
    <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.62">
      <path d="M128 316 H145" />
      <path d="M174 316 H191" />
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
      <g transform="translate(235 75)" filter="url(#avatar-soft-shadow)">
        <rect x="0" y="14" width="42" height="20" rx="9" fill={color} />
        <circle cx="-5" cy="13" r="14" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="47" cy="13" r="14" fill="none" stroke={accent} strokeWidth="4" />
        <circle cx="21" cy="24" r="4" fill={accent} />
        <path d="M9 12 H33" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.35" />
      </g>
    );
  }

  if (item.key === 'gadget-robot') {
    return (
      <g transform="translate(235 218)" filter="url(#avatar-soft-shadow)">
        <rect x="0" y="8" width="50" height="52" rx="13" fill={color} />
        <rect x="14" y="0" width="22" height="13" rx="6" fill={accent} />
        <circle cx="17" cy="29" r="4" fill={accent} />
        <circle cx="34" cy="29" r="4" fill={accent} />
        <path d="M17 43 H34" stroke={accent} strokeLinecap="round" strokeWidth="4" />
      </g>
    );
  }

  if (item.key === 'gadget-compass') {
    return (
      <g transform="translate(244 204)" filter="url(#avatar-soft-shadow)">
        <circle cx="23" cy="23" r="23" fill={color} />
        <circle cx="23" cy="23" r="17" fill="#ffffff" opacity="0.22" />
        <path d="M23 7 L33 25 L23 39 L13 25 Z" fill={accent} />
      </g>
    );
  }

  return null;
}

function lightenColor(color: string, amount: number) {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  const normalizedHex = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex.padEnd(6, '0').slice(0, 6);
  const channels = [0, 2, 4].map((index) => parseInt(normalizedHex.slice(index, index + 2), 16));
  const lightened = channels.map((channel) => Math.min(255, Math.round(channel + (255 - channel) * amount)));

  return `#${lightened.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function darkenColor(color: string, amount: number) {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  const normalizedHex = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex.padEnd(6, '0').slice(0, 6);
  const channels = [0, 2, 4].map((index) => parseInt(normalizedHex.slice(index, index + 2), 16));
  const darkened = channels.map((channel) => Math.max(0, Math.round(channel * (1 - amount))));

  return `#${darkened.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
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
