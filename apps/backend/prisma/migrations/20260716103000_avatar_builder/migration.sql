CREATE TABLE "AvatarItem" (
    "key" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiredLevel" INTEGER NOT NULL DEFAULT 1,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "layerOrder" INTEGER NOT NULL,
    "colorPrimary" TEXT,
    "colorSecondary" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvatarItem_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "ChildAvatarItem" (
    "childProfileId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',

    CONSTRAINT "ChildAvatarItem_pkey" PRIMARY KEY ("childProfileId","itemKey")
);

CREATE TABLE "ChildAvatarLoadout" (
    "childProfileId" TEXT NOT NULL,
    "equippedItems" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildAvatarLoadout_pkey" PRIMARY KEY ("childProfileId")
);

CREATE INDEX "AvatarItem_slot_idx" ON "AvatarItem"("slot");
CREATE INDEX "AvatarItem_requiredLevel_idx" ON "AvatarItem"("requiredLevel");
CREATE INDEX "ChildAvatarItem_itemKey_idx" ON "ChildAvatarItem"("itemKey");

ALTER TABLE "ChildAvatarItem" ADD CONSTRAINT "ChildAvatarItem_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChildAvatarItem" ADD CONSTRAINT "ChildAvatarItem_itemKey_fkey" FOREIGN KEY ("itemKey") REFERENCES "AvatarItem"("key") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChildAvatarLoadout" ADD CONSTRAINT "ChildAvatarLoadout_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "AvatarItem" ("key", "slot", "name", "description", "requiredLevel", "rarity", "layerOrder", "colorPrimary", "colorSecondary", "updatedAt") VALUES
('body-sunrise', 'body', 'Sonnenbasis', 'Warme Avatar-Basis.', 1, 'COMMON', 10, '#f2b28d', '#d98a62', CURRENT_TIMESTAMP),
('body-moonlight', 'body', 'Mondbasis', 'Kuehle Avatar-Basis.', 1, 'COMMON', 10, '#caa786', '#8f6f5d', CURRENT_TIMESTAMP),
('body-forest', 'body', 'Waldbasis', 'Naturfarbene Avatar-Basis.', 2, 'COMMON', 10, '#b98668', '#6f4f3d', CURRENT_TIMESTAMP),
('hair-swoop', 'hair', 'Abenteuer-Schopf', 'Locker sitzende Haare.', 1, 'COMMON', 30, '#5b3826', '#3a2418', CURRENT_TIMESTAMP),
('hair-buns', 'hair', 'Doppelknoten', 'Verspielte Knoten.', 1, 'COMMON', 30, '#7a4729', '#4e2b18', CURRENT_TIMESTAMP),
('hair-curly', 'hair', 'Wirbel-Locken', 'Runde Lockenform.', 2, 'COMMON', 30, '#2f2a28', '#171514', CURRENT_TIMESTAMP),
('hair-silver', 'hair', 'Silberstraehne', 'Freche helle Straehne.', 4, 'RARE', 30, '#d8dce6', '#748195', CURRENT_TIMESTAMP),
('eyes-bright', 'eyes', 'Wache Augen', 'Neugieriger Blick.', 1, 'COMMON', 40, '#28384f', NULL, CURRENT_TIMESTAMP),
('eyes-smile', 'eyes', 'Laechelaugen', 'Freundlicher Blick.', 1, 'COMMON', 40, '#28384f', NULL, CURRENT_TIMESTAMP),
('eyes-focus', 'eyes', 'Fokusblick', 'Konzentrierter Blick.', 3, 'COMMON', 40, '#243347', NULL, CURRENT_TIMESTAMP),
('glasses-round', 'glasses', 'Runde Brille', 'Klassische runde Brille.', 2, 'COMMON', 55, '#233044', '#ffffff', CURRENT_TIMESTAMP),
('glasses-star', 'glasses', 'Sternenbrille', 'Brille mit Sternenform.', 5, 'RARE', 55, '#6a5acd', '#f4c542', CURRENT_TIMESTAMP),
('glasses-goggles', 'glasses', 'Forscherbrille', 'Gadget fuer Experimente.', 7, 'RARE', 55, '#5264b8', '#9ed7f2', CURRENT_TIMESTAMP),
('top-hoodie-blue', 'top', 'Blauer Hoodie', 'Bequemer Abenteuer-Hoodie.', 1, 'COMMON', 70, '#2568d8', '#1d4f9f', CURRENT_TIMESTAMP),
('top-shirt-green', 'top', 'Gruenes Shirt', 'Einfaches Quest-Shirt.', 1, 'COMMON', 70, '#2f8f6f', '#21664f', CURRENT_TIMESTAMP),
('top-jacket-orange', 'top', 'Orange Jacke', 'Sichtbare Forscherjacke.', 3, 'COMMON', 70, '#d87532', '#9d4c1f', CURRENT_TIMESTAMP),
('top-cape-purple', 'top', 'Helden-Cape', 'Cape fuer groessere Level.', 4, 'RARE', 72, '#7a5ccf', '#4c378f', CURRENT_TIMESTAMP),
('top-armor-gold', 'top', 'Sternenweste', 'Glanz fuer hohe Level.', 8, 'EPIC', 72, '#d2a818', '#8a6b10', CURRENT_TIMESTAMP),
('bottom-jeans', 'bottom', 'Quest-Jeans', 'Robuste Hose.', 1, 'COMMON', 65, '#355f9f', '#233f6c', CURRENT_TIMESTAMP),
('bottom-shorts', 'bottom', 'Sommer-Shorts', 'Leichte Abenteuer-Shorts.', 1, 'COMMON', 65, '#38a6a5', '#267574', CURRENT_TIMESTAMP),
('bottom-cargo', 'bottom', 'Cargo-Hose', 'Mit vielen Taschen.', 3, 'COMMON', 65, '#6f7a3d', '#424925', CURRENT_TIMESTAMP),
('bottom-space', 'bottom', 'Sternenhose', 'Kosmische Musterhose.', 7, 'RARE', 65, '#5264b8', '#20284d', CURRENT_TIMESTAMP),
('shoes-sneaker-red', 'shoes', 'Rote Sneaker', 'Schnelle Schuhe.', 1, 'COMMON', 80, '#d63f61', '#8f263d', CURRENT_TIMESTAMP),
('shoes-boots', 'shoes', 'Abenteuer-Stiefel', 'Stabil fuer draussen.', 2, 'COMMON', 80, '#7d5635', '#4a321f', CURRENT_TIMESTAMP),
('shoes-glow', 'shoes', 'Leuchtschuhe', 'Leuchten ab Level 9.', 9, 'EPIC', 80, '#29b6f6', '#f4c542', CURRENT_TIMESTAMP),
('gadget-backpack', 'gadget', 'Sticker-Rucksack', 'Rucksack fuer kleine Funde.', 3, 'COMMON', 20, '#d04c73', '#7a5ccf', CURRENT_TIMESTAMP),
('gadget-compass', 'gadget', 'Sternen-Kompass', 'Zeigt den naechsten Quest-Weg.', 5, 'RARE', 90, '#d2a818', '#2568d8', CURRENT_TIMESTAMP),
('gadget-robot', 'gadget', 'Mini-Roboter', 'Technischer Begleiter.', 10, 'EPIC', 90, '#607d8b', '#9ed7f2', CURRENT_TIMESTAMP),
('gadget-drone', 'gadget', 'Mini-Drone', 'Fliegendes Gadget.', 12, 'EPIC', 90, '#587087', '#29b6f6', CURRENT_TIMESTAMP),
('background-meadow', 'background', 'Wiese', 'Ruhiger Hintergrund.', 1, 'COMMON', 0, '#d9f2df', '#8dd3a5', CURRENT_TIMESTAMP),
('background-room', 'background', 'Kinderzimmer', 'Gemuetlicher Raum.', 1, 'COMMON', 0, '#f3e1c8', '#d9a96d', CURRENT_TIMESTAMP),
('background-night', 'background', 'Sternennacht', 'Freigeschaltet fuer Nachthelden.', 5, 'RARE', 0, '#25304f', '#7a5ccf', CURRENT_TIMESTAMP),
('background-lab', 'background', 'Forscherlabor', 'Fuer Technik-Fans.', 8, 'RARE', 0, '#d7ecf2', '#607d8b', CURRENT_TIMESTAMP);
