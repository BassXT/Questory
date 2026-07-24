import type { CSSProperties } from 'react';
import {
  getIllustratedAttachmentRect,
  illustratedAssetUrl,
  resolveIllustratedBackpack,
  resolveIllustratedBottom,
  resolveIllustratedGadget,
  resolveIllustratedGlasses,
  resolveIllustratedHair,
  resolveIllustratedHat,
  resolveIllustratedPet,
  resolveIllustratedShoes,
  resolveIllustratedTop,
  resolveIllustratedWeapon,
  type IllustratedAvatarAsset
} from './illustrated-avatar-assets';

export interface SoftAvatarItem {
  key: string;
  name: string;
  colorPrimary: string | null;
  colorSecondary: string | null;
}

interface SoftAdventureAvatarGraphicProps {
  ariaLabel: string;
  background: SoftAvatarItem | undefined;
  body: SoftAvatarItem | undefined;
  hair: SoftAvatarItem | undefined;
  eyes: SoftAvatarItem | undefined;
  mouth: SoftAvatarItem | undefined;
  hat: SoftAvatarItem | undefined;
  top: SoftAvatarItem | undefined;
  bottom: SoftAvatarItem | undefined;
  shoes: SoftAvatarItem | undefined;
  glasses: SoftAvatarItem | undefined;
  gadget: SoftAvatarItem | undefined;
  weapon: SoftAvatarItem | undefined;
  pet: SoftAvatarItem | undefined;
  hairColor: string;
  eyesColor: string;
  style?: CSSProperties;
}

const OUTLINE = '#3a2923';
const OUTLINE_SOFT = '#6f4b3d';

export function SoftAdventureAvatarGraphic({
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
}: SoftAdventureAvatarGraphicProps) {
  const skin = body?.colorPrimary ?? '#f2b28d';
  const skinShadow = body?.colorSecondary ?? darkenColor(skin, 0.16);
  const topColor = top?.colorPrimary ?? '#2568d8';
  const bottomColor = bottom?.colorPrimary ?? '#355f9f';
  const shoeColor = shoes?.colorPrimary ?? '#d63f61';
  const hairAccent = darkenColor(hairColor, 0.24);
  const illustratedHair = resolveIllustratedHair(hair?.key);
  const illustratedHat = resolveIllustratedHat(hat?.key);
  const illustratedGlasses = resolveIllustratedGlasses(glasses?.key);
  const illustratedTop = resolveIllustratedTop(top?.key);
  const illustratedBottom = resolveIllustratedBottom(bottom?.key);
  const illustratedShoes = resolveIllustratedShoes(shoes?.key);
  const illustratedBackpack = resolveIllustratedBackpack(gadget?.key);
  const illustratedGadget = resolveIllustratedGadget(gadget?.key);
  const illustratedWeapon = resolveIllustratedWeapon(weapon?.key);
  const illustratedPet = resolveIllustratedPet(pet?.key);

  return (
    <svg
      aria-label={ariaLabel}
      role="img"
      viewBox="0 0 360 520"
      style={style}
    >
      <defs>
        <linearGradient id="soft-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(background?.colorPrimary ?? '#d9f2df', 0.12)} />
          <stop offset="100%" stopColor={background?.colorPrimary ?? '#d9f2df'} />
        </linearGradient>
        <linearGradient id="soft-skin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(skin, 0.19)} />
          <stop offset="58%" stopColor={skin} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>
        <linearGradient id="soft-top" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(topColor, 0.16)} />
          <stop offset="100%" stopColor={topColor} />
        </linearGradient>
        <linearGradient id="soft-bottom" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(bottomColor, 0.12)} />
          <stop offset="100%" stopColor={bottomColor} />
        </linearGradient>
        <linearGradient id="soft-shoes" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(shoeColor, 0.15)} />
          <stop offset="100%" stopColor={shoeColor} />
        </linearGradient>
        <linearGradient id="soft-hair" x1="0" x2="0.9" y1="0" y2="1">
          <stop offset="0%" stopColor={lightenColor(hairColor, 0.18)} />
          <stop offset="55%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairAccent} />
        </linearGradient>
        <radialGradient id="soft-cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e87573" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#e87573" stopOpacity="0" />
        </radialGradient>
        <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#263447" floodOpacity="0.2" />
        </filter>
        <filter id="soft-small-shadow" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#263447" floodOpacity="0.18" />
        </filter>
        <filter id="illustrated-hair-tint" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={colorizeMatrix(hairColor)} />
        </filter>
        <clipPath id="illustrated-hair-fringe">
          <rect x="78" y="0" width="204" height="91" rx="30" />
        </clipPath>
      </defs>

      <rect width="360" height="520" fill="#fffaf0" />
      <SoftBackground item={background} />
      <ellipse cx="180" cy="466" rx="105" ry="17" fill="#253044" opacity="0.16" />

      <g filter="url(#soft-shadow)">
        <IllustratedHair asset={illustratedHair} front={false} />
        {illustratedBackpack ? <IllustratedBackpack asset={illustratedBackpack} /> : <SoftBackGadget item={gadget} />}
        {illustratedWeapon ? <IllustratedWeapon asset={illustratedWeapon} /> : <SoftWeapon item={weapon} />}
        <AvatarRigBase skin={skin} skinShadow={skinShadow} />
        <IllustratedClothes
          bottom={illustratedBottom}
          shoes={illustratedShoes}
          top={illustratedTop}
        />
        <AvatarRigHands skin={skin} skinShadow={skinShadow} />
        <g transform="translate(25.2 13) scale(0.86)">
          <SoftHead skin={skin} skinShadow={skinShadow} />
          <SoftFace eyes={eyes} eyesColor={eyesColor} mouth={mouth} skin={skin} />
        </g>
        <IllustratedHair asset={illustratedHair} front />
        {illustratedHat ? <IllustratedHat asset={illustratedHat} /> : <SoftHat item={hat} hairColor={hairColor} />}
        {illustratedGlasses ? <IllustratedGlasses asset={illustratedGlasses} /> : (
          <g transform="translate(40.7 21.8) scale(0.774)">
            <SoftGlasses item={glasses} />
          </g>
        )}
        {illustratedGadget ? <IllustratedGadget asset={illustratedGadget} /> : <SoftFrontGadget item={gadget} />}
      </g>
      {illustratedPet ? <IllustratedPet asset={illustratedPet} /> : <SoftPet item={pet} />}
    </svg>
  );
}

function IllustratedImage({
  asset
}: {
  asset: IllustratedAvatarAsset;
}) {
  const placement = getIllustratedAttachmentRect(asset);

  return (
    <image
      height={placement.height}
      href={illustratedAssetUrl(asset)}
      preserveAspectRatio="xMidYMid meet"
      width={placement.width}
      x={placement.x}
      y={placement.y}
    />
  );
}

function IllustratedHair({ asset, front }: { asset: IllustratedAvatarAsset; front: boolean }) {
  const placement = getIllustratedAttachmentRect(asset);

  return (
    <image
      clipPath={front ? 'url(#illustrated-hair-fringe)' : undefined}
      filter="url(#illustrated-hair-tint)"
      height={placement.height}
      href={illustratedAssetUrl(asset)}
      preserveAspectRatio="xMidYMid meet"
      width={placement.width}
      x={placement.x}
      y={placement.y}
    />
  );
}

function IllustratedClothes({
  bottom,
  shoes,
  top
}: {
  bottom: IllustratedAvatarAsset;
  shoes: IllustratedAvatarAsset;
  top: IllustratedAvatarAsset;
}) {
  return (
    <g>
      <IllustratedImage asset={bottom} />
      <IllustratedImage asset={top} />
      <IllustratedImage asset={shoes} />
    </g>
  );
}

function IllustratedBackpack({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function IllustratedHat({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function IllustratedGlasses({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function IllustratedGadget({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function IllustratedWeapon({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function IllustratedPet({ asset }: { asset: IllustratedAvatarAsset }) {
  return <IllustratedImage asset={asset} />;
}

function AvatarRigBase({ skin, skinShadow }: { skin: string; skinShadow: string }) {
  return (
    <g>
      <path
        d="M158 158 C163 178 197 178 202 158 L204 215 H156 Z"
        fill="url(#soft-skin)"
      />
      <path
        d="M144 303 C153 299 169 301 177 309 L171 431 C163 438 148 438 140 431 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M216 303 C207 299 191 301 183 309 L189 431 C197 438 212 438 220 431 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M132 219 C126 228 125 242 125 258 L116 319 C119 330 133 333 141 324 L138 258 C138 242 137 229 132 219 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M228 219 C234 228 235 242 235 258 L244 319 C241 330 227 333 219 324 L222 258 C222 242 223 229 228 219 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M158 170 C170 179 190 179 202 170" fill="none" stroke={skinShadow} strokeLinecap="round" strokeWidth="2" opacity="0.42" />
    </g>
  );
}

function AvatarRigHands({ skin, skinShadow }: { skin: string; skinShadow: string }) {
  return (
    <g>
      <path d="M116 312 C116 331 124 340 134 335 C143 330 141 317 136 307 C129 311 123 314 116 312 Z" fill={skin} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
      <path d="M244 312 C244 331 236 340 226 335 C217 330 219 317 224 307 C231 311 237 314 244 312 Z" fill={skin} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
      <path d="M121 326 C125 331 130 332 134 328 M239 326 C235 331 230 332 226 328" fill="none" stroke={skinShadow} strokeLinecap="round" strokeWidth="1.8" opacity="0.55" />
    </g>
  );
}

function SoftBackground({ item }: { item: SoftAvatarItem | undefined }) {
  const accent = item?.colorSecondary ?? '#8dd3a5';

  if (item?.key === 'background-night') {
    return (
      <g>
        <path d="M0 350 C62 305 119 338 172 306 C233 270 286 304 360 252 V520 H0 Z" fill="#17213c" opacity="0.34" />
        <circle cx="294" cy="78" r="27" fill="#fff2ad" />
        <circle cx="310" cy="62" r="25" fill={item.colorPrimary ?? '#25304f'} />
        <g fill="#fff6ca">
          <circle cx="53" cy="71" r="3" />
          <circle cx="100" cy="112" r="2.5" />
          <circle cx="258" cy="151" r="3" />
          <circle cx="321" cy="204" r="2" />
          <path d="M64 160 l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" />
        </g>
      </g>
    );
  }

  if (item?.key === 'background-room') {
    return (
      <g>
        <rect y="338" width="360" height="182" fill={accent} opacity="0.42" />
        <path d="M0 382 H360 M0 428 H360 M88 338 V520 M270 338 V520" stroke="#9a653e" strokeWidth="4" opacity="0.18" />
        <rect x="30" y="65" width="92" height="112" rx="10" fill="#fffaf0" opacity="0.95" />
        <rect x="40" y="75" width="72" height="92" rx="4" fill="#bde0ec" />
        <path d="M76 75 V167 M40 121 H112" stroke="#fffaf0" strokeWidth="7" />
        <rect x="284" y="201" width="42" height="105" rx="12" fill="#fffaf0" opacity="0.88" />
        <path d="M305 222 C329 248 323 286 304 295 C285 279 283 243 305 222 Z" fill="#6dbb83" />
        <ellipse cx="180" cy="462" rx="130" ry="29" fill="#e98994" opacity="0.24" />
      </g>
    );
  }

  if (item?.key === 'background-lab') {
    return (
      <g>
        <rect y="348" width="360" height="172" fill={accent} opacity="0.2" />
        <g fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.55">
          <path d="M24 102 H105 V42" />
          <path d="M250 48 V126 H338" />
          <path d="M43 245 H104" />
          <path d="M262 230 H326" />
        </g>
        <g fill="#ffffff" opacity="0.72">
          <circle cx="105" cy="42" r="9" />
          <circle cx="250" cy="126" r="9" />
          <rect x="38" y="372" width="67" height="66" rx="14" />
        </g>
        <path d="M63 391 h17 l8 30 H55 Z" fill="#49b6ce" opacity="0.74" />
        <circle cx="71" cy="410" r="8" fill="#ffffff" opacity="0.5" />
      </g>
    );
  }

  return (
    <g>
      <path d="M15 24 L232 70 L183 392 L0 358 Z" fill={lightenColor(item?.colorPrimary ?? '#bfe8d6', 0.14)} />
      <path d="M234 39 L360 0 V382 L191 389 Z" fill="#b8e8f5" opacity="0.86" />
      <path d="M0 366 C73 350 120 379 180 365 C248 349 302 372 360 350 V520 H0 Z" fill={accent} opacity="0.48" />
      <path d="M0 430 C72 414 124 438 181 426 C241 414 300 431 360 411 V520 H0 Z" fill={darkenColor(accent, 0.12)} opacity="0.28" />
      <g fill="#ffffff" opacity="0.26">
        <circle cx="42" cy="362" r="34" />
        <circle cx="318" cy="345" r="46" />
      </g>
      <g fill="#f1c83b">
        <circle cx="46" cy="422" r="4" />
        <circle cx="316" cy="404" r="4" />
      </g>
    </g>
  );
}

function SoftBody({
  skin,
  top,
  topColor,
  topAccent,
  bottom,
  bottomColor,
  bottomAccent,
  shoes,
  shoeAccent
}: {
  skin: string;
  top: SoftAvatarItem | undefined;
  topColor: string;
  topAccent: string;
  bottom: SoftAvatarItem | undefined;
  bottomColor: string;
  bottomAccent: string;
  shoes: SoftAvatarItem | undefined;
  shoeAccent: string;
}) {
  const isDress = top?.key.includes('dress');
  const isSkirt = bottom?.key.includes('skirt');
  const isShorts = bottom?.key.includes('shorts');

  return (
    <g>
      <path
        d="M158 162 C164 176 196 176 202 162 L204 207 H156 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3"
      />

      {isDress || isSkirt || isShorts ? (
        <g>
          <path d="M143 333 L139 423" stroke={OUTLINE} strokeLinecap="round" strokeWidth="31" />
          <path d="M217 333 L221 423" stroke={OUTLINE} strokeLinecap="round" strokeWidth="31" />
          <path d="M143 333 L139 423" stroke="url(#soft-skin)" strokeLinecap="round" strokeWidth="25" />
          <path d="M217 333 L221 423" stroke="url(#soft-skin)" strokeLinecap="round" strokeWidth="25" />
        </g>
      ) : (
        <SoftPants item={bottom} color={bottomColor} accent={bottomAccent} />
      )}

      {isSkirt && !isDress ? <SoftSkirt item={bottom} color={bottomColor} accent={bottomAccent} /> : null}
      {isShorts && !isDress ? <SoftShorts item={bottom} color={bottomColor} accent={bottomAccent} /> : null}

      <SoftBackCape item={top} />
      <path
        d="M145 199 C150 181 164 176 180 181 C196 176 210 181 215 199 L207 216 C194 210 166 210 153 216 Z"
        fill="url(#soft-top)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path
        d="M126 205 C139 186 159 183 180 187 C201 183 221 186 234 205 C226 240 224 281 228 319 C210 334 150 334 132 319 C136 281 134 240 126 205 Z"
        fill="url(#soft-top)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="M207 193 C224 199 229 213 227 235 L224 304 C213 316 203 319 195 320 C204 284 205 237 207 193 Z"
        fill={topAccent}
        opacity="0.2"
      />
      <path d="M137 224 C151 217 164 218 176 222" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.22" />
      <path d="M139 204 C149 216 211 216 221 204" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.32" />
      <path d="M136 309 C155 319 205 319 224 309" fill="none" stroke={topAccent} strokeLinecap="round" strokeWidth="4" opacity="0.5" />
      <SoftSleeves skin={skin} top={top} topColor={topColor} />
      <SoftTopDetails item={top} color={topColor} accent={topAccent} />
      {isDress ? <SoftDress item={top} color={topColor} accent={topAccent} /> : null}

      <g transform="translate(25.2 0) scale(0.86 1)">
        <SoftShoes item={shoes} accent={shoeAccent} />
      </g>
    </g>
  );
}

function SoftSleeves({ skin, top, topColor }: { skin: string; top: SoftAvatarItem | undefined; topColor: string }) {
  const longSleeve = Boolean(
    top?.key.includes('hoodie') ||
      top?.key.includes('jacket') ||
      top?.key.includes('sweater') ||
      top?.key.includes('mage') ||
      top?.key.includes('armor') ||
      top?.key.includes('coat')
  );

  return (
    <g>
      {longSleeve ? (
        <g>
          <path
            d="M135 207 C118 211 108 231 107 256 C107 277 112 302 115 321 C117 332 129 338 138 331 C144 326 141 317 137 307 C132 286 130 265 133 247 C135 231 142 222 148 216 Z"
            fill={topColor}
            stroke={OUTLINE}
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d="M225 207 C242 211 252 231 253 256 C253 277 248 302 245 321 C243 332 231 338 222 331 C216 326 219 317 223 307 C228 286 230 265 227 247 C225 231 218 222 212 216 Z"
            fill={topColor}
            stroke={OUTLINE}
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path d="M119 312 C123 319 132 321 139 315 M241 312 C237 319 228 321 221 315" fill="none" stroke={lightenColor(topColor, 0.22)} strokeLinecap="round" strokeWidth="4" opacity="0.58" />
          <path d="M117 326 C116 338 126 346 136 340 C142 336 141 328 137 322 C132 327 124 329 117 326 Z" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
          <path d="M243 326 C244 338 234 346 224 340 C218 336 219 328 223 322 C228 327 236 329 243 326 Z" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
          <path d="M121 332 C125 336 130 337 134 334 M239 332 C235 336 230 337 226 334" fill="none" stroke={OUTLINE_SOFT} strokeLinecap="round" strokeWidth="2" opacity="0.55" />
        </g>
      ) : (
        <g>
          <path d="M137 207 C120 209 112 218 109 232 C118 239 129 242 140 240 L148 216 Z" fill={topColor} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path d="M223 207 C240 209 248 218 251 232 C242 239 231 242 220 240 L212 216 Z" fill={topColor} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path
            d="M111 231 C106 254 108 285 115 321 C117 333 129 340 138 333 C144 327 140 318 137 307 C132 283 131 258 140 239 C130 241 120 238 111 231 Z"
            fill="url(#soft-skin)"
            stroke={OUTLINE}
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d="M249 231 C254 254 252 285 245 321 C243 333 231 340 222 333 C216 327 220 318 223 307 C228 283 229 258 220 239 C230 241 240 238 249 231 Z"
            fill="url(#soft-skin)"
            stroke={OUTLINE}
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path d="M118 325 C119 338 128 343 138 334 M242 325 C241 338 232 343 222 334" fill="none" stroke={OUTLINE_SOFT} strokeLinecap="round" strokeWidth="2" opacity="0.5" />
        </g>
      )}
    </g>
  );
}

function SoftPants({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  const cargo = Boolean(item?.key.includes('cargo'));
  const pantsPath = cargo
    ? 'M129 307 C150 321 210 321 231 307 L229 363 C225 381 225 406 221 426 C212 432 199 432 188 425 L180 337 L172 425 C161 432 148 432 139 426 C135 406 135 381 131 363 Z'
    : 'M132 309 C151 321 209 321 228 309 L220 426 C211 431 198 431 188 425 L180 337 L172 425 C162 431 149 431 140 426 Z';

  return (
    <g>
      <path
        d={pantsPath}
        fill="url(#soft-bottom)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M205 321 C215 322 220 320 226 316 L220 422 C211 428 204 428 198 426 L190 340 C197 335 201 328 205 321 Z" fill={accent} opacity="0.22" />
      <path d="M180 334 V422" stroke={darkenColor(color, 0.24)} strokeLinecap="round" strokeWidth="4" opacity="0.58" />
      <path d="M145 326 C158 334 202 334 215 326" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="4" opacity="0.52" />
      <path d="M148 345 C152 351 161 353 168 350 M212 345 C208 351 199 353 192 350" fill="none" stroke={lightenColor(color, 0.24)} strokeLinecap="round" strokeWidth="3" opacity="0.5" />
      <path d="M146 397 C152 402 160 403 168 399 M214 397 C208 402 200 403 192 399" fill="none" stroke={darkenColor(color, 0.24)} strokeLinecap="round" strokeWidth="3" opacity="0.38" />
      {cargo ? (
        <g fill={accent}>
          <path d="M132 347 C142 343 155 344 166 350 L164 378 C154 382 142 380 134 374 Z" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
          <path d="M228 347 C218 343 205 344 194 350 L196 378 C206 382 218 380 226 374 Z" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
          <path d="M138 353 H160 M200 353 H222" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.38" />
          <circle cx="153" cy="362" r="2.5" fill={lightenColor(accent, 0.42)} />
          <circle cx="207" cy="362" r="2.5" fill={lightenColor(accent, 0.42)} />
        </g>
      ) : null}
      {item?.key.includes('checker') ? (
        <g fill={accent} opacity="0.72">
          <rect x="141" y="341" width="20" height="18" rx="3" />
          <rect x="199" y="376" width="19" height="18" rx="3" />
          <rect x="143" y="392" width="18" height="18" rx="3" />
        </g>
      ) : null}
      {item?.key.includes('space') || item?.key.includes('royal') ? (
        <g fill={accent}>
          <circle cx="151" cy="350" r="5" />
          <circle cx="207" cy="386" r="4" />
          <path d="M200 338 l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z" />
        </g>
      ) : null}
      {item?.key.includes('leggings') ? (
        <g fill="none" stroke={accent} strokeWidth="6" opacity="0.72">
          <path d="M143 382 H171" />
          <path d="M189 382 H217" />
        </g>
      ) : null}
    </g>
  );
}

function SoftShorts({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  return (
    <g>
      <path
        d="M131 309 C151 322 209 322 229 309 L220 357 H189 L180 333 L171 357 H140 Z"
        fill={color}
        stroke={OUTLINE}
        strokeOpacity="0.24"
        strokeWidth="3"
      />
      <path d="M142 325 H218" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity="0.58" />
      {item?.key.includes('yellow') ? <path d="M146 343 H166 M194 343 H214" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.36" /> : null}
    </g>
  );
}

function SoftSkirt({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  return (
    <g>
      <path
        d="M137 305 H223 L240 362 C215 377 145 377 120 362 Z"
        fill={color}
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M138 316 H222" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.7" />
      <path d="M151 319 L146 365 M180 319 V371 M209 319 L214 365" fill="none" stroke={darkenColor(color, 0.22)} strokeLinecap="round" strokeWidth="3" opacity="0.48" />
      {item?.key.includes('striped') || item?.key.includes('rainbow') ? (
        <path d="M128 343 C151 353 209 353 232 343" fill="none" stroke={item.key.includes('rainbow') ? '#49bfa8' : accent} strokeWidth="7" />
      ) : null}
      {item?.key.includes('flower') ? (
        <g fill={accent}>
          <circle cx="151" cy="340" r="6" />
          <circle cx="207" cy="350" r="5" />
          <circle cx="151" cy="340" r="2" fill="#fff6ca" />
          <circle cx="207" cy="350" r="2" fill="#fff6ca" />
        </g>
      ) : null}
    </g>
  );
}

function SoftDress({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  return (
    <g>
      <path
        d="M137 284 H223 L247 377 C216 394 144 394 113 377 Z"
        fill={color}
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M134 303 C158 316 202 316 226 303" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.72" />
      <path d="M125 365 C154 378 206 378 235 365" fill="none" stroke={lightenColor(accent, 0.12)} strokeLinecap="round" strokeWidth="6" opacity="0.6" />
      <path d="M151 313 L142 373 M180 313 V383 M209 313 L218 373" fill="none" stroke={darkenColor(color, 0.2)} strokeLinecap="round" strokeWidth="3" opacity="0.42" />
      {item?.key.includes('flower') ? (
        <g fill={accent}>
          <circle cx="155" cy="333" r="7" />
          <circle cx="203" cy="347" r="6" />
          <circle cx="155" cy="333" r="2.5" fill="#fff6ca" />
          <circle cx="203" cy="347" r="2" fill="#fff6ca" />
        </g>
      ) : null}
      {item?.key.includes('night') ? (
        <g fill="#fff1a8">
          <circle cx="153" cy="333" r="4" />
          <circle cx="207" cy="352" r="3" />
          <path d="M190 324 l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1z" />
        </g>
      ) : null}
    </g>
  );
}

function SoftBackCape({ item }: { item: SoftAvatarItem | undefined }) {
  if (!item || (!item.key.includes('cape') && !item.key.includes('mage') && !item.key.includes('royal'))) {
    return null;
  }

  const color = item.colorSecondary ?? item.colorPrimary ?? '#6a4bb8';
  return <path d="M122 201 C102 247 105 355 131 407 C158 387 202 387 229 407 C255 355 258 247 238 201 C206 223 154 223 122 201 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />;
}

function SoftTopDetails({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  const key = item?.key ?? '';

  if (key.includes('hoodie')) {
    return (
      <g>
        <path d="M143 198 C146 176 162 167 180 174 C198 167 214 176 217 198 L207 220 C196 211 164 211 153 220 Z" fill={darkenColor(color, 0.12)} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3.5" />
        <path d="M158 206 L156 246 M202 206 L204 246" stroke="#f7f2e9" strokeLinecap="round" strokeWidth="4" />
        <circle cx="156" cy="247" r="4.5" fill="#f7f2e9" stroke={OUTLINE} strokeWidth="1.5" />
        <circle cx="204" cy="247" r="4.5" fill="#f7f2e9" stroke={OUTLINE} strokeWidth="1.5" />
        <path d="M146 274 C156 264 204 264 214 274 L210 301 C193 309 167 309 150 301 Z" fill={darkenColor(color, 0.08)} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" opacity="0.92" />
        <path d="M158 282 C170 288 190 288 202 282" fill="none" stroke={lightenColor(color, 0.28)} strokeLinecap="round" strokeWidth="3" opacity="0.54" />
        <path d="M139 309 C159 318 201 318 221 309" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.72" />
      </g>
    );
  }

  if (key.includes('jacket') || key.includes('coat')) {
    return (
      <g>
        <path d="M137 198 H161 L155 318 H133 Z M199 198 H223 L227 318 H205 Z" fill={accent} opacity="0.78" />
        <path d="M161 201 L180 226 L199 201" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.62" />
        <path d="M180 226 V309" stroke={darkenColor(accent, 0.15)} strokeWidth="4" opacity="0.55" />
        <circle cx="188" cy="244" r="3.5" fill="#fff6ca" />
        <circle cx="188" cy="272" r="3.5" fill="#fff6ca" />
      </g>
    );
  }

  if (key.includes('armor')) {
    return (
      <g>
        <path d="M139 205 H221 L210 294 C194 303 166 303 150 294 Z" fill={accent} opacity="0.88" />
        <path d="M150 225 H210 M147 251 H213 M145 278 H215" stroke={lightenColor(color, 0.38)} strokeLinecap="round" strokeWidth="5" opacity="0.72" />
        <path d="M180 229 l8 15-8 13-8-13z" fill="#fff3a6" />
      </g>
    );
  }

  if (key.includes('overalls')) {
    return (
      <g>
        <path d="M146 195 H162 V260 H198 V195 H214 V319 H146 Z" fill={accent} opacity="0.88" />
        <rect x="157" y="252" width="46" height="42" rx="8" fill={accent} />
        <circle cx="158" cy="216" r="4" fill="#f7d36b" />
        <circle cx="202" cy="216" r="4" fill="#f7d36b" />
        <path d="M166 268 H194" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.4" />
      </g>
    );
  }

  return (
    <g>
      <path d="M148 198 L180 219 L212 198" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" opacity="0.78" />
      <path d="M145 306 C160 314 200 314 215 306" fill="none" stroke={darkenColor(color, 0.18)} strokeLinecap="round" strokeWidth="3" opacity="0.42" />
      <SoftShirtMotif itemKey={key} color={color} accent={accent} />
    </g>
  );
}

function SoftShirtMotif({ itemKey, color, accent }: { itemKey: string; color: string; accent: string }) {
  if (itemKey.includes('striped') || itemKey.includes('rainbow')) {
    return (
      <g fill="none" strokeLinecap="round" strokeWidth="7">
        <path d="M143 242 H217" stroke={accent} />
        <path d="M141 267 H219" stroke={itemKey.includes('rainbow') ? '#48bba4' : accent} />
        <path d="M140 292 H220" stroke={itemKey.includes('rainbow') ? '#f2ca4c' : accent} />
      </g>
    );
  }

  if (itemKey.includes('checker')) {
    return (
      <g fill={accent} opacity="0.82">
        <rect x="147" y="232" width="22" height="20" rx="3" />
        <rect x="191" y="232" width="22" height="20" rx="3" />
        <rect x="169" y="252" width="22" height="20" rx="3" />
        <rect x="147" y="272" width="22" height="20" rx="3" />
        <rect x="191" y="272" width="22" height="20" rx="3" />
      </g>
    );
  }

  if (itemKey.includes('dots')) {
    return (
      <g fill={accent}>
        <circle cx="153" cy="241" r="5" />
        <circle cx="199" cy="245" r="6" />
        <circle cx="177" cy="276" r="5" />
        <circle cx="207" cy="294" r="4" />
      </g>
    );
  }

  if (itemKey.includes('smiley')) {
    return (
      <g>
        <circle cx="180" cy="260" r="29" fill={accent} />
        <circle cx="169" cy="252" r="4" fill={color} />
        <circle cx="191" cy="252" r="4" fill={color} />
        <path d="M165 266 C173 278 187 278 195 266" fill="none" stroke={color} strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (itemKey.includes('gamepad')) {
    return (
      <g>
        <rect x="145" y="244" width="70" height="39" rx="16" fill={accent} />
        <path d="M161 263 H177 M169 255 V271" stroke={color} strokeLinecap="round" strokeWidth="5" />
        <circle cx="198" cy="258" r="4" fill={color} />
        <circle cx="205" cy="269" r="4" fill={color} />
      </g>
    );
  }

  if (itemKey.includes('rocket')) {
    return (
      <g transform="translate(180 260)">
        <path d="M0 -29 C16 -18 18 10 0 27 C-18 10 -16 -18 0 -29 Z" fill={accent} />
        <circle cy="-6" r="6" fill="#81d4e7" />
        <path d="M-8 20 L-18 32 L-3 26 M8 20 L18 32 L3 26" fill={accent} />
        <path d="M0 27 L7 39 H-7 Z" fill="#f07b51" />
      </g>
    );
  }

  if (itemKey.includes('moon')) {
    return <path d="M191 231 C164 236 159 273 184 286 C171 267 179 245 201 239 C198 236 195 233 191 231 Z" fill={accent} />;
  }

  if (itemKey.includes('bolt')) {
    return <path d="M187 228 L157 266 H178 L168 300 L205 254 H184 Z" fill={accent} />;
  }

  if (itemKey.includes('crown')) {
    return <path d="M149 251 L159 270 H201 L211 251 L198 259 L188 239 L180 258 L169 239 L160 259 Z" fill={accent} />;
  }

  if (itemKey.includes('heart')) {
    return <path d="M180 289 C170 278 145 264 148 246 C151 226 175 228 180 242 C185 228 209 226 212 246 C215 264 190 278 180 289 Z" fill={accent} />;
  }

  if (itemKey.includes('spark')) {
    return <path d="M180 225 L188 251 L215 260 L188 269 L180 296 L172 269 L145 260 L172 251 Z" fill={accent} />;
  }

  return <path d="M180 228 L190 249 L213 252 L196 268 L201 292 L180 281 L159 292 L164 268 L147 252 L170 249 Z" fill={accent} opacity={itemKey.includes('star') ? 1 : 0.32} />;
}

function SoftShoes({ item, accent }: { item: SoftAvatarItem | undefined; accent: string }) {
  const isBoot = item?.key.includes('boot');
  return (
    <g>
      {isBoot ? (
        <g>
          <path d="M116 384 H164 V444 C152 458 118 459 102 447 L113 425 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path d="M196 384 H244 L258 447 C242 459 208 458 196 444 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path d="M147 388 H163 V439 C153 448 145 449 137 448 C147 431 149 408 147 388 Z M213 388 H243 L252 443 C244 449 235 450 226 447 C236 429 232 405 213 388 Z" fill={accent} opacity="0.2" />
          <path d="M119 406 H158 M202 406 H241" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.78" />
          <path d="M111 444 C127 449 149 449 162 443 M198 443 C211 449 233 449 249 444" fill="none" stroke={darkenColor(accent, 0.18)} strokeLinecap="round" strokeWidth="5" />
          <path d="M126 414 l25 20 M151 414 l-25 20 M209 414 l25 20 M234 414 l-25 20" fill="none" stroke="#f8f2e7" strokeLinecap="round" strokeWidth="3" opacity="0.74" />
        </g>
      ) : (
        <g>
          <path d="M111 416 C128 405 153 407 166 423 L164 449 C145 460 111 458 97 446 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path d="M249 416 C232 405 207 407 194 423 L196 449 C215 460 249 458 263 446 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
          <path d="M146 413 C156 415 163 420 166 426 L164 447 C154 453 145 454 136 454 C150 442 153 426 146 413 Z M214 413 C204 415 197 420 194 426 L196 447 C206 453 215 454 224 454 C210 442 207 426 214 413 Z" fill={accent} opacity="0.18" />
          <path d="M119 425 l30 18 M149 425 l-30 18 M211 425 l30 18 M241 425 l-30 18" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3.5" opacity="0.88" />
          <path d="M105 447 H162 M198 447 H255" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.9" />
          <path d="M107 453 C125 458 146 458 161 452 M199 452 C214 458 235 458 253 453" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.78" />
        </g>
      )}
      {item?.key.includes('glow') || item?.key.includes('gold') ? (
        <g fill={lightenColor(accent, 0.25)} opacity="0.45">
          <ellipse cx="132" cy="457" rx="37" ry="8" />
          <ellipse cx="228" cy="457" rx="37" ry="8" />
        </g>
      ) : null}
    </g>
  );
}

function SoftHead({ skin, skinShadow }: { skin: string; skinShadow: string }) {
  return (
    <g>
      <path d="M123 99 C106 94 101 108 106 124 C110 137 120 141 130 134" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3.5" />
      <path d="M237 99 C254 94 259 108 254 124 C250 137 240 141 230 134" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3.5" />
      <path d="M113 112 C119 107 124 111 125 120 M247 112 C241 107 236 111 235 120" fill="none" stroke={skinShadow} strokeLinecap="round" strokeWidth="3" opacity="0.65" />
      <path
        d="M180 31 C140 31 119 59 119 102 C119 146 140 174 180 183 C220 174 241 146 241 102 C241 59 220 31 180 31 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path d="M210 42 C230 56 239 76 239 103 C239 143 219 168 180 180 C201 162 208 141 209 110 C210 82 205 60 210 42 Z" fill={skinShadow} opacity="0.14" />
      <path d="M137 70 C144 51 160 41 178 39" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.2" />
      <path d="M133 137 C147 166 211 166 227 137 C215 170 199 179 180 183 C161 179 145 170 133 137 Z" fill={skinShadow} opacity="0.16" />
      <ellipse cx="143" cy="132" rx="21" ry="12" fill="url(#soft-cheek)" />
      <ellipse cx="217" cy="132" rx="21" ry="12" fill="url(#soft-cheek)" />
      <path d="M131 61 C146 40 171 34 192 36" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="7" opacity="0.12" />
    </g>
  );
}

function SoftFace({
  eyes,
  eyesColor,
  mouth,
  skin
}: {
  eyes: SoftAvatarItem | undefined;
  eyesColor: string;
  mouth: SoftAvatarItem | undefined;
  skin: string;
}) {
  const eyeKey = eyes?.key ?? '';
  const browColor = darkenColor(eyesColor, 0.4);

  return (
    <g>
      <SoftEyes itemKey={eyeKey} color={eyesColor} />
      <SoftEyebrows itemKey={eyeKey} color={browColor} />
      <path d="M178 106 C174 116 174 124 182 127" fill="none" stroke={darkenColor(skin, 0.25)} strokeLinecap="round" strokeWidth="2.5" opacity="0.62" />
      <path d="M174 129 C178 132 183 132 187 129" fill="none" stroke={darkenColor(skin, 0.2)} strokeLinecap="round" strokeWidth="1.7" opacity="0.38" />
      <circle cx="165" cy="128" r="1.7" fill={darkenColor(skin, 0.2)} opacity="0.42" />
      <circle cx="157" cy="125" r="1.4" fill={darkenColor(skin, 0.2)} opacity="0.38" />
      <circle cx="195" cy="128" r="1.7" fill={darkenColor(skin, 0.2)} opacity="0.42" />
      <circle cx="203" cy="125" r="1.4" fill={darkenColor(skin, 0.2)} opacity="0.38" />
      <SoftMouth item={mouth} />
    </g>
  );
}

function SoftEyes({ itemKey, color }: { itemKey: string; color: string }) {
  if (itemKey.includes('smile') || itemKey.includes('happy-arc')) {
    return (
      <g fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4">
        <path d="M136 103 C144 94 155 94 163 103" />
        <path d="M197 103 C205 94 216 94 224 103" />
      </g>
    );
  }

  if (itemKey.includes('wink')) {
    return (
      <g>
        <SoftOpenEye cx={149} color={color} />
        <path d="M199 103 C207 96 217 96 224 103" fill="none" stroke={darkenColor(color, 0.25)} strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (itemKey.includes('sleepy') || itemKey.includes('calm')) {
    return (
      <g fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4">
        <path d="M136 101 C145 107 154 107 162 101" />
        <path d="M198 101 C206 107 215 107 224 101" />
      </g>
    );
  }

  if (itemKey.includes('star')) {
    return (
      <g fill={color}>
        <path d="M149 87 l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" />
        <path d="M211 87 l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" />
      </g>
    );
  }

  const round = itemKey.includes('round') || itemKey.includes('curious');
  return (
    <g>
      <SoftOpenEye cx={149} color={color} round={round} />
      <SoftOpenEye cx={211} color={color} round={round} />
    </g>
  );
}

function SoftOpenEye({ cx, color, round = false }: { cx: number; color: string; round?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy="103" rx={round ? 14.5 : 13.5} ry={round ? 16 : 14.5} fill="#fffdf8" stroke={OUTLINE} strokeWidth="2.7" />
      <ellipse cx={cx} cy="104" rx={round ? 9.5 : 8.7} ry={round ? 11.5 : 10.3} fill={darkenColor(color, 0.25)} />
      <ellipse cx={cx} cy="103" rx={round ? 7.2 : 6.5} ry={round ? 8.8 : 7.8} fill={color} />
      <ellipse cx={cx} cy="106" rx="3.5" ry="4.8" fill={darkenColor(color, 0.72)} />
      <circle cx={cx - 3.2} cy="97.5" r="3.3" fill="#ffffff" />
      <circle cx={cx + 3.7} cy="108.5" r="1.5" fill="#ffffff" opacity="0.9" />
      <path d={`M${cx - 13} 97 C${cx - 6} 88 ${cx + 7} 88 ${cx + 13} 97`} fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="3.4" />
      <path d={`M${cx - 13} 96 l-5 -3 M${cx + 13} 96 l5 -3`} stroke={OUTLINE} strokeLinecap="round" strokeWidth="2.2" />
    </g>
  );
}

function SoftEyebrows({ itemKey, color }: { itemKey: string; color: string }) {
  const determined = itemKey.includes('focus') || itemKey.includes('determined') || itemKey.includes('night');
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="4.5">
      <path d={determined ? 'M134 77 L163 84' : 'M134 81 C145 74 155 75 164 81'} />
      <path d={determined ? 'M226 77 L197 84' : 'M196 81 C205 75 215 74 226 81'} />
    </g>
  );
}

function SoftMouth({ item }: { item: SoftAvatarItem | undefined }) {
  const key = item?.key ?? 'mouth-smile';
  const color = item?.colorPrimary ?? '#9a5a4a';

  if (key.includes('surprise') || key.includes('song')) {
    return <ellipse cx="180" cy="145" rx={key.includes('song') ? 12 : 9} ry={key.includes('song') ? 14 : 11} fill={color} />;
  }

  if (key.includes('laugh') || key.includes('open-happy') || key.includes('grin')) {
    return (
      <g>
        <path d="M157 140 C168 151 192 151 203 140 C202 166 158 166 157 140 Z" fill={darkenColor(color, 0.2)} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="2.5" />
        <path d="M162 144 C173 149 187 149 198 144" stroke="#ffffff" strokeLinecap="round" strokeWidth="6" opacity="0.95" />
        <path d="M169 158 C177 153 186 153 193 158" fill="none" stroke="#e97982" strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (key.includes('silly')) {
    return (
      <g>
        <path d="M158 141 C170 154 191 154 202 141" fill="none" stroke={color} strokeLinecap="round" strokeWidth="5" />
        <path d="M179 151 C183 162 194 159 194 151" fill="#e97887" />
      </g>
    );
  }

  if (key.includes('focus') || key.includes('thinking') || key.includes('hero') || key.includes('brave')) {
    return <path d="M164 148 C174 143 188 143 197 147" fill="none" stroke={color} strokeLinecap="round" strokeWidth="5" />;
  }

  if (key.includes('proud') || key.includes('cool')) {
    return <path d="M160 143 C173 154 190 154 203 142" fill="none" stroke={color} strokeLinecap="round" strokeWidth="5" />;
  }

  if (key.includes('tiny')) {
    return <path d="M174 146 H186" stroke={color} strokeLinecap="round" strokeWidth="4" />;
  }

  return (
    <g>
      <path d="M159 141 C171 156 189 156 201 141" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth={key.includes('small') || key.includes('soft') ? 3.5 : 4.5} />
      <path d="M169 151 C176 154 184 154 191 151" fill="none" stroke="#e37b7e" strokeLinecap="round" strokeWidth="2.5" opacity="0.8" />
    </g>
  );
}

function SoftHairBack({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  const style = getHairStyle(itemKey);

  if (style === 'buns') {
    return (
      <g>
        <circle cx="126" cy="47" r="29" fill="url(#soft-hair)" stroke={OUTLINE} strokeWidth="4" />
        <circle cx="234" cy="47" r="29" fill="url(#soft-hair)" stroke={OUTLINE} strokeWidth="4" />
        <path d="M112 105 C115 24 245 24 248 105 L233 163 C216 181 144 181 127 163 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M109 48 C120 36 131 35 143 48 M217 48 C229 35 240 36 251 48" fill="none" stroke={lightenColor(color, 0.24)} strokeLinecap="round" strokeWidth="5" opacity="0.46" />
      </g>
    );
  }

  if (style === 'curls') {
    const curls = [
      [120, 57], [142, 39], [168, 34], [194, 36], [219, 47], [240, 67],
      [111, 87], [249, 96], [116, 126], [244, 135], [130, 157], [230, 163]
    ];
    return (
      <g>
        <path d="M101 101 C99 45 132 20 179 21 C230 20 262 51 258 111 L245 173 C225 198 137 198 116 172 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="5" />
        {curls.map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={cx}
              cy={cy}
              r={index < 6 ? 23 : 21}
              fill={index % 3 ? 'url(#soft-hair)' : color}
              stroke={OUTLINE}
              strokeWidth="3"
            />
            <path
              d={`M${cx - 10} ${cy - 2} C${cx - 7} ${cy - 13} ${cx + 8} ${cy - 13} ${cx + 11} ${cy - 2} C${cx + 6} ${cy + 7} ${cx - 4} ${cy + 8} ${cx - 10} ${cy + 1}`}
              fill="none"
              stroke={lightenColor(color, 0.28)}
              strokeLinecap="round"
              strokeWidth="2.5"
              opacity="0.42"
            />
          </g>
        ))}
        <path d="M112 70 C128 49 143 45 157 47 M202 42 C219 48 234 60 242 76 M111 124 C121 135 130 139 140 137 M220 146 C231 141 240 132 245 121" fill="none" stroke={lightenColor(color, 0.28)} strokeLinecap="round" strokeWidth="4" opacity="0.45" />
      </g>
    );
  }

  if (style === 'braids') {
    return (
      <g>
        <path d="M112 103 C115 31 245 31 248 103 L235 154 C216 172 144 172 125 154 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        {[168, 188, 208, 228].map((cy) => (
          <g key={cy}>
            <ellipse cx="116" cy={cy} rx="14" ry="17" fill="url(#soft-hair)" stroke={OUTLINE} strokeWidth="3" />
            <ellipse cx="244" cy={cy} rx="14" ry="17" fill="url(#soft-hair)" stroke={OUTLINE} strokeWidth="3" />
          </g>
        ))}
        <circle cx="116" cy="247" r="9" fill={lightenColor(color, 0.2)} stroke={OUTLINE} strokeWidth="3" />
        <circle cx="244" cy="247" r="9" fill={lightenColor(color, 0.2)} stroke={OUTLINE} strokeWidth="3" />
      </g>
    );
  }

  if (style === 'ponytail') {
    return (
      <g>
        <path d="M111 104 C114 31 244 31 248 104 L232 168 C213 190 147 190 128 168 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M232 69 C288 72 291 158 247 197 C264 153 251 118 224 103 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M242 91 C266 111 268 146 253 172" fill="none" stroke={lightenColor(color, 0.24)} strokeLinecap="round" strokeWidth="5" opacity="0.48" />
      </g>
    );
  }

  if (style === 'long') {
    return (
      <g>
        <path d="M108 103 C112 26 247 25 251 104 C248 130 244 151 248 172 C252 193 244 217 227 231 C213 241 197 235 180 230 C163 235 147 241 133 231 C116 217 108 193 112 172 C116 151 112 130 108 103 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M118 103 C122 39 238 38 242 104 C239 132 238 154 241 177 C242 195 236 211 226 221 C212 215 197 214 180 220 C163 214 148 215 134 221 C124 211 118 195 119 177 C122 154 121 132 118 103 Z" fill="url(#soft-hair)" />
        <path d="M133 58 C158 39 202 39 227 60 M128 110 C135 142 129 178 121 207 M232 110 C225 142 231 178 239 207 M148 89 C144 127 147 168 153 203 M212 89 C216 127 213 168 207 203" fill="none" stroke={lightenColor(color, 0.22)} strokeLinecap="round" strokeWidth="5" opacity="0.42" />
      </g>
    );
  }

  if (style === 'bob') {
    return <path d="M108 103 C111 27 247 25 251 103 L244 164 C226 185 204 190 180 187 C156 190 134 185 116 164 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />;
  }

  return <path d="M112 105 C114 28 246 28 248 105 L234 160 C214 180 146 180 126 160 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />;
}

function SoftHairFront({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  const style = getHairStyle(itemKey);

  if (style === 'curls') {
    const curls = [[126, 63], [148, 48], [174, 44], [199, 47], [222, 62], [238, 84], [116, 91]];
    return (
      <g>
        {curls.map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="20" fill={index % 2 ? 'url(#soft-hair)' : color} stroke={OUTLINE} strokeWidth="3" />
            <path d={`M${cx - 9} ${cy} C${cx - 6} ${cy - 10} ${cx + 7} ${cy - 10} ${cx + 10} ${cy}`} fill="none" stroke={lightenColor(color, 0.3)} strokeLinecap="round" strokeWidth="2.5" opacity="0.46" />
          </g>
        ))}
        <path d="M132 56 C140 49 149 47 158 49 M181 43 C189 40 198 43 204 50 M220 59 C228 64 232 72 233 80" fill="none" stroke={lightenColor(color, 0.28)} strokeLinecap="round" strokeWidth="4" opacity="0.55" />
      </g>
    );
  }

  if (style === 'spikes') {
    return (
      <g>
        <path d="M112 93 L119 47 L139 60 L150 20 L169 51 L185 13 L201 49 L227 23 L227 59 L258 49 L242 104 C218 83 142 80 112 93 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M135 64 C158 46 205 46 231 68 M151 39 L160 55 M186 31 L190 51 M224 42 L217 60" fill="none" stroke={lightenColor(color, 0.25)} strokeLinecap="round" strokeWidth="5" opacity="0.5" />
        <path d="M124 72 C137 60 147 55 158 53 M169 44 L176 60 M201 45 L198 60 M231 57 L223 72" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="2.5" opacity="0.48" />
      </g>
    );
  }

  if (style === 'buns') {
    return (
      <g>
        <path d="M112 92 C126 35 234 35 248 92 C225 70 202 68 180 82 C158 68 135 70 112 92 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M132 62 C154 47 204 47 227 64" fill="none" stroke={lightenColor(color, 0.25)} strokeLinecap="round" strokeWidth="6" opacity="0.48" />
      </g>
    );
  }

  if (style === 'long') {
    return (
      <g>
        <path d="M112 92 C120 30 234 27 249 85 C226 73 210 70 193 78 C179 70 164 69 149 75 C137 78 125 84 112 92 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M197 42 C185 59 179 76 179 96" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.72" />
        <path d="M120 88 C113 119 118 155 130 178 C136 189 138 205 133 222 C147 213 152 195 148 178 C142 154 142 128 143 102 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
        <path d="M240 88 C247 119 242 155 230 178 C224 189 222 205 227 222 C213 213 208 195 212 178 C218 154 218 128 217 102 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
        <path d="M132 58 C151 44 171 41 190 43 M208 46 C220 50 229 58 235 67 M132 106 C128 137 134 166 143 188 M228 106 C232 137 226 166 217 188" fill="none" stroke={lightenColor(color, 0.26)} strokeLinecap="round" strokeWidth="4" opacity="0.5" />
      </g>
    );
  }

  if (style === 'braids' || style === 'ponytail') {
    return (
      <g>
        <path d="M112 92 C120 30 234 27 249 85 C226 73 210 70 193 78 C179 70 164 69 149 75 C137 78 125 84 112 92 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M197 42 C185 59 179 76 179 96" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.72" />
        <path d="M132 58 C151 44 171 41 190 43 M208 46 C220 50 229 58 235 67" fill="none" stroke={lightenColor(color, 0.26)} strokeLinecap="round" strokeWidth="5" opacity="0.5" />
        <path d="M127 72 C141 60 153 55 166 53 M212 54 C221 58 228 64 234 72 M132 105 C129 132 129 159 132 185 M226 101 C230 130 230 162 225 192" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="2.5" opacity="0.46" />
      </g>
    );
  }

  if (style === 'bob') {
    return (
      <g>
        <path d="M110 93 C116 30 239 25 250 91 L242 151 C232 169 213 178 195 179 L201 88 C176 66 140 67 110 93 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
        <path d="M127 58 C152 42 200 40 229 61 M217 82 C227 104 226 132 217 151" fill="none" stroke={lightenColor(color, 0.25)} strokeLinecap="round" strokeWidth="5" opacity="0.5" />
      </g>
    );
  }

  return (
    <g>
      <path d="M110 94 C113 62 127 38 152 28 L149 51 C162 31 177 23 194 22 L188 47 C201 30 216 29 231 35 L222 53 C238 48 248 56 254 70 L238 68 C247 76 250 87 249 98 C228 80 207 75 190 84 C172 66 141 68 110 94 Z" fill="url(#soft-hair)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
      <path d="M127 62 C145 45 165 39 185 41 M202 42 C214 43 224 49 232 57" fill="none" stroke={lightenColor(color, 0.26)} strokeLinecap="round" strokeWidth="5" opacity="0.52" />
      <path d="M122 77 C136 64 148 58 162 55 M207 52 C220 56 230 64 238 75 M147 41 L154 57 M221 42 L215 57" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="2.5" opacity="0.5" />
      <path d="M187 41 C177 57 172 75 174 93" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.58" />
    </g>
  );
}

function getHairStyle(itemKey: string | undefined): 'short' | 'bob' | 'long' | 'ponytail' | 'braids' | 'buns' | 'curls' | 'spikes' {
  const key = itemKey ?? '';
  if (key.includes('bun')) return 'buns';
  if (key.includes('afro') || key.includes('curl')) return 'curls';
  if (key.includes('braid')) return 'braids';
  if (key.includes('ponytail')) return 'ponytail';
  if (key.includes('bob') || key.includes('bowl')) return 'bob';
  if (key.includes('long') || key.includes('wave') || key.includes('silver')) return 'long';
  if (key.includes('spike') || key.includes('mohawk') || key.includes('fire') || key.includes('wild')) return 'spikes';
  return 'short';
}

function SoftHat({ item, hairColor }: { item: SoftAvatarItem | undefined; hairColor: string }) {
  if (!item) return null;
  const color = item.colorPrimary ?? '#d63f61';
  const accent = item.colorSecondary ?? '#f2c94c';
  const key = item.key;

  if (key.includes('cap')) {
    return (
      <g>
        <path d="M121 69 C134 23 226 23 239 69 L231 83 C207 70 153 70 129 83 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
        <path d="M224 72 C251 72 265 84 267 95 C246 90 229 86 211 83 Z" fill={accent} />
        <path d="M151 39 C166 31 195 31 211 39" stroke="#ffffff" strokeLinecap="round" strokeWidth="6" opacity="0.28" />
      </g>
    );
  }

  if (key.includes('crown') && !key.includes('flower')) {
    return (
      <g>
        <path d="M128 61 L139 17 L164 42 L181 8 L199 42 L224 17 L234 63 Z" fill={color} stroke={OUTLINE} strokeLinejoin="round" strokeOpacity="0.3" strokeWidth="3" />
        <path d="M135 56 H228" stroke={accent} strokeLinecap="round" strokeWidth="8" />
        <circle cx="181" cy="41" r="7" fill={accent} />
      </g>
    );
  }

  if (key.includes('wizard') || key.includes('witch') || key.includes('mage')) {
    return (
      <g>
        <path d="M125 74 C146 45 157 5 180 -12 C203 17 215 47 231 74 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
        <ellipse cx="180" cy="75" rx="79" ry="17" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
        <path d="M133 62 H227" stroke={accent} strokeLinecap="round" strokeWidth="10" />
        <path d="M179 13 l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill={accent} />
      </g>
    );
  }

  if (key.includes('helmet') || key.includes('knight')) {
    return (
      <g>
        <path d="M112 97 C112 27 248 27 248 97 L231 125 H207 V72 H153 V125 H129 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.34" strokeWidth="3" />
        <path d="M180 28 V72 M128 88 H232" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.75" />
      </g>
    );
  }

  if (key.includes('beanie')) {
    return (
      <g>
        <path d="M119 77 C123 22 237 22 241 77 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.25" strokeWidth="3" />
        <path d="M116 72 H244 V91 C216 83 144 83 116 91 Z" fill={accent} />
        <circle cx="180" cy="22" r="13" fill={accent} />
      </g>
    );
  }

  if (key.includes('flower')) {
    return (
      <g>
        <path d="M118 78 C149 59 211 59 242 78" fill="none" stroke="#5aaa6b" strokeLinecap="round" strokeWidth="9" />
        {[137, 159, 183, 207, 228].map((cx, index) => (
          <g key={cx}>
            <circle cx={cx} cy={69 + (index % 2) * 5} r="10" fill={index % 2 ? color : accent} />
            <circle cx={cx} cy={69 + (index % 2) * 5} r="3" fill="#fff4b3" />
          </g>
        ))}
      </g>
    );
  }

  if (key.includes('explorer') || key.includes('safari')) {
    return (
      <g>
        <path d="M128 69 C139 28 221 28 232 69 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.26" strokeWidth="3" />
        <ellipse cx="180" cy="76" rx="82" ry="18" fill={color} stroke={OUTLINE} strokeOpacity="0.26" strokeWidth="3" />
        <path d="M130 62 H230" stroke={accent} strokeLinecap="round" strokeWidth="9" />
      </g>
    );
  }

  if (key.includes('headphone')) {
    return (
      <g fill="none" stroke={color} strokeWidth="10">
        <path d="M118 101 C118 33 242 33 242 101" />
        <rect x="107" y="88" width="25" height="47" rx="11" fill={accent} stroke={color} />
        <rect x="228" y="88" width="25" height="47" rx="11" fill={accent} stroke={color} />
      </g>
    );
  }

  if (key.includes('party')) {
    return (
      <g>
        <path d="M149 65 L184 1 L211 69 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.25" strokeWidth="3" />
        <circle cx="184" cy="3" r="9" fill={accent} />
        <path d="M161 45 L199 34 M169 58 L204 49" stroke={accent} strokeWidth="7" />
      </g>
    );
  }

  if (key.includes('cat-ear')) {
    return (
      <g>
        <path d="M119 80 L126 31 L158 66 M201 66 L234 31 L241 81" fill={color} stroke={OUTLINE} strokeLinejoin="round" strokeOpacity="0.28" strokeWidth="4" />
        <path d="M130 46 L146 68 M229 46 L213 68" stroke={accent} strokeLinecap="round" strokeWidth="8" />
      </g>
    );
  }

  if (key.includes('pirate')) {
    return (
      <g>
        <path d="M105 73 C127 30 145 42 180 48 C215 42 233 30 255 73 C234 91 126 91 105 73 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.32" strokeWidth="3" />
        <path d="M118 75 H242" stroke={accent} strokeLinecap="round" strokeWidth="8" />
        <circle cx="180" cy="62" r="8" fill="#ffffff" />
      </g>
    );
  }

  if (key.includes('ninja')) {
    return <path d="M113 97 C113 24 247 24 247 97 L231 139 H211 V82 H149 V139 H129 Z" fill={color} stroke={accent} strokeOpacity="0.6" strokeWidth="4" />;
  }

  if (key.includes('astronaut')) {
    return (
      <g>
        <path
          d="M180 9 A82 91 0 1 1 179.9 9 M180 34 A63 70 0 1 0 180.1 34"
          fill="#f6f7fb"
          fillRule="evenodd"
          stroke={OUTLINE}
          strokeOpacity="0.28"
          strokeWidth="4"
        />
        <ellipse cx="180" cy="105" rx="64" ry="70" fill="#bde9f5" opacity="0.18" stroke={accent} strokeWidth="5" />
        <path d="M127 54 C155 31 206 31 233 56" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="8" opacity="0.7" />
        <path d="M121 145 C143 166 217 166 239 145" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.65" />
      </g>
    );
  }

  if (key.includes('unicorn')) {
    return (
      <g>
        <path d="M180 48 L193 -2 L207 51" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M119 83 C126 22 234 22 241 83 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.24" strokeWidth="3" />
        <path d="M128 66 C151 49 205 47 232 66" fill="none" stroke={lightenColor(hairColor, 0.2)} strokeLinecap="round" strokeWidth="8" opacity="0.4" />
      </g>
    );
  }

  if (key.includes('dragon')) {
    return (
      <g>
        <path d="M112 101 C113 24 247 24 248 101 L230 138 H211 V82 H149 V138 H130 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
        <path d="M136 49 L146 18 L160 51 M200 51 L214 18 L224 49" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeOpacity="0.25" strokeWidth="3" />
      </g>
    );
  }

  return null;
}

function SoftGlasses({ item }: { item: SoftAvatarItem | undefined }) {
  if (!item) return null;
  const color = item.colorPrimary ?? '#233044';
  const accent = item.colorSecondary ?? '#ffffff';
  const key = item.key;

  if (key.includes('heart')) {
    return (
      <g fill="none" stroke={color} strokeLinejoin="round" strokeWidth="5">
        <path d="M149 119 C130 106 121 91 133 82 C143 75 151 81 155 89 C160 81 168 75 178 82 C190 92 174 108 149 119 Z" />
        <path d="M211 119 C230 106 239 91 227 82 C217 75 209 81 205 89 C200 81 192 75 182 82 C170 92 186 108 211 119 Z" />
        <path d="M176 98 H184" />
      </g>
    );
  }

  if (key.includes('star')) {
    return (
      <g fill={accent} fillOpacity="0.15" stroke={color} strokeLinejoin="round" strokeWidth="5">
        <path d="M149 79 l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" />
        <path d="M211 79 l7 14 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" />
        <path d="M164 101 H196" fill="none" />
      </g>
    );
  }

  if (key.includes('square') || key.includes('goggle')) {
    return (
      <g fill={accent} fillOpacity="0.13" stroke={color} strokeWidth={key.includes('goggle') ? 7 : 5}>
        <rect x="124" y="85" width="51" height="38" rx={key.includes('goggle') ? 14 : 8} />
        <rect x="185" y="85" width="51" height="38" rx={key.includes('goggle') ? 14 : 8} />
        <path d="M175 102 H185" fill="none" />
      </g>
    );
  }

  if (key.includes('dark') || key.includes('laser')) {
    return (
      <g>
        <path d="M120 87 C143 81 164 84 180 94 C196 84 217 81 240 87 L233 116 C216 128 198 126 180 109 C162 126 144 128 127 116 Z" fill={color} />
        <path d="M132 94 H164 M196 94 H228" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity={key.includes('laser') ? 0.95 : 0.3} />
      </g>
    );
  }

  return (
    <g fill={accent} fillOpacity="0.12" stroke={color} strokeWidth="5">
      <circle cx="149" cy="102" r="22" />
      <circle cx="211" cy="102" r="22" />
      <path d="M171 102 H189 M127 96 L113 91 M233 96 L247 91" fill="none" strokeLinecap="round" />
    </g>
  );
}

function SoftBackGadget({ item }: { item: SoftAvatarItem | undefined }) {
  if (item?.key !== 'gadget-backpack') return null;
  const color = item.colorPrimary ?? '#d04c73';
  const accent = item.colorSecondary ?? '#7a5ccf';
  return (
    <g>
      <rect x="104" y="196" width="70" height="126" rx="25" fill={darkenColor(color, 0.12)} stroke={OUTLINE} strokeOpacity="0.25" strokeWidth="3" />
      <rect x="112" y="207" width="57" height="101" rx="21" fill={color} />
      <path d="M122 235 H158" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.75" />
      <path d="M128 277 l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill={accent} />
    </g>
  );
}

function SoftFrontGadget({ item }: { item: SoftAvatarItem | undefined }) {
  if (!item || item.key === 'gadget-backpack') return null;
  const color = item.colorPrimary ?? '#607d8b';
  const accent = item.colorSecondary ?? '#f2c94c';
  const key = item.key;

  if (key.includes('camera')) {
    return (
      <g filter="url(#soft-small-shadow)">
        <path d="M155 293 C147 286 139 287 135 295 L131 318 C131 327 143 331 149 323 L160 305 Z" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
        <path d="M226 293 C234 286 242 287 246 295 L250 318 C250 327 238 331 232 323 L221 305 Z" fill="url(#soft-skin)" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
        <g transform="translate(151 276) scale(0.72)">
          <path d="M18 0 H69 L78 11 H96 C104 11 110 17 110 25 V72 C110 80 104 86 96 86 H14 C6 86 0 80 0 72 V25 C0 17 6 11 14 11 H18 Z" fill={color} stroke={OUTLINE} strokeWidth="4" />
          <rect x="8" y="20" width="94" height="12" rx="5" fill={lightenColor(color, 0.18)} opacity="0.45" />
          <circle cx="57" cy="48" r="24" fill={darkenColor(color, 0.38)} stroke={OUTLINE} strokeWidth="3" />
          <circle cx="57" cy="48" r="15" fill={accent} />
          <circle cx="52" cy="43" r="5" fill="#ffffff" opacity="0.78" />
        </g>
        <path d="M142 305 C147 309 151 309 155 306 M239 305 C234 309 230 309 226 306" fill="none" stroke={OUTLINE_SOFT} strokeLinecap="round" strokeWidth="2" />
      </g>
    );
  }

  if (key.includes('book') || key.includes('sketchbook')) {
    return (
      <g transform="translate(235 291) rotate(8)" filter="url(#soft-small-shadow)">
        <rect width="58" height="76" rx="8" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
        <path d="M12 18 H45 M12 31 H39 M12 45 H45" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity="0.75" />
      </g>
    );
  }

  if (key.includes('potion') || key.includes('crystal')) {
    return (
      <g transform="translate(244 298)" filter="url(#soft-small-shadow)">
        {key.includes('crystal') ? (
          <path d="M28 0 L51 27 L41 70 H15 L5 27 Z" fill={color} stroke={accent} strokeWidth="5" />
        ) : (
          <g>
            <rect x="19" width="20" height="15" rx="4" fill={accent} />
            <path d="M15 13 H43 L51 34 V66 C51 75 44 82 35 82 H23 C14 82 7 75 7 66 V34 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
            <path d="M12 51 C25 42 37 57 48 47 V68 C48 74 43 79 36 79 H22 C16 79 11 74 11 68 Z" fill={accent} opacity="0.75" />
          </g>
        )}
      </g>
    );
  }

  if (key.includes('lantern')) {
    return (
      <g transform="translate(242 294)" filter="url(#soft-small-shadow)">
        <path d="M12 18 C12 -5 48 -5 48 18" fill="none" stroke={accent} strokeWidth="6" />
        <rect x="5" y="18" width="50" height="63" rx="12" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
        <rect x="14" y="29" width="32" height="40" rx="9" fill="#fff1a8" opacity="0.9" />
      </g>
    );
  }

  if (key.includes('telescope')) {
    return (
      <g transform="translate(236 278) rotate(-18)" filter="url(#soft-small-shadow)">
        <rect width="92" height="28" rx="12" fill={color} />
        <rect x="67" y="-4" width="23" height="36" rx="9" fill={accent} />
        <path d="M34 25 L20 84 M58 25 L72 84" stroke={accent} strokeLinecap="round" strokeWidth="6" />
      </g>
    );
  }

  if (key.includes('robot')) {
    return (
      <g transform="translate(256 365)" filter="url(#soft-small-shadow)">
        <rect y="13" width="66" height="67" rx="17" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
        <rect x="21" width="24" height="18" rx="8" fill={accent} />
        <circle cx="21" cy="43" r="6" fill={accent} />
        <circle cx="45" cy="43" r="6" fill={accent} />
        <path d="M21 60 H45" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (key.includes('drone')) {
    return (
      <g transform="translate(260 115)" filter="url(#soft-small-shadow)">
        <rect y="16" width="62" height="30" rx="14" fill={color} />
        <circle cx="-8" cy="14" r="18" fill="none" stroke={accent} strokeWidth="5" />
        <circle cx="70" cy="14" r="18" fill="none" stroke={accent} strokeWidth="5" />
        <circle cx="31" cy="31" r="6" fill={accent} />
      </g>
    );
  }

  return null;
}

function SoftWeapon({ item }: { item: SoftAvatarItem | undefined }) {
  if (!item) return null;
  const color = item.colorPrimary ?? '#8b5a2b';
  const accent = item.colorSecondary ?? '#f2c94c';
  const key = item.key;

  if (key.includes('shield')) {
    return (
      <g transform="translate(246 252)" filter="url(#soft-small-shadow)">
        <path d="M0 0 C25 -10 55 -10 80 0 V54 C80 84 57 104 40 112 C23 104 0 84 0 54 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.35" strokeWidth="4" />
        <path d="M40 19 l8 16 18 3-13 12 3 18-16-8-16 8 3-18-13-12 18-3z" fill={accent} />
      </g>
    );
  }

  if (key.includes('sword')) {
    return (
      <g transform="translate(250 216) rotate(8)" filter="url(#soft-small-shadow)">
        <path d="M22 0 L40 18 L25 143 H19 L4 18 Z" fill="#b9c7d8" stroke={OUTLINE} strokeOpacity="0.35" strokeWidth="3" />
        <path d="M22 11 V125" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.7" />
        <rect x="-4" y="132" width="52" height="12" rx="6" fill={accent} />
        <rect x="15" y="139" width="14" height="48" rx="7" fill={color} />
      </g>
    );
  }

  if (key.includes('bow')) {
    return (
      <g transform="translate(261 226)" filter="url(#soft-small-shadow)">
        <path d="M22 0 C82 53 82 133 22 184" fill="none" stroke={color} strokeLinecap="round" strokeWidth="10" />
        <path d="M22 0 L22 184" stroke={accent} strokeWidth="3" />
        <path d="M22 92 H79" stroke={accent} strokeLinecap="round" strokeWidth="5" />
      </g>
    );
  }

  if (key.includes('rocket')) {
    return (
      <g transform="translate(266 229)" filter="url(#soft-small-shadow)">
        <path d="M28 0 C58 30 58 101 28 129 C-2 101 -2 30 28 0 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
        <circle cx="28" cy="54" r="13" fill={accent} />
        <path d="M7 99 L-5 129 L21 117 M49 99 L61 129 L35 117" fill={accent} />
        <path d="M20 128 L28 160 L36 128" fill="#f0874f" />
      </g>
    );
  }

  if (key.includes('wand')) {
    return (
      <g filter="url(#soft-small-shadow)">
        <path d="M273 426 L242 281" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="12" />
        <path d="M273 426 L242 281" fill="none" stroke={color} strokeLinecap="round" strokeWidth="7" />
        <path d="M242 245 L251 266 L274 269 L257 284 L262 308 L242 296 L222 308 L227 284 L210 269 L233 266 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3.5" />
        <circle cx="237" cy="258" r="4" fill="#ffffff" opacity="0.78" />
      </g>
    );
  }

  return (
    <g filter="url(#soft-small-shadow)">
      <path d="M94 444 C101 402 105 367 116 329 C122 306 126 284 128 259" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="13" />
      <path d="M94 444 C101 402 105 367 116 329 C122 306 126 284 128 259" fill="none" stroke={color} strokeLinecap="round" strokeWidth="8" />
      <path d="M107 369 C116 365 122 358 126 348 M116 326 C108 320 105 313 106 305 M124 293 C133 288 137 280 138 271" fill="none" stroke={darkenColor(color, 0.28)} strokeLinecap="round" strokeWidth="4" />
      <path d="M129 229 C109 251 112 271 128 280 C145 270 147 250 129 229 Z" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3.5" />
      <path d="M129 237 L129 269" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.58" />
    </g>
  );
}

function SoftPet({ item }: { item: SoftAvatarItem | undefined }) {
  if (!item) return null;
  const color = item.colorPrimary ?? '#f2a65a';
  const accent = item.colorSecondary ?? '#4a321f';
  const key = item.key;

  if (key.includes('elephant')) {
    return (
      <g transform="translate(251 366)" filter="url(#soft-small-shadow)">
        <ellipse cx="45" cy="49" rx="42" ry="34" fill={color} stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
        <circle cx="20" cy="30" r="27" fill={color} />
        <ellipse cx="3" cy="31" rx="20" ry="25" fill={darkenColor(color, 0.08)} />
        <path d="M6 42 C-5 71 3 89 17 75" fill="none" stroke={color} strokeLinecap="round" strokeWidth="15" />
        <circle cx="26" cy="25" r="4" fill={accent} />
        <path d="M24 69 V91 M63 70 V91" stroke={accent} strokeLinecap="round" strokeWidth="10" />
      </g>
    );
  }

  if (key.includes('robot')) {
    return (
      <g transform="translate(260 372)" filter="url(#soft-small-shadow)">
        <rect x="7" y="18" width="62" height="61" rx="18" fill={color} stroke={OUTLINE} strokeOpacity="0.3" strokeWidth="3" />
        <rect x="20" width="36" height="29" rx="12" fill={color} />
        <circle cx="31" cy="14" r="5" fill={accent} />
        <circle cx="46" cy="14" r="5" fill={accent} />
        <path d="M26 46 H51" stroke={accent} strokeLinecap="round" strokeWidth="6" />
        <path d="M22 77 V94 M55 77 V94" stroke={accent} strokeLinecap="round" strokeWidth="9" />
      </g>
    );
  }

  if (key.includes('dragon')) {
    return (
      <g transform="translate(250 360)" filter="url(#soft-small-shadow)">
        <ellipse cx="43" cy="60" rx="38" ry="33" fill={color} stroke={OUTLINE} strokeWidth="3" />
        <ellipse cx="43" cy="65" rx="18" ry="24" fill={lightenColor(color, 0.28)} opacity="0.82" />
        <circle cx="40" cy="26" r="28" fill={color} stroke={OUTLINE} strokeOpacity="0.25" strokeWidth="3" />
        <path d="M18 17 L14 -4 L32 10 M55 10 L68 -4 L65 19" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="2.5" />
        <path d="M9 48 C-16 30 -24 56 4 69 M74 47 C102 28 110 61 79 73" fill={accent} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="3" />
        <path d="M0 54 L-14 48 L-7 65 M82 53 L96 46 L91 64" fill={lightenColor(accent, 0.25)} opacity="0.75" />
        <circle cx="31" cy="24" r="5" fill="#ffffff" />
        <circle cx="50" cy="24" r="5" fill="#ffffff" />
        <circle cx="32" cy="25" r="2.5" fill={OUTLINE} />
        <circle cx="51" cy="25" r="2.5" fill={OUTLINE} />
        <path d="M29 39 C36 45 46 45 53 39" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="4" />
        <path d="M36 41 L39 47 L42 41" fill="#ffffff" />
        <path d="M33 59 H53 M35 69 H51 M37 79 H49" fill="none" stroke={darkenColor(color, 0.14)} strokeLinecap="round" strokeWidth="2.5" opacity="0.6" />
        <path d="M24 82 V99 M60 82 V99" stroke={accent} strokeLinecap="round" strokeWidth="9" />
        <ellipse cx="21" cy="99" rx="11" ry="5" fill={accent} stroke={OUTLINE} strokeWidth="2" />
        <ellipse cx="63" cy="99" rx="11" ry="5" fill={accent} stroke={OUTLINE} strokeWidth="2" />
      </g>
    );
  }

  if (key.includes('unicorn')) {
    return (
      <g transform="translate(252 363)" filter="url(#soft-small-shadow)">
        <ellipse cx="45" cy="61" rx="40" ry="31" fill={color} stroke={OUTLINE} strokeOpacity="0.2" strokeWidth="3" />
        <circle cx="39" cy="29" r="27" fill={color} />
        <path d="M40 7 L52 -16 L56 10" fill={accent} />
        <path d="M18 22 C22 0 58 -4 68 19 C53 14 36 17 18 22 Z" fill={accent} />
        <circle cx="31" cy="28" r="4" fill={OUTLINE} />
        <path d="M27 82 V101 M62 82 V101" stroke={accent} strokeLinecap="round" strokeWidth="9" />
      </g>
    );
  }

  const catLike = key.includes('cat') || key.includes('fox') || key.includes('tiger') || key.includes('lion');
  const bunny = key.includes('bunny');
  const panda = key.includes('panda');
  return (
    <g transform="translate(251 366)" filter="url(#soft-small-shadow)">
      <ellipse cx="45" cy="62" rx="39" ry="30" fill={color} stroke={OUTLINE} strokeWidth="3" />
      <path d="M32 49 C38 45 51 45 58 50 C63 63 60 77 52 87 C43 91 34 87 29 78 C26 68 27 57 32 49 Z" fill={lightenColor(color, 0.34)} opacity="0.9" />
      {key.includes('lion') ? <circle cx="39" cy="28" r="34" fill={accent} opacity="0.9" /> : null}
      <circle cx="39" cy="29" r="27" fill={panda ? '#f4f1ea' : color} stroke={OUTLINE} strokeWidth="3" />
      {catLike ? (
        <g fill={color} stroke={OUTLINE} strokeWidth="2.5">
          <path d="M17 22 L17 0 L32 12 Z" />
          <path d="M55 12 L69 0 L66 24 Z" />
          <path d="M20 16 L21 7 L28 13 Z M58 13 L66 6 L63 18 Z" fill={lightenColor(color, 0.36)} stroke="none" />
        </g>
      ) : null}
      {bunny ? (
        <g fill={color}>
          <ellipse cx="25" cy="-1" rx="10" ry="28" transform="rotate(-12 25 -1)" />
          <ellipse cx="54" cy="-1" rx="10" ry="28" transform="rotate(12 54 -1)" />
        </g>
      ) : null}
      {panda ? (
        <g fill={accent}>
          <circle cx="21" cy="9" r="10" />
          <circle cx="58" cy="9" r="10" />
          <ellipse cx="30" cy="27" rx="8" ry="10" />
          <ellipse cx="49" cy="27" rx="8" ry="10" />
        </g>
      ) : null}
      <circle cx="31" cy="28" r="4.5" fill={panda ? '#ffffff' : OUTLINE} />
      <circle cx="49" cy="28" r="4.5" fill={panda ? '#ffffff' : OUTLINE} />
      <circle cx="29.5" cy="26.5" r="1.4" fill="#ffffff" />
      <circle cx="47.5" cy="26.5" r="1.4" fill="#ffffff" />
      <circle cx="40" cy="39" r="4" fill={accent} />
      <path d="M31 47 C36 53 44 53 49 47" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="3" />
      <path d="M27 40 L9 36 M27 44 L7 46 M53 40 L72 36 M53 44 L74 46" fill="none" stroke={OUTLINE_SOFT} strokeLinecap="round" strokeWidth="1.8" opacity="0.72" />
      {key.includes('tiger') ? (
        <g stroke={accent} strokeLinecap="round" strokeWidth="5">
          <path d="M27 5 L31 16 M40 2 V15 M54 5 L50 16" />
          <path d="M16 54 L28 58 M64 54 L52 58" />
        </g>
      ) : null}
      <path d="M22 80 V96 M60 80 V96" stroke={OUTLINE} strokeLinecap="round" strokeWidth="13" />
      <path d="M22 80 V96 M60 80 V96" stroke={color} strokeLinecap="round" strokeWidth="9" />
      <ellipse cx="19" cy="98" rx="11" ry="5" fill={color} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="63" cy="98" rx="11" ry="5" fill={color} stroke={OUTLINE} strokeWidth="2" />
      <path d="M76 60 C103 48 99 25 84 33" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="15" />
      <path d="M76 60 C103 48 99 25 84 33" fill="none" stroke={color} strokeLinecap="round" strokeWidth="10" />
    </g>
  );
}

function lightenColor(color: string, amount: number) {
  const [red, green, blue] = toRgb(color);
  return toHex(
    Math.round(red + (255 - red) * amount),
    Math.round(green + (255 - green) * amount),
    Math.round(blue + (255 - blue) * amount)
  );
}

function colorizeMatrix(color: string) {
  const [red, green, blue] = toRgb(color).map((channel) => Math.min(1.35, channel / 190 + 0.18));

  return [
    0.2126 * red, 0.7152 * red, 0.0722 * red, 0, 0,
    0.2126 * green, 0.7152 * green, 0.0722 * green, 0, 0,
    0.2126 * blue, 0.7152 * blue, 0.0722 * blue, 0, 0,
    0, 0, 0, 1, 0
  ].join(' ');
}

function darkenColor(color: string, amount: number) {
  const [red, green, blue] = toRgb(color);
  return toHex(Math.round(red * (1 - amount)), Math.round(green * (1 - amount)), Math.round(blue * (1 - amount)));
}

function toRgb(color: string): [number, number, number] {
  const hex = color.startsWith('#') ? color.slice(1) : color;
  const normalized = hex.length === 3 ? hex.split('').map((value) => `${value}${value}`).join('') : hex.padEnd(6, '0').slice(0, 6);
  return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16)) as [number, number, number];
}

function toHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((channel) => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0')).join('')}`;
}
