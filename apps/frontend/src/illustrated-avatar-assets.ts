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
