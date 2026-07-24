import type { CSSProperties } from 'react';

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

const OUTLINE = '#3f342f';

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
  const topAccent = top?.colorSecondary ?? '#1d4f9f';
  const bottomColor = bottom?.colorPrimary ?? '#355f9f';
  const bottomAccent = bottom?.colorSecondary ?? '#233f6c';
  const shoeColor = shoes?.colorPrimary ?? '#d63f61';
  const shoeAccent = shoes?.colorSecondary ?? '#8f263d';
  const hairAccent = darkenColor(hairColor, 0.24);

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
          <stop offset="0%" stopColor={lightenColor(skin, 0.15)} />
          <stop offset="72%" stopColor={skin} />
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
        <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#263447" floodOpacity="0.2" />
        </filter>
        <filter id="soft-small-shadow" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#263447" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect width="360" height="520" fill="url(#soft-bg)" />
      <SoftBackground item={background} />
      <ellipse cx="180" cy="460" rx="100" ry="18" fill="#253044" opacity="0.14" />

      <g filter="url(#soft-shadow)">
        <SoftHairBack itemKey={hair?.key} color={hairColor} accent={hairAccent} />
        <SoftBackGadget item={gadget} />
        <SoftWeapon item={weapon} />
        <SoftBody
          bottom={bottom}
          bottomAccent={bottomAccent}
          bottomColor={bottomColor}
          shoeAccent={shoeAccent}
          shoes={shoes}
          skin={skin}
          top={top}
          topAccent={topAccent}
          topColor={topColor}
        />
        <SoftHead skin={skin} skinShadow={skinShadow} />
        <SoftFace eyes={eyes} eyesColor={eyesColor} mouth={mouth} skin={skin} />
        <SoftHairFront itemKey={hair?.key} color={hairColor} accent={hairAccent} />
        <SoftHat item={hat} hairColor={hairColor} />
        <SoftGlasses item={glasses} />
        <SoftFrontGadget item={gadget} />
      </g>
      <SoftPet item={pet} />
    </svg>
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
      <path d="M0 350 C70 298 126 340 180 303 C235 267 292 307 360 252 V520 H0 Z" fill={accent} opacity="0.5" />
      <path d="M0 403 C66 375 117 407 173 381 C237 351 298 384 360 349 V520 H0 Z" fill={darkenColor(accent, 0.12)} opacity="0.36" />
      <g fill="#ffffff" opacity="0.34">
        <circle cx="46" cy="342" r="34" />
        <circle cx="310" cy="328" r="43" />
        <circle cx="333" cy="295" r="22" />
      </g>
      <g fill="#f7d755">
        <circle cx="48" cy="404" r="5" />
        <circle cx="315" cy="391" r="4" />
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
      <path d="M157 165 H203 L205 207 H155 Z" fill="url(#soft-skin)" stroke={OUTLINE} strokeOpacity="0.18" strokeWidth="2" />

      {isDress || isSkirt || isShorts ? (
        <g>
          <path d="M139 333 L136 421" stroke="url(#soft-skin)" strokeLinecap="round" strokeWidth="25" />
          <path d="M221 333 L224 421" stroke="url(#soft-skin)" strokeLinecap="round" strokeWidth="25" />
        </g>
      ) : (
        <SoftPants item={bottom} color={bottomColor} accent={bottomAccent} />
      )}

      {isSkirt && !isDress ? <SoftSkirt item={bottom} color={bottomColor} accent={bottomAccent} /> : null}
      {isShorts && !isDress ? <SoftShorts item={bottom} color={bottomColor} accent={bottomAccent} /> : null}

      <SoftBackCape item={top} />
      <path
        d="M124 203 C143 184 217 184 236 203 C224 237 221 277 226 319 C210 332 150 332 134 319 C139 276 136 237 124 203 Z"
        fill="url(#soft-top)"
        stroke={OUTLINE}
        strokeOpacity="0.28"
        strokeWidth="3"
      />
      <path d="M139 203 C147 217 213 217 221 203" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.28" />
      <SoftSleeves skin={skin} top={top} topColor={topColor} />
      <SoftTopDetails item={top} color={topColor} accent={topAccent} />
      {isDress ? <SoftDress item={top} color={topColor} accent={topAccent} /> : null}

      <SoftShoes item={shoes} accent={shoeAccent} />
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
      <path d="M133 213 C109 239 108 293 124 326" fill="none" stroke={longSleeve ? topColor : 'url(#soft-skin)'} strokeLinecap="round" strokeWidth="25" />
      <path d="M227 213 C251 239 252 293 236 326" fill="none" stroke={longSleeve ? topColor : 'url(#soft-skin)'} strokeLinecap="round" strokeWidth="25" />
      {longSleeve ? (
        <g>
          <circle cx="124" cy="329" r="13" fill="url(#soft-skin)" />
          <circle cx="236" cy="329" r="13" fill="url(#soft-skin)" />
          <path d="M124 307 L127 316 M236 307 L233 316" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.25" />
        </g>
      ) : (
        <g>
          <circle cx="124" cy="329" r="13" fill="url(#soft-skin)" />
          <circle cx="236" cy="329" r="13" fill="url(#soft-skin)" />
          <path d="M119 213 C126 204 135 202 143 209 L139 239 C130 232 122 228 114 229 Z" fill={topColor} />
          <path d="M241 213 C234 204 225 202 217 209 L221 239 C230 232 238 228 246 229 Z" fill={topColor} />
          <path d="M118 228 C126 225 134 229 140 236 M242 228 C234 225 226 229 220 236" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" opacity="0.25" />
        </g>
      )}
    </g>
  );
}

function SoftPants({ item, color, accent }: { item: SoftAvatarItem | undefined; color: string; accent: string }) {
  return (
    <g>
      <path
        d="M132 309 C151 321 209 321 228 309 L218 424 H187 L180 334 L173 424 H142 Z"
        fill="url(#soft-bottom)"
        stroke={OUTLINE}
        strokeOpacity="0.26"
        strokeWidth="3"
      />
      <path d="M180 334 V420" stroke={darkenColor(color, 0.2)} strokeLinecap="round" strokeWidth="4" opacity="0.4" />
      {item?.key.includes('cargo') ? (
        <g fill={accent}>
          <rect x="139" y="353" width="27" height="22" rx="6" />
          <rect x="194" y="353" width="27" height="22" rx="6" />
          <path d="M143 358 H162 M198 358 H217" stroke="#ffffff" strokeWidth="3" opacity="0.32" />
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
        strokeOpacity="0.24"
        strokeWidth="3"
      />
      <path d="M138 316 H222" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.7" />
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
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path d="M134 303 C158 316 202 316 226 303" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.72" />
      <path d="M125 365 C154 378 206 378 235 365" fill="none" stroke={lightenColor(accent, 0.12)} strokeLinecap="round" strokeWidth="6" opacity="0.6" />
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
        <path d="M145 194 C151 177 209 177 215 194 L207 218 C194 210 166 210 153 218 Z" fill={darkenColor(color, 0.08)} />
        <path d="M160 207 L156 247 M200 207 L204 247" stroke="#f7f2e9" strokeLinecap="round" strokeWidth="4" />
        <path d="M151 285 H209" stroke={accent} strokeLinecap="round" strokeWidth="8" opacity="0.7" />
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
      <path d="M148 198 L180 224 L212 198" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.78" />
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
          <path d="M116 385 H164 V445 C153 457 119 457 105 446 L116 426 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
          <path d="M196 385 H244 L255 446 C241 457 207 457 196 445 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
          <path d="M119 406 H158 M202 406 H241" stroke={accent} strokeLinecap="round" strokeWidth="6" opacity="0.7" />
        </g>
      ) : (
        <g>
          <path d="M111 418 C128 407 153 408 165 423 L164 448 C145 458 112 456 99 445 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
          <path d="M249 418 C232 407 207 408 195 423 L196 448 C215 458 248 456 261 445 Z" fill="url(#soft-shoes)" stroke={OUTLINE} strokeOpacity="0.28" strokeWidth="3" />
          <path d="M115 430 H153 M207 430 H245" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.75" />
          <path d="M105 446 H162 M198 446 H255" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.78" />
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
      <ellipse cx="117" cy="116" rx="15" ry="23" fill={skinShadow} opacity="0.9" />
      <ellipse cx="243" cy="116" rx="15" ry="23" fill={skinShadow} opacity="0.9" />
      <path
        d="M180 33 C140 33 117 62 117 106 C117 149 141 176 180 181 C219 176 243 149 243 106 C243 62 220 33 180 33 Z"
        fill="url(#soft-skin)"
        stroke={OUTLINE}
        strokeOpacity="0.28"
        strokeWidth="3"
      />
      <path d="M137 140 C150 165 210 165 223 140 C210 174 150 174 137 140 Z" fill={skinShadow} opacity="0.18" />
      <ellipse cx="143" cy="132" rx="16" ry="7" fill="#e77878" opacity="0.13" />
      <ellipse cx="217" cy="132" rx="16" ry="7" fill="#e77878" opacity="0.13" />
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
      <path d="M180 106 C174 115 174 123 182 126" fill="none" stroke={darkenColor(skin, 0.22)} strokeLinecap="round" strokeWidth="3" opacity="0.55" />
      <SoftMouth item={mouth} />
      <g fill="#ffffff" opacity="0.76">
        <circle cx="125" cy="83" r="2.5" />
        <circle cx="235" cy="86" r="2" />
      </g>
    </g>
  );
}

function SoftEyes({ itemKey, color }: { itemKey: string; color: string }) {
  if (itemKey.includes('smile') || itemKey.includes('happy-arc')) {
    return (
      <g fill="none" stroke={darkenColor(color, 0.25)} strokeLinecap="round" strokeWidth="5">
        <path d="M137 103 C144 95 154 95 161 103" />
        <path d="M199 103 C206 95 216 95 223 103" />
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
      <g fill="none" stroke={darkenColor(color, 0.25)} strokeLinecap="round" strokeWidth="5">
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
      <ellipse cx={cx} cy="103" rx={round ? 14 : 13} ry={round ? 16 : 13} fill="#ffffff" />
      <circle cx={cx} cy="104" r={round ? 8 : 7} fill={color} />
      <circle cx={cx} cy="104" r="3.5" fill={darkenColor(color, 0.55)} />
      <circle cx={cx - 2.5} cy="100" r="2.5" fill="#ffffff" />
    </g>
  );
}

function SoftEyebrows({ itemKey, color }: { itemKey: string; color: string }) {
  const determined = itemKey.includes('focus') || itemKey.includes('determined') || itemKey.includes('night');
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="5">
      <path d={determined ? 'M134 81 L162 88' : 'M135 85 C145 79 154 79 163 85'} />
      <path d={determined ? 'M226 81 L198 88' : 'M197 85 C206 79 215 79 225 85'} />
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
        <path d="M157 139 C168 153 192 153 203 139 C202 164 158 164 157 139 Z" fill={color} />
        <path d="M164 145 C173 149 187 149 196 145" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.88" />
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

  return <path d="M160 141 C171 157 190 157 201 141" fill="none" stroke={color} strokeLinecap="round" strokeWidth={key.includes('small') || key.includes('soft') ? 4 : 5} />;
}

function SoftHairBack({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  const style = getHairStyle(itemKey);

  if (style === 'buns') {
    return (
      <g>
        <circle cx="126" cy="49" r="30" fill={accent} />
        <circle cx="234" cy="49" r="30" fill={accent} />
        <circle cx="126" cy="47" r="25" fill={color} />
        <circle cx="234" cy="47" r="25" fill={color} />
        <path d="M112 103 C115 26 245 26 248 103 L232 161 C217 177 143 177 128 161 Z" fill={accent} />
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
        {curls.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index < 6 ? 24 : 22} fill={index % 2 ? color : accent} />)}
        <path d="M117 107 C121 41 239 40 245 107 L231 173 C209 194 151 194 129 173 Z" fill={color} />
      </g>
    );
  }

  if (style === 'braids') {
    return (
      <g>
        <path d="M112 103 C115 35 245 35 248 103 L235 151 C216 169 144 169 125 151 Z" fill={accent} />
        {[168, 188, 208, 228].map((cy) => (
          <g key={cy}>
            <ellipse cx="116" cy={cy} rx="15" ry="18" fill={color} />
            <ellipse cx="244" cy={cy} rx="15" ry="18" fill={color} />
          </g>
        ))}
      </g>
    );
  }

  if (style === 'ponytail') {
    return (
      <g>
        <path d="M111 104 C114 35 244 35 248 104 L232 166 C213 187 147 187 128 166 Z" fill={accent} />
        <path d="M233 74 C284 82 284 164 247 191 C263 151 250 117 224 104 Z" fill={color} />
      </g>
    );
  }

  if (style === 'long') {
    return (
      <g>
        <path d="M108 103 C112 30 247 29 251 104 L242 210 C218 230 142 230 118 210 Z" fill={accent} />
        <path d="M118 103 C122 43 238 42 242 104 L232 202 C212 217 148 217 128 202 Z" fill={color} />
        <path d="M137 57 C158 43 202 43 224 61" fill="none" stroke={lightenColor(color, 0.2)} strokeLinecap="round" strokeWidth="8" opacity="0.45" />
      </g>
    );
  }

  return <path d="M112 105 C114 32 246 32 248 105 L234 158 C214 177 146 177 126 158 Z" fill={accent} />;
}

function SoftHairFront({ itemKey, color, accent }: { itemKey: string | undefined; color: string; accent: string }) {
  const style = getHairStyle(itemKey);

  if (style === 'curls') {
    const curls = [[126, 63], [148, 48], [174, 44], [199, 47], [222, 62], [238, 84], [116, 91]];
    return <g>{curls.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="20" fill={color} />)}</g>;
  }

  if (style === 'spikes') {
    return (
      <g>
        <path d="M115 91 L121 49 L139 61 L151 24 L169 53 L185 17 L199 51 L225 27 L226 61 L254 53 L241 102 C218 84 143 81 115 91 Z" fill={color} />
        <path d="M134 66 C159 47 208 48 231 69" fill="none" stroke={lightenColor(color, 0.18)} strokeLinecap="round" strokeWidth="7" opacity="0.42" />
      </g>
    );
  }

  if (style === 'buns') {
    return (
      <g>
        <path d="M113 91 C126 39 234 39 247 91 C224 72 201 70 180 82 C159 70 136 72 113 91 Z" fill={color} />
        <path d="M132 65 C154 50 204 50 226 66" fill="none" stroke={lightenColor(color, 0.18)} strokeLinecap="round" strokeWidth="7" opacity="0.4" />
      </g>
    );
  }

  if (style === 'braids' || style === 'ponytail' || style === 'long') {
    return (
      <g>
        <path d="M113 91 C121 34 233 31 248 84 C225 75 211 73 193 79 C176 69 149 67 113 91 Z" fill={color} />
        <path d="M196 46 C183 63 177 78 178 96" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="8" opacity="0.7" />
        <path d="M132 61 C151 48 171 45 190 47" fill="none" stroke={lightenColor(color, 0.2)} strokeLinecap="round" strokeWidth="7" opacity="0.42" />
      </g>
    );
  }

  if (style === 'bob') {
    return (
      <g>
        <path d="M111 92 C117 35 238 30 249 90 L241 151 C227 168 207 176 193 176 L199 87 C174 69 141 69 114 94 Z" fill={color} />
        <path d="M128 61 C151 46 199 44 226 63" fill="none" stroke={lightenColor(color, 0.2)} strokeLinecap="round" strokeWidth="7" opacity="0.45" />
      </g>
    );
  }

  return (
    <g>
      <path d="M112 92 C117 35 233 30 249 85 C225 74 204 75 189 83 C170 67 142 68 112 92 Z" fill={color} />
      <path d="M132 61 C154 47 198 45 226 64" fill="none" stroke={lightenColor(color, 0.2)} strokeLinecap="round" strokeWidth="7" opacity="0.42" />
      <path d="M185 44 C174 59 170 74 173 91" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity="0.55" />
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
      <g transform="translate(151 276) scale(0.72)" filter="url(#soft-small-shadow)">
        <path d="M18 0 H69 L78 11 H96 C104 11 110 17 110 25 V72 C110 80 104 86 96 86 H14 C6 86 0 80 0 72 V25 C0 17 6 11 14 11 H18 Z" fill={color} stroke={OUTLINE} strokeOpacity="0.32" strokeWidth="3" />
        <circle cx="57" cy="48" r="24" fill={darkenColor(color, 0.38)} />
        <circle cx="57" cy="48" r="15" fill={accent} />
        <circle cx="52" cy="43" r="5" fill="#ffffff" opacity="0.72" />
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

  return (
    <g transform="translate(270 213) rotate(5)" filter="url(#soft-small-shadow)">
      <rect x="18" y="47" width="12" height="153" rx="6" fill={color} />
      {key.includes('wand') ? (
        <path d="M24 0 L33 21 L56 24 L39 39 L44 63 L24 51 L4 63 L9 39 L-8 24 L15 21 Z" fill={accent} />
      ) : (
        <path d="M24 2 C5 26 8 44 24 54 C40 44 43 26 24 2 Z" fill={accent} />
      )}
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
        <ellipse cx="43" cy="60" rx="38" ry="33" fill={color} />
        <circle cx="40" cy="26" r="28" fill={color} stroke={OUTLINE} strokeOpacity="0.25" strokeWidth="3" />
        <path d="M18 17 L14 -4 L32 10 M55 10 L68 -4 L65 19" fill={accent} />
        <path d="M9 48 C-16 30 -24 56 4 69 M74 47 C102 28 110 61 79 73" fill={accent} opacity="0.85" />
        <circle cx="31" cy="24" r="5" fill="#ffffff" />
        <circle cx="50" cy="24" r="5" fill="#ffffff" />
        <circle cx="32" cy="25" r="2.5" fill={OUTLINE} />
        <circle cx="51" cy="25" r="2.5" fill={OUTLINE} />
        <path d="M29 39 C36 45 46 45 53 39" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="4" />
        <path d="M24 82 V99 M60 82 V99" stroke={accent} strokeLinecap="round" strokeWidth="9" />
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
      <ellipse cx="45" cy="62" rx="39" ry="30" fill={color} stroke={OUTLINE} strokeOpacity="0.22" strokeWidth="3" />
      {key.includes('lion') ? <circle cx="39" cy="28" r="34" fill={accent} opacity="0.9" /> : null}
      <circle cx="39" cy="29" r="27" fill={panda ? '#f4f1ea' : color} />
      {catLike ? (
        <g fill={color} stroke={OUTLINE} strokeOpacity="0.18" strokeWidth="2">
          <path d="M17 22 L17 0 L32 12 Z" />
          <path d="M55 12 L69 0 L66 24 Z" />
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
      <circle cx="40" cy="39" r="4" fill={accent} />
      <path d="M31 47 C36 53 44 53 49 47" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="3" />
      {key.includes('tiger') ? (
        <g stroke={accent} strokeLinecap="round" strokeWidth="5">
          <path d="M27 5 L31 16 M40 2 V15 M54 5 L50 16" />
          <path d="M16 54 L28 58 M64 54 L52 58" />
        </g>
      ) : null}
      <path d="M22 81 V99 M60 81 V99" stroke={accent} strokeLinecap="round" strokeWidth="9" />
      <path d="M76 60 C103 48 99 25 84 33" fill="none" stroke={color} strokeLinecap="round" strokeWidth="11" />
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
