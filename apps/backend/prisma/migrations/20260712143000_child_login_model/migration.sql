ALTER TABLE "Family"
ADD COLUMN "childLoginCode" TEXT;

CREATE UNIQUE INDEX "Family_childLoginCode_key" ON "Family"("childLoginCode");

ALTER TABLE "ChildProfile"
ADD COLUMN "pinHash" TEXT,
ADD COLUMN "pinEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "pinUpdatedAt" TIMESTAMP(3);
