UPDATE "AvatarItem"
SET "isActive" = false,
    "updatedAt" = CURRENT_TIMESTAMP;

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
    "isActive",
    "updatedAt"
) VALUES
('character-hoodie-teal', 'character', 'Hoodie-Abenteurer', 'Ein entspannter Look für die ersten Quests.', 1, 'COMMON', 10, '#138f8a', '#25313b', true, CURRENT_TIMESTAMP),
('character-sunflower', 'character', 'Sonnenblumen-Heldin', 'Sonniger Alltagslook mit Locken und Denim.', 1, 'COMMON', 10, '#f4b51f', '#2f718f', true, CURRENT_TIMESTAMP),
('character-smiley', 'character', 'Smiley-Entdecker', 'Blauer Lieblingspulli mit guter Laune.', 2, 'COMMON', 10, '#1f5eb8', '#f4c542', true, CURRENT_TIMESTAMP),
('character-star', 'character', 'Sternen-Heldin', 'Ein leuchtender Stern für mutige Quests.', 3, 'UNCOMMON', 10, '#1857a7', '#f1bd34', true, CURRENT_TIMESTAMP),
('character-explorer', 'character', 'Wald-Entdeckerin', 'Bereit für Karten, Wege und neue Gebiete.', 4, 'UNCOMMON', 10, '#4d6533', '#d8b06a', true, CURRENT_TIMESTAMP),
('character-knight', 'character', 'Sternenritter', 'Eine glänzende Rüstung für große Abenteuer.', 5, 'RARE', 10, '#245da9', '#d5ae3e', true, CURRENT_TIMESTAMP),
('character-astronaut', 'character', 'Sternenforscherin', 'Ein Raumanzug für Quests jenseits der Wolken.', 7, 'RARE', 10, '#f5f1e7', '#1f5687', true, CURRENT_TIMESTAMP),
('character-wizard', 'character', 'Zauberlehrling', 'Magischer Look für besonders hohe Level.', 9, 'EPIC', 10, '#087578', '#513279', true, CURRENT_TIMESTAMP),
('pet-cat', 'pet', 'Katze', 'Eine neugierige Begleiterin mit scharfem Blick.', 1, 'COMMON', 20, '#e98524', '#087c7c', true, CURRENT_TIMESTAMP),
('pet-dog', 'pet', 'Hund', 'Ein fröhlicher und treuer Quest-Freund.', 2, 'COMMON', 20, '#dca64d', '#a92720', true, CURRENT_TIMESTAMP),
('pet-bunny', 'pet', 'Hase', 'Leise, aufmerksam und immer sprungbereit.', 3, 'COMMON', 20, '#a89478', '#5f7628', true, CURRENT_TIMESTAMP),
('pet-fox', 'pet', 'Fuchs', 'Ein kluger Begleiter fuer verschlungene Wege.', 4, 'UNCOMMON', 20, '#d96b18', '#087c7c', true, CURRENT_TIMESTAMP),
('pet-lion', 'pet', 'Sonnenfell', 'Ein mutiger goldener Freund mit Sonnenmedaille.', 5, 'RARE', 20, '#e4a52d', '#1766a8', true, CURRENT_TIMESTAMP),
('pet-tiger', 'pet', 'Tiger', 'Ein gestreifter Begleiter fuer mutige Kinder.', 6, 'RARE', 20, '#ed8a16', '#5f7628', true, CURRENT_TIMESTAMP),
('pet-elephant', 'pet', 'Elefant', 'Stark, freundlich und mit einem guten Gedächtnis.', 7, 'RARE', 20, '#85817f', '#55307c', true, CURRENT_TIMESTAMP),
('pet-dragon', 'pet', 'Walddrache', 'Ein kleiner magischer Drache fuer echte Quest-Profis.', 10, 'EPIC', 20, '#279b43', '#d5ae3e', true, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE SET
    "slot" = EXCLUDED."slot",
    "name" = EXCLUDED."name",
    "description" = EXCLUDED."description",
    "requiredLevel" = EXCLUDED."requiredLevel",
    "rarity" = EXCLUDED."rarity",
    "layerOrder" = EXCLUDED."layerOrder",
    "colorPrimary" = EXCLUDED."colorPrimary",
    "colorSecondary" = EXCLUDED."colorSecondary",
    "isActive" = true,
    "updatedAt" = CURRENT_TIMESTAMP;
