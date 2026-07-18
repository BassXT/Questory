INSERT INTO "AvatarItem" ("key", "slot", "name", "description", "requiredLevel", "rarity", "layerOrder", "colorPrimary", "colorSecondary", "updatedAt") VALUES
('top-shirt-smiley-yellow', 'top', 'Smiley-Shirt', 'Gelbes Shirt mit freundlichem Pixel-Smiley.', 1, 'COMMON', 70, '#f2c94c', '#263447', CURRENT_TIMESTAMP),
('top-shirt-star-purple', 'top', 'Lila Sternshirt', 'Lila Shirt mit hellem Sternmotiv.', 2, 'COMMON', 70, '#7a5ccf', '#fff3b0', CURRENT_TIMESTAMP),
('top-shirt-moon-navy', 'top', 'Mond-Shirt', 'Dunkles Shirt mit kleinem Mond.', 3, 'COMMON', 70, '#25304f', '#f2c94c', CURRENT_TIMESTAMP),
('top-shirt-bolt-red', 'top', 'Blitz-Shirt', 'Rotes Shirt mit Energieblitz.', 4, 'COMMON', 70, '#d63f61', '#fff3b0', CURRENT_TIMESTAMP),
('top-shirt-gamepad-green', 'top', 'Controller-Shirt', 'Gruenes Shirt fuer Spielpausen-Helden.', 5, 'RARE', 70, '#2f8f6f', '#ffffff', CURRENT_TIMESTAMP),
('top-shirt-crown-blue', 'top', 'Kronen-Shirt', 'Blaues Shirt mit kleiner Pixelkrone.', 6, 'RARE', 70, '#2568d8', '#f2c94c', CURRENT_TIMESTAMP),
('top-shirt-rocket-teal', 'top', 'Raketen-Shirt', 'Tuerkises Shirt mit Mini-Rakete.', 7, 'RARE', 70, '#38a6a5', '#ffffff', CURRENT_TIMESTAMP),
('top-shirt-spark-black', 'top', 'Funkel-Shirt', 'Dunkles Shirt mit hellem Funkelzeichen.', 8, 'EPIC', 70, '#323846', '#f2c94c', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
