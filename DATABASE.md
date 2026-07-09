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
```

## Tabellen

### Family

Repraesentiert eine Familie oder einen Haushalt.

Felder:

- `id`
- `name`
- `createdAt`
- `updatedAt`

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
- `level`
- `xp`
- `coins`
- `createdAt`
- `updatedAt`

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
- `rejectionReason`
- `coinCost`

Status:

- `REQUESTED`
- `APPROVED`
- `REJECTED`
- `REDEEMED`

## Migrationen

Die erste Prisma-Migration wurde erzeugt:

```text
apps/backend/prisma/migrations/20260709120000_init/migration.sql
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
- AvatarItem
- Collectible
- AdventureArea
- SeasonalEvent
- FamilyChallenge
- DisplayDevice
