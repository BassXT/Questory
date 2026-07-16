ALTER TABLE "ChildProfile" ADD COLUMN "gender" TEXT;
ALTER TABLE "ChildProfile" ADD COLUMN "birthDate" TIMESTAMP(3);

INSERT INTO "AvatarItem" ("key", "slot", "name", "description", "requiredLevel", "rarity", "layerOrder", "colorPrimary", "colorSecondary", "updatedAt") VALUES
('mouth-smile', 'mouth', 'Laecheln', 'Freundliches Laecheln.', 1, 'COMMON', 45, '#9a5a4a', NULL, CURRENT_TIMESTAMP),
('mouth-grin', 'mouth', 'Grinsen', 'Breites Abenteuergrinsen.', 1, 'COMMON', 45, '#8f4a3f', NULL, CURRENT_TIMESTAMP),
('mouth-soft', 'mouth', 'Sanftes Laecheln', 'Ruhiger Ausdruck.', 1, 'COMMON', 45, '#9a5a4a', NULL, CURRENT_TIMESTAMP),
('mouth-focus', 'mouth', 'Konzentriert', 'Fokussierter Quest-Blick.', 2, 'COMMON', 45, '#7d4a42', NULL, CURRENT_TIMESTAMP),
('mouth-laugh', 'mouth', 'Lachen', 'Froehlicher Lachmund.', 3, 'COMMON', 45, '#b85a4a', NULL, CURRENT_TIMESTAMP),
('mouth-surprise', 'mouth', 'Ueberrascht', 'Staunender Ausdruck.', 4, 'COMMON', 45, '#8f4a3f', NULL, CURRENT_TIMESTAMP),
('mouth-brave', 'mouth', 'Mutig', 'Kleiner Heldenausdruck.', 5, 'RARE', 45, '#7d4a42', NULL, CURRENT_TIMESTAMP),
('mouth-magic', 'mouth', 'Magisch', 'Leicht funkelnder Ausdruck.', 8, 'RARE', 45, '#7a5ccf', NULL, CURRENT_TIMESTAMP),
('pet-bunny', 'pet', 'Hase', 'Kleiner flinker Pixelhase.', 2, 'COMMON', 100, '#d8c4a8', '#8f6f5d', CURRENT_TIMESTAMP),
('pet-fox', 'pet', 'Fuchs', 'Schlauer Fuchsbegleiter.', 4, 'COMMON', 100, '#d87532', '#ffffff', CURRENT_TIMESTAMP),
('pet-panda', 'pet', 'Panda', 'Ruhiger Panda-Freund.', 5, 'RARE', 100, '#f1eee8', '#1e2533', CURRENT_TIMESTAMP),
('pet-dragon', 'pet', 'Mini-Drache', 'Kleiner Drache fuer grosse Quests.', 9, 'EPIC', 100, '#2f8f6f', '#d63f61', CURRENT_TIMESTAMP),
('pet-unicorn', 'pet', 'Mini-Einhorn', 'Seltener magischer Begleiter.', 10, 'EPIC', 100, '#ffffff', '#d96aa8', CURRENT_TIMESTAMP),
('pet-robot', 'pet', 'Roboterfreund', 'Technischer Pixelbegleiter.', 7, 'RARE', 100, '#8ea0b8', '#29b6f6', CURRENT_TIMESTAMP),
('gadget-lantern', 'gadget', 'Laterne', 'Leuchtet auf dunklen Questwegen.', 3, 'COMMON', 90, '#f2c94c', '#d87532', CURRENT_TIMESTAMP),
('gadget-camera', 'gadget', 'Kamera', 'Fuer Erinnerungsmissionen.', 4, 'COMMON', 90, '#607d8b', '#1e2533', CURRENT_TIMESTAMP),
('gadget-sketchbook', 'gadget', 'Skizzenbuch', 'Fuer kreative Ideen.', 4, 'COMMON', 90, '#f3e1c8', '#7a5ccf', CURRENT_TIMESTAMP),
('gadget-telescope', 'gadget', 'Fernrohr', 'Findet Abenteuer am Horizont.', 6, 'RARE', 90, '#3858d6', '#f2c94c', CURRENT_TIMESTAMP),
('gadget-crystal', 'gadget', 'Kristall', 'Funkelnder Sammlerstein.', 8, 'RARE', 90, '#9b5fd8', '#29b6f6', CURRENT_TIMESTAMP),
('weapon-bow', 'weapon', 'Bogen', 'Leichter Pixelbogen.', 6, 'RARE', 95, '#8b5a2b', '#f2c078', CURRENT_TIMESTAMP),
('weapon-rocket', 'weapon', 'Raketenstab', 'Sci-Fi-Gadget fuer Levelhelden.', 10, 'EPIC', 95, '#d63f61', '#29b6f6', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
