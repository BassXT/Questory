# DATABASE.md

Dieses Dokument beschreibt den initialen Datenmodell-Entwurf fuer Questory. Das konkrete Prisma-Schema liegt unter `apps/backend/prisma/schema.prisma`; die Prisma-7-Konfiguration liegt unter `apps/backend/prisma.config.ts`.

## Entity Relationship

Initiale Kernbeziehungen:

```text
Family 1--n User
Family 1--n ChildProfile
User 0..1--0..1 ChildProfile
ChildProfile 1--n QuestAssignment
Quest 1--n QuestAssignment
QuestAssignment 1--n QuestCompletion
Family 1--n Reward
ChildProfile 1--n RewardRedemption
Reward 1--n RewardRedemption
ChildProfile 1--n ChildAvatarItem
ChildProfile 1--0..1 ChildAvatarLoadout
AvatarItem 1--n ChildAvatarItem
```

## Tabellen

### Family

Repraesentiert eine Familie oder einen Haushalt.

Felder:

- `id`
- `name`
- `childLoginCode`
- `createdAt`
- `updatedAt`

`childLoginCode` ist ein eindeutiger, kurz lesbarer Familiencode fuer den geplanten Kinderlogin und fuer spaetere QR-Code-Login-URLs. Bestehende Familien duerfen vorerst `NULL` enthalten; neue Familien erhalten beim Registrieren automatisch einen Code.

### User

Repraesentiert anmeldbare Benutzer wie Administratoren und Eltern. Kinder koennen fuer das MVP ebenfalls als User abgebildet werden und erhalten dann ein verknuepftes `ChildProfile`.

Felder:

- `id`
- `familyId`
- `email`
- `passwordHash`
- `displayName`
- `role`
- `createdAt`
- `updatedAt`

Rollen:

- `ADMIN`
- `PARENT`
- `CHILD`

### ChildProfile

Repraesentiert den spielbaren Kinderfortschritt innerhalb einer Familie.

Ein Kinderprofil kann entweder ohne Login-Konto existieren oder optional mit einem `User` der Rolle `CHILD` verknuepft sein.

Felder:

- `id`
- `familyId`
- `userId`
- `displayName`
- `avatarKey`
- `pinHash`
- `pinEnabled`
- `pinUpdatedAt`
- `level`
- `xp`
- `coins`
- `createdAt`
- `updatedAt`

Kinderlogin ohne E-Mail:

- `pinHash` speichert spaeter den Hash der Kinder-PIN, niemals Klartext.
- `pinEnabled` steuert, ob ein Kind per PIN einloggen darf.
- `pinUpdatedAt` dokumentiert die letzte PIN-Aenderung.
- Optional spaeter: `pinFailedAttempts`, `pinLockedUntil`.

Der Familiencode ist kein Geheimnis, sondern ein Locator fuer die Familie. Die PIN bleibt der eigentliche Authentifizierungsfaktor.

### Quest

Repraesentiert eine Aufgabe oder Quest-Vorlage.

Felder:

- `id`
- `familyId`
- `title`
- `description`
- `type`
- `frequency`
- `xpReward`
- `coinReward`
- `requiresApproval`
- `isAssignable`
- `isSelfService`
- `isActive`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Typen:

- `ONE_TIME`
- `RECURRING`

Frequenz:

- `NONE`
- `DAILY`
- `WEEKLY`
- `CUSTOM`

Spontane Quests:

- `isAssignable` erlaubt oder verhindert die manuelle Zuweisung durch Eltern.
- `isSelfService` erlaubt Einreichungen ohne vorherige Zuweisung, zum Beispiel "Ich habe mein Zimmer aufgeraeumt".
- Spontane Einreichungen nutzen weiterhin `QuestAssignment` und `QuestCompletion`. Existiert noch keine Zuweisung, wird eine interne Zuweisung ohne `dueAt` angelegt.

### QuestAssignment

Verknuepft eine Quest mit einem Kind.

Felder:

- `id`
- `questId`
- `childProfileId`
- `dueAt`
- `createdAt`
- `updatedAt`

### QuestCompletion

Repraesentiert einen Abschlussversuch oder bestaetigten Abschluss einer Quest.

Felder:

- `id`
- `questAssignmentId`
- `status`
- `submittedAt`
- `approvedAt`
- `approvedByUserId`
- `rejectedAt`
- `rejectionReason`
- `xpGranted`
- `coinsGranted`

Status:

- `SUBMITTED`
- `APPROVED`
- `REJECTED`

### Reward

Repraesentiert eine Belohnung im Shop.

Felder:

- `id`
- `familyId`
- `name`
- `description`
- `imageUrl`
- `category`
- `price`
- `isActive`
- `requiresApproval`
- `maxRedemptions`
- `createdAt`
- `updatedAt`

### RewardRedemption

Repraesentiert eine beantragte oder eingeloeste Belohnung.

Felder:

- `id`
- `rewardId`
- `childProfileId`
- `status`
- `requestedAt`
- `approvedAt`
- `approvedByUserId`
- `redeemedAt`
- `rejectedAt`
- `cancelledAt`
- `rejectionReason`
- `coinCost`

Status:

- `REQUESTED`
- `APPROVED`
- `REJECTED`
- `CANCELLED`
- `REDEEMED`

Muenzlogik:

- `coinCost` speichert den zum Beantragungszeitpunkt reservierten Preis.
- Beim Erstellen einer Einloesung werden Muenzen sofort vom Kinderprofil abgezogen.
- `REJECTED` und `CANCELLED` schreiben diese Muenzen wieder gut.
- `REDEEMED` ist final und kann nicht mehr storniert werden.

### AvatarItem

Repraesentiert ein globales Avatar-Bauteil im self-hosted Katalog.

Felder:

- `key`
- `slot`
- `name`
- `description`
- `requiredLevel`
- `rarity`
- `layerOrder`
- `colorPrimary`
- `colorSecondary`
- `isActive`
- `createdAt`
- `updatedAt`

Slots:

- `background`
- `body`
- `hair`
- `eyes`
- `hat`
- `bottom`
- `top`
- `shoes`
- `glasses`
- `gadget`
- `weapon`
- `pet`

`requiredLevel` steuert die automatische Freischaltung durch XP-Level. `layerOrder` ist fuer spaetere Renderer/Asset-Pipelines vorbereitet.

### ChildAvatarItem

Repraesentiert manuell oder spaeter durch Events freigeschaltete Avatar-Items eines Kindes.

Felder:

- `childProfileId`
- `itemKey`
- `unlockedAt`
- `source`

Der zusammengesetzte Primaerschluessel ist `childProfileId + itemKey`. Level-Freischaltungen werden nicht fuer jedes Kind materialisiert; sie werden beim Lesen aus `AvatarItem.requiredLevel` berechnet. Diese Tabelle bleibt fuer Spezial-Unlocks, Events, Badges oder Eltern-Freischaltungen reserviert.

### ChildAvatarLoadout

Speichert die aktuell ausgeruesteten Avatar-Items eines Kindes.

Felder:

- `childProfileId`
- `equippedItems`
- `createdAt`
- `updatedAt`

`equippedItems` ist JSON, damit Slots ohne Migration erweitert werden koennen. Das Backend validiert beim Speichern, dass Item-Key, Slot und Freischaltung zusammenpassen.

## Migrationen

Die erste Prisma-Migration wurde erzeugt:

```text
apps/backend/prisma/migrations/20260709120000_init/migration.sql
```

Weitere Migrationen:

```text
apps/backend/prisma/migrations/20260712122000_reward_redemption_reservations/migration.sql
apps/backend/prisma/migrations/20260712143000_child_login_model/migration.sql
apps/backend/prisma/migrations/20260712162000_spontaneous_quests/migration.sql
apps/backend/prisma/migrations/20260716103000_avatar_builder/migration.sql
```

`npm run prisma:generate` wurde erfolgreich geprueft. Im Docker-/Portainer-Deployment fuehrt der Backend-Container beim Start automatisch aus:

```bash
npm run prisma:deploy -w apps/backend
```

Damit werden vorhandene Migrationen gegen die PostgreSQL-Datenbank angewendet.

## Level-Berechnung

Die Level-Berechnung ist fuer das MVP serverseitig, deterministisch und einfach testbar.

Aktuelle Startformel:

```text
level = floor(sqrt(totalXp / 100)) + 1
```

Die Formel wird bei der Eltern-Bestaetigung eines Quest-Abschlusses nach Vergabe der XP neu angewendet.

## Erweiterungen fuer spaeter

- Badge
- Streak
- Collectible
- AdventureArea
- SeasonalEvent
- FamilyChallenge
- DisplayDevice
