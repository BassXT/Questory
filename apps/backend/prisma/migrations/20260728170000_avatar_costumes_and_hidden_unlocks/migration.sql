UPDATE "AvatarItem"
SET "requiredLevel" = CASE "key"
        WHEN 'pet-cat' THEN 3
        WHEN 'pet-dog' THEN 4
        WHEN 'pet-bunny' THEN 5
        WHEN 'pet-fox' THEN 6
        WHEN 'pet-lion' THEN 7
        WHEN 'pet-tiger' THEN 8
        WHEN 'pet-elephant' THEN 9
        WHEN 'pet-dragon' THEN 12
    END,
    "rarity" = CASE "key"
        WHEN 'pet-cat' THEN 'COMMON'
        WHEN 'pet-dog' THEN 'COMMON'
        WHEN 'pet-bunny' THEN 'UNCOMMON'
        WHEN 'pet-fox' THEN 'UNCOMMON'
        WHEN 'pet-lion' THEN 'RARE'
        WHEN 'pet-tiger' THEN 'RARE'
        WHEN 'pet-elephant' THEN 'RARE'
        WHEN 'pet-dragon' THEN 'EPIC'
    END,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" IN (
    'pet-cat',
    'pet-dog',
    'pet-bunny',
    'pet-fox',
    'pet-lion',
    'pet-tiger',
    'pet-elephant',
    'pet-dragon'
);

WITH styles (
    "baseKey",
    "name",
    "description",
    "requiredLevel",
    "rarity",
    "audienceGender",
    "baseColor",
    "secondaryColor"
) AS (
    VALUES
        ('character-boy-knight', 'Sternenritter', 'Blaue Ruestung fuer mutige Abenteuer.', 5, 'RARE', 'BOY', 'red', '#1f5eb8'),
        ('character-boy-astronaut', 'Sternenforscher', 'Raumanzug fuer Quests zwischen den Sternen.', 8, 'EPIC', 'BOY', 'red', '#0f6d8f'),
        ('character-girl-knight', 'Sternenritterin', 'Violette Ruestung fuer mutige Abenteuer.', 5, 'RARE', 'GIRL', 'pink', '#513279'),
        ('character-girl-astronaut', 'Sternenforscherin', 'Raumanzug fuer Quests zwischen den Sternen.', 8, 'EPIC', 'GIRL', 'pink', '#513279')
),
colors ("colorKey", "colorLabel", "colorValue") AS (
    VALUES
        ('red', 'roten', '#b64b32'),
        ('pink', 'rosa', '#d8589d'),
        ('blue', 'blauen', '#2877bd'),
        ('brown', 'braunen', '#68422d'),
        ('blonde', 'blonden', '#e7bd59'),
        ('black', 'schwarzen', '#202531')
)
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
)
SELECT
    CASE
        WHEN colors."colorKey" = styles."baseColor" THEN styles."baseKey"
        ELSE styles."baseKey" || '-' || colors."colorKey"
    END,
    'character',
    CASE
        WHEN colors."colorKey" = styles."baseColor" THEN styles."name"
        ELSE styles."name" || ' mit ' || colors."colorLabel" || ' Haaren'
    END,
    styles."description",
    styles."requiredLevel",
    styles."rarity",
    10,
    colors."colorValue",
    styles."secondaryColor",
    styles."audienceGender",
    true,
    CURRENT_TIMESTAMP
FROM styles
CROSS JOIN colors
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
