ALTER TABLE "AvatarItem"
ADD COLUMN "audienceGender" TEXT;

CREATE INDEX "AvatarItem_slot_audienceGender_idx"
ON "AvatarItem"("slot", "audienceGender");

UPDATE "AvatarItem"
SET "isActive" = false,
    "audienceGender" = NULL,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slot" = 'character';

UPDATE "AvatarItem"
SET "audienceGender" = 'BOY',
    "requiredLevel" = 1,
    "rarity" = 'COMMON',
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" IN (
    'character-smiley',
    'character-smiley-pink',
    'character-smiley-blue',
    'character-smiley-brown',
    'character-smiley-blonde',
    'character-smiley-black'
);

UPDATE "AvatarItem"
SET "audienceGender" = 'GIRL',
    "requiredLevel" = 1,
    "rarity" = 'COMMON',
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" IN (
    'character-star',
    'character-star-red',
    'character-star-blue',
    'character-star-brown',
    'character-star-blonde',
    'character-star-black'
);

UPDATE "AvatarItem"
SET "audienceGender" = 'GIRL',
    "requiredLevel" = 3,
    "rarity" = 'UNCOMMON',
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" IN (
    'character-explorer',
    'character-explorer-red',
    'character-explorer-pink',
    'character-explorer-blue',
    'character-explorer-brown',
    'character-explorer-black'
);

INSERT INTO "AvatarItem" (
    "key",
    "slot",
    "name",
    "description",
    "requiredLevel",
    "rarity",
    "layerOrder",
    "colorPrimary",
    "colorSecondary",
    "audienceGender",
    "isActive",
    "updatedAt"
) VALUES
('character-boy-side', 'character', 'Wirbelfrisur', 'Kurzer, seitlich gekämmter Abenteuerlook.', 3, 'UNCOMMON', 10, '#b64b32', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-boy-side-pink', 'character', 'Wirbelfrisur mit rosa Haaren', 'Kurzer Abenteuerlook mit rosa Haaren.', 3, 'UNCOMMON', 10, '#d8589d', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-boy-side-blue', 'character', 'Wirbelfrisur mit blauen Haaren', 'Kurzer Abenteuerlook mit blauen Haaren.', 3, 'UNCOMMON', 10, '#2877bd', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-boy-side-brown', 'character', 'Wirbelfrisur mit braunen Haaren', 'Kurzer Abenteuerlook mit braunen Haaren.', 3, 'UNCOMMON', 10, '#68422d', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-boy-side-blonde', 'character', 'Wirbelfrisur mit blonden Haaren', 'Kurzer Abenteuerlook mit blonden Haaren.', 3, 'UNCOMMON', 10, '#e7bd59', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-boy-side-black', 'character', 'Wirbelfrisur mit schwarzen Haaren', 'Kurzer Abenteuerlook mit schwarzen Haaren.', 3, 'UNCOMMON', 10, '#202531', '#1f5eb8', 'BOY', true, CURRENT_TIMESTAMP),
('character-wizard-red', 'character', 'Zauberlehrling mit roten Haaren', 'Magischer Look mit roten Haaren.', 6, 'RARE', 10, '#b64b32', '#087578', 'GIRL', true, CURRENT_TIMESTAMP),
('character-wizard-pink', 'character', 'Zauberlehrling mit rosa Haaren', 'Magischer Look mit rosa Haaren.', 6, 'RARE', 10, '#d8589d', '#087578', 'GIRL', true, CURRENT_TIMESTAMP),
('character-wizard-blue', 'character', 'Zauberlehrling mit blauen Haaren', 'Magischer Look mit blauen Haaren.', 6, 'RARE', 10, '#2877bd', '#087578', 'GIRL', true, CURRENT_TIMESTAMP),
('character-wizard-brown', 'character', 'Zauberlehrling mit braunen Haaren', 'Magischer Look mit braunen Haaren.', 6, 'RARE', 10, '#68422d', '#087578', 'GIRL', true, CURRENT_TIMESTAMP),
('character-wizard-black', 'character', 'Zauberlehrling mit schwarzen Haaren', 'Magischer Look mit schwarzen Haaren.', 6, 'RARE', 10, '#202531', '#087578', 'GIRL', true, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE SET
    "slot" = EXCLUDED."slot",
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "requiredLevel" = EXCLUDED."requiredLevel",
    "rarity" = EXCLUDED."rarity",
    "layerOrder" = EXCLUDED."layerOrder",
    "colorPrimary" = EXCLUDED."colorPrimary",
    "colorSecondary" = EXCLUDED."colorSecondary",
    "audienceGender" = EXCLUDED."audienceGender",
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP;

UPDATE "AvatarItem"
SET "name" = 'Zauberlehrling',
    "description" = 'Magischer Look mit blonden Haaren.',
    "requiredLevel" = 6,
    "rarity" = 'RARE',
    "colorPrimary" = '#e7bd59',
    "colorSecondary" = '#087578',
    "audienceGender" = 'GIRL',
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'character-wizard';
