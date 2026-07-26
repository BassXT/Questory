import { useId, type CSSProperties, type ReactNode } from 'react';
import {
  getIllustratedAttachmentRect,
  illustratedAssetUrl,
  resolveIllustratedAssetForItem,
  type IllustratedAvatarAsset
} from './illustrated-avatar-assets';

export interface KenneyAvatarItem {
  key: string;
  name: string;
  colorPrimary: string | null;
  colorSecondary: string | null;
}

interface KenneyAvatarGraphicProps {
  ariaLabel: string;
  background: KenneyAvatarItem | undefined;
  body: KenneyAvatarItem | undefined;
  hair: KenneyAvatarItem | undefined;
  eyes: KenneyAvatarItem | undefined;
  mouth: KenneyAvatarItem | undefined;
  hat: KenneyAvatarItem | undefined;
  top: KenneyAvatarItem | undefined;
  bottom: KenneyAvatarItem | undefined;
  shoes: KenneyAvatarItem | undefined;
  glasses: KenneyAvatarItem | undefined;
  gadget: KenneyAvatarItem | undefined;
  weapon: KenneyAvatarItem | undefined;
  pet: KenneyAvatarItem | undefined;
  hairColor: string;
  eyesColor: string;
  style?: CSSProperties;
}

const ASSET_ROOT = '/avatar-kenney/v1';

export function KenneyAvatarGraphic({
  ariaLabel,
  background,
  body,
  hair,
  eyes,
  mouth,
  hat,
  top,
  bottom,
  shoes,
  glasses,
  gadget,
  weapon,
  pet,
  hairColor,
  eyesColor,
  style
}: KenneyAvatarGraphicProps) {
  const filterPrefix = useId().replaceAll(':', '');
  const filters = {
    bottom: `${filterPrefix}-bottom`,
    brows: `${filterPrefix}-brows`,
    eyes: `${filterPrefix}-eyes`,
    hair: `${filterPrefix}-hair`,
    shadow: `${filterPrefix}-shadow`,
    shoes: `${filterPrefix}-shoes`,
    top: `${filterPrefix}-top`
  };
  const skinTint = resolveSkinTint(body?.key);
  const hairStyle = resolveHairStyle(hair?.key);
  const eyeStyle = resolveEyeStyle(eyes?.key);
  const mouthStyle = resolveMouthStyle(mouth?.key);
  const topStyle = resolveTopStyle(top?.key);
  const bottomStyle = resolveBottomStyle(bottom?.key);
  const shoeStyle = shoes?.key.includes('boot') ? 'boot' : 'sneaker';
  const topColor = top?.colorPrimary ?? '#2f78d0';
  const topAccent = top?.colorSecondary ?? '#f6d85f';
  const bottomColor = bottom?.colorPrimary ?? '#355f9f';
  const shoeColor = shoes?.colorPrimary ?? '#d63f61';
  const hatAsset = hat ? resolveIllustratedAssetForItem('hat', hat.key) : undefined;
  const glassesAsset = glasses ? resolveIllustratedAssetForItem('glasses', glasses.key) : undefined;
  const gadgetAsset = gadget ? resolveIllustratedAssetForItem('gadget', gadget.key) : undefined;
  const weaponAsset = weapon ? resolveIllustratedAssetForItem('weapon', weapon.key) : undefined;
  const petAsset = pet ? resolveIllustratedAssetForItem('pet', pet.key) : undefined;

  return (
    <svg aria-label={ariaLabel} role="img" style={style} viewBox="0 0 360 520">
      <defs>
        <ColorMask id={filters.hair} color={hairColor} />
        <ColorMask id={filters.eyes} color={eyesColor} />
        <ColorMask id={filters.brows} color={darkenColor(hairColor, 0.3)} />
        <ColorMask id={filters.top} color={topColor} />
        <ColorMask id={filters.bottom} color={bottomColor} />
        <ColorMask id={filters.shoes} color={shoeColor} />
        <filter id={filters.shadow} height="160%" width="160%" x="-30%" y="-25%">
          <feDropShadow dx="0" dy="7" floodColor="#263447" floodOpacity="0.18" stdDeviation="5" />
        </filter>
      </defs>

      <rect fill="#fffaf0" height="520" width="360" />
      <KenneyBackground item={background} />
      <ellipse cx="180" cy="484" fill="#263447" opacity="0.16" rx="104" ry="16" />

      {gadgetAsset?.startsWith('backpack-') ? <IllustratedLayer asset={gadgetAsset} /> : null}

      <g filter={`url(#${filters.shadow})`}>
        <SkinLegs tint={skinTint} />
        <Bottom filterId={filters.bottom} item={bottom} styleName={bottomStyle} />
        <Shoes filterId={filters.shoes} item={shoes} styleName={shoeStyle} />
        <AssetImage height={27} href={`skin/tint${skinTint}-neck.png`} width={70} x={145} y={187} />
        <Arms tint={skinTint} />
        <Top
          accent={topAccent}
          color={topColor}
          filterId={filters.top}
          item={top}
          skinTint={skinTint}
          styleName={topStyle}
        />
        <AssetImage height={177} href={`skin/tint${skinTint}-head.png`} width={182} x={89} y={28} />
        <Face
          browStyle={eyeStyle === 'small' ? 'bold' : 'soft'}
          browFilterId={filters.brows}
          eyeFilterId={filters.eyes}
          eyesColor={eyesColor}
          eyeStyle={eyeStyle}
          mouthStyle={mouthStyle}
          skinTint={skinTint}
        />
        <AssetImage
          filter={`url(#${filters.hair})`}
          height={hairStyle === 'long' ? 250 : 137}
          href={`hair/${hairStyle}.png`}
          width={hairStyle === 'long' ? 182 : 174}
          x={hairStyle === 'long' ? 89 : 93}
          y={hairStyle === 'long' ? -1 : 4}
        />
        {glassesAsset ? <IllustratedLayer asset={glassesAsset} /> : null}
        {hatAsset ? <IllustratedLayer asset={hatAsset} /> : null}
        {gadgetAsset && !gadgetAsset.startsWith('backpack-') ? <IllustratedLayer asset={gadgetAsset} /> : null}
        {weaponAsset ? <IllustratedLayer asset={weaponAsset} /> : null}
      </g>

      {petAsset ? <IllustratedLayer asset={petAsset} /> : null}
    </svg>
  );
}

function ColorMask({ id, color }: { id: string; color: string }) {
  return (
    <filter colorInterpolationFilters="sRGB" height="100%" id={id} width="100%" x="0" y="0">
      <feFlood floodColor={color} result="color" />
      <feComposite in="color" in2="SourceAlpha" operator="in" />
    </filter>
  );
}

function KenneyBackground({ item }: { item: KenneyAvatarItem | undefined }) {
  const primary = item?.colorPrimary ?? '#ccefd8';
  const secondary = item?.colorSecondary ?? '#86cda0';

  if (item?.key.includes('night')) {
    return (
      <g>
        <rect fill={primary} height="520" width="360" />
        <circle cx="294" cy="80" fill="#fff2ad" r="28" />
        <path d="M0 370 C70 328 126 369 188 338 C252 306 302 334 360 292 V520 H0 Z" fill={secondary} />
        <g fill="#fff7ca">
          <circle cx="52" cy="74" r="3" />
          <circle cx="103" cy="128" r="2.5" />
          <circle cx="260" cy="168" r="3" />
        </g>
      </g>
    );
  }

  return (
    <g>
      <path d="M0 0 H360 V360 C298 390 246 354 184 379 C120 405 65 365 0 398 Z" fill={primary} />
      <path d="M0 355 C72 336 122 372 181 354 C248 334 302 369 360 339 V520 H0 Z" fill={secondary} opacity="0.62" />
      <path d="M0 428 C75 409 126 441 184 425 C244 409 301 439 360 416 V520 H0 Z" fill={darkenColor(secondary, 0.12)} opacity="0.35" />
      <g fill="#ffffff" opacity="0.28">
        <circle cx="42" cy="352" r="35" />
        <circle cx="318" cy="337" r="45" />
      </g>
    </g>
  );
}

function SkinLegs({ tint }: { tint: number }) {
  return (
    <g>
      <Mirrored>
        <AssetImage height={116} href={`skin/tint${tint}-leg.png`} width={66} x={181} y={360} />
      </Mirrored>
      <AssetImage height={116} href={`skin/tint${tint}-leg.png`} width={66} x={181} y={360} />
    </g>
  );
}

function Arms({ tint }: { tint: number }) {
  return (
    <g>
      <Mirrored>
        <AssetImage height={94} href={`skin/tint${tint}-arm.png`} width={118} x={199} y={224} />
      </Mirrored>
      <AssetImage height={94} href={`skin/tint${tint}-arm.png`} width={118} x={199} y={224} />
    </g>
  );
}

function Top({
  accent,
  color,
  filterId,
  item,
  skinTint,
  styleName
}: {
  accent: string;
  color: string;
  filterId: string;
  item: KenneyAvatarItem | undefined;
  skinTint: number;
  styleName: 'collar' | 'crew';
}) {
  const longSleeves = hasLongSleeves(item?.key);
  const sleeveHeight = longSleeves ? 98 : 67;
  const sleeveWidth = longSleeves ? 118 : 82;
  const sleeveY = longSleeves ? 219 : 224;

  return (
    <g>
      <Mirrored>
        <AssetImage
          filter={`url(#${filterId})`}
          height={sleeveHeight}
          href={`top/sleeve-${longSleeves ? 'long' : 'short'}.png`}
          width={sleeveWidth}
          x={longSleeves ? 199 : 204}
          y={sleeveY}
        />
      </Mirrored>
      <AssetImage
        filter={`url(#${filterId})`}
        height={sleeveHeight}
        href={`top/sleeve-${longSleeves ? 'long' : 'short'}.png`}
        width={sleeveWidth}
        x={longSleeves ? 199 : 204}
        y={sleeveY}
      />
      <AssetImage filter={`url(#${filterId})`} height={155} href={`top/${styleName}.png`} width={136} x={112} y={207} />
      <TopDetails accent={accent} color={color} itemKey={item?.key ?? ''} styleName={styleName} />
      <AssetImage height={47} href={`skin/tint${skinTint}-hand.png`} width={41} x={47} y={298} />
      <Mirrored>
        <AssetImage height={47} href={`skin/tint${skinTint}-hand.png`} width={41} x={47} y={298} />
      </Mirrored>
    </g>
  );
}

function TopDetails({
  accent,
  color,
  itemKey,
  styleName
}: {
  accent: string;
  color: string;
  itemKey: string;
  styleName: 'collar' | 'crew';
}) {
  if (styleName === 'collar') {
    return (
      <g fill={lightenColor(color, 0.42)} opacity="0.95">
        <path d="M151 218 L179 242 L164 254 L143 225 Z" />
        <path d="M209 218 L181 242 L196 254 L217 225 Z" />
      </g>
    );
  }

  if (itemKey.includes('striped') || itemKey.includes('rainbow')) {
    return (
      <g fill={accent} opacity="0.9">
        <rect height="9" rx="4.5" width="94" x="133" y="264" />
        <rect height="9" rx="4.5" width="94" x="133" y="286" />
      </g>
    );
  }

  if (itemKey.includes('smiley')) {
    return (
      <g transform="translate(180 274)">
        <circle fill={accent} r="30" />
        <circle cx="-10" cy="-7" fill="#fffaf0" r="3.5" />
        <circle cx="10" cy="-7" fill="#fffaf0" r="3.5" />
        <path d="M-12 7 Q0 19 12 7" fill="none" stroke="#fffaf0" strokeLinecap="round" strokeWidth="4" />
      </g>
    );
  }

  if (
    itemKey.includes('star') ||
    itemKey.includes('magic') ||
    itemKey.includes('spark') ||
    itemKey.includes('crown')
  ) {
    return <path d="M180 240 l10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3z" fill={accent} />;
  }

  if (itemKey.includes('hoodie') || itemKey.includes('sweater')) {
    return (
      <g fill="none" stroke={accent} strokeLinecap="round">
        <path d="M164 222 L168 252 M196 222 L192 252" strokeWidth="4" />
        <path d="M151 309 Q180 326 209 309" strokeWidth="5" />
      </g>
    );
  }

  return (
    <g>
      <path d="M153 297 L180 258 L207 297 Z" fill={accent} opacity="0.92" />
      <path d="M162 297 L180 274 L198 297 Z" fill="#fffaf0" opacity="0.76" />
    </g>
  );
}

function Bottom({
  filterId,
  item,
  styleName
}: {
  filterId: string;
  item: KenneyAvatarItem | undefined;
  styleName: 'long' | 'short';
}) {
  const legHeight = styleName === 'short' ? 70 : 119;
  const legWidth = styleName === 'short' ? 64 : 68;

  return (
    <g>
      <AssetImage filter={`url(#${filterId})`} height={42} href="bottom/waist.png" width={136} x={112} y={344} />
      <Mirrored>
        <AssetImage
          filter={`url(#${filterId})`}
          height={legHeight}
          href={`bottom/leg-${styleName}.png`}
          width={legWidth}
          x={181}
          y={371}
        />
      </Mirrored>
      <AssetImage
        filter={`url(#${filterId})`}
        height={legHeight}
        href={`bottom/leg-${styleName}.png`}
        width={legWidth}
        x={181}
        y={371}
      />
      {item?.key.includes('striped') || item?.key.includes('checker') ? (
        <g fill={item.colorSecondary ?? '#f6d85f'} opacity="0.75">
          <rect height="8" width="55" x="117" y="401" />
          <rect height="8" width="55" x="188" y="401" />
          <rect height="8" width="55" x="117" y="428" />
          <rect height="8" width="55" x="188" y="428" />
        </g>
      ) : null}
    </g>
  );
}

function Shoes({
  filterId,
  item,
  styleName
}: {
  filterId: string;
  item: KenneyAvatarItem | undefined;
  styleName: 'boot' | 'sneaker';
}) {
  return (
    <g>
      <AssetImage
        filter={`url(#${filterId})`}
        height={styleName === 'boot' ? 40 : 35}
        href={`shoes/${styleName}.png`}
        width={76}
        x={181}
        y={styleName === 'boot' ? 451 : 458}
      />
      <Mirrored>
        <AssetImage
          filter={`url(#${filterId})`}
          height={styleName === 'boot' ? 40 : 35}
          href={`shoes/${styleName}.png`}
          width={76}
          x={181}
          y={styleName === 'boot' ? 451 : 458}
        />
      </Mirrored>
      {styleName === 'sneaker' ? (
        <g fill="none" stroke={item?.colorSecondary ?? '#fffaf0'} strokeLinecap="round" strokeWidth="3">
          <path d="M126 470 H163" />
          <path d="M197 470 H234" />
        </g>
      ) : null}
    </g>
  );
}

function Face({
  browFilterId,
  browStyle,
  eyeFilterId,
  eyesColor,
  eyeStyle,
  mouthStyle,
  skinTint
}: {
  browFilterId: string;
  browStyle: 'bold' | 'soft';
  eyeFilterId: string;
  eyesColor: string;
  eyeStyle: 'large' | 'small';
  mouthStyle: 'glad' | 'happy' | 'oh' | 'straight';
  skinTint: number;
}) {
  const eyeSize = eyeStyle === 'large' ? 20 : 17;
  const eyeY = eyeStyle === 'large' ? 103 : 106;
  const mouthWidth = mouthStyle === 'oh' ? 17 : 38;
  const mouthHeight = mouthStyle === 'straight' ? 7 : mouthStyle === 'oh' ? 17 : 15;

  return (
    <g>
      <AssetImage filter={`url(#${browFilterId})`} height={15} href={`face/brow-${browStyle}.png`} width={36} x={126} y={82} />
      <Mirrored>
        <AssetImage filter={`url(#${browFilterId})`} height={15} href={`face/brow-${browStyle}.png`} width={36} x={126} y={82} />
      </Mirrored>
      <AssetImage filter={`url(#${eyeFilterId})`} height={eyeSize} href={`face/eye-${eyeStyle}.png`} width={eyeSize} x={136} y={eyeY} />
      <AssetImage filter={`url(#${eyeFilterId})`} height={eyeSize} href={`face/eye-${eyeStyle}.png`} width={eyeSize} x={204} y={eyeY} />
      <AssetImage height={23} href={`face/tint${skinTint}-nose.png`} width={34} x={163} y={126} />
      <AssetImage
        height={mouthHeight}
        href={`face/mouth-${mouthStyle}.png`}
        width={mouthWidth}
        x={180 - mouthWidth / 2}
        y={158}
      />
      <circle cx="126" cy="145" fill="#e56f77" opacity="0.15" r="13" />
      <circle cx="234" cy="145" fill="#e56f77" opacity="0.15" r="13" />
      <title>{`Augenfarbe ${eyesColor}`}</title>
    </g>
  );
}

function IllustratedLayer({ asset }: { asset: IllustratedAvatarAsset }) {
  const rect = getIllustratedAttachmentRect(asset);
  const isHat = asset.startsWith('hat-');
  const scale = isHat ? 0.82 : 1;
  const width = rect.width * scale;
  const height = rect.height * scale;
  const y = rect.y + (rect.height - height) / 2 + (isHat ? 8 : 0);
  return (
    <image
      height={height}
      href={illustratedAssetUrl(asset)}
      preserveAspectRatio="xMidYMid meet"
      width={width}
      x={rect.x + (rect.width - width) / 2}
      y={isHat ? Math.max(4, y) : y}
    />
  );
}

function AssetImage({
  filter,
  height,
  href,
  width,
  x,
  y
}: {
  filter?: string;
  height: number;
  href: string;
  width: number;
  x: number;
  y: number;
}) {
  return (
    <image
      filter={filter}
      height={height}
      href={`${ASSET_ROOT}/${href}`}
      preserveAspectRatio="none"
      width={width}
      x={x}
      y={y}
    />
  );
}

function Mirrored({ children }: { children: ReactNode }) {
  return <g transform="translate(360 0) scale(-1 1)">{children}</g>;
}

function resolveSkinTint(itemKey: string | undefined) {
  if (itemKey?.includes('forest')) {
    return 7;
  }
  if (itemKey?.includes('moon')) {
    return 4;
  }
  return 1;
}

function resolveHairStyle(itemKey: string | undefined): 'long' | 'short' {
  const key = itemKey ?? '';
  return key.includes('long') || key.includes('bob') || key.includes('braid') || key.includes('ponytail')
    ? 'long'
    : 'short';
}

function resolveEyeStyle(itemKey: string | undefined): 'large' | 'small' {
  const key = itemKey ?? '';
  return key.includes('calm') || key.includes('focus') || key.includes('sleep') || key.includes('determined')
    ? 'small'
    : 'large';
}

function resolveMouthStyle(itemKey: string | undefined): 'glad' | 'happy' | 'oh' | 'straight' {
  const key = itemKey ?? '';
  if (key.includes('surprise') || key.includes('song') || key.includes('oh')) {
    return 'oh';
  }
  if (key.includes('focus') || key.includes('thinking') || key.includes('straight')) {
    return 'straight';
  }
  if (key.includes('laugh') || key.includes('grin') || key.includes('open')) {
    return 'glad';
  }
  return 'happy';
}

function resolveTopStyle(itemKey: string | undefined): 'collar' | 'crew' {
  const key = itemKey ?? '';
  return key.includes('jacket') || key.includes('coat') || key.includes('armor') || key.includes('royal')
    ? 'collar'
    : 'crew';
}

function resolveBottomStyle(itemKey: string | undefined): 'long' | 'short' {
  const key = itemKey ?? '';
  return key.includes('short') || key.includes('skirt') ? 'short' : 'long';
}

function hasLongSleeves(itemKey: string | undefined) {
  const key = itemKey ?? '';
  return (
    key.includes('hoodie') ||
    key.includes('jacket') ||
    key.includes('sweater') ||
    key.includes('coat') ||
    key.includes('armor') ||
    key.includes('mage') ||
    key.includes('cape')
  );
}

function darkenColor(color: string, amount: number) {
  return shiftColor(color, -Math.abs(amount));
}

function lightenColor(color: string, amount: number) {
  return shiftColor(color, Math.abs(amount));
}

function shiftColor(color: string, amount: number) {
  const normalized = color.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return color;
  }

  const channels = [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
  const shifted = channels.map((channel) => {
    const target = amount >= 0 ? 255 : 0;
    return Math.round(channel + (target - channel) * Math.min(Math.abs(amount), 1));
  });

  return `#${shifted.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}
