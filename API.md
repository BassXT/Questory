# API.md

Dieses Dokument beschreibt den geplanten REST-API-Entwurf fuer Questory. Die konkrete Implementierung folgt im Backend-Scaffold.

## Allgemeine Konventionen

- Basis-Prefix: `/api`
- Format: JSON
- Authentifizierung: `Authorization: Bearer <token>`
- Zeitformat: ISO 8601
- Fehlerantworten sollen konsistent strukturiert sein.

Beispiel-Fehlerformat:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## System

### `GET /api/health`

Gibt einen einfachen Health-Check zurueck.

Beispiel:

```json
{
  "app": "questory",
  "status": "ok",
  "timestamp": "2026-07-08T00:00:00.000Z"
}
```

## Auth

### `POST /api/auth/register`

Erstellt eine Familie und das erste Elternkonto.

Status: implementiert.

Request:

```json
{
  "familyName": "Familie Beispiel",
  "displayName": "Thomas",
  "email": "thomas@example.com",
  "password": "mindestens-8-zeichen"
}
```

Response:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "<user-id>",
    "familyId": "<family-id>",
    "email": "thomas@example.com",
    "displayName": "Thomas",
    "role": "PARENT",
    "createdAt": "2026-07-09T00:00:00.000Z",
    "updatedAt": "2026-07-09T00:00:00.000Z"
  }
}
```

### `POST /api/auth/login`

Meldet einen Benutzer an und gibt ein JWT zurueck.

Status: implementiert.

Request:

```json
{
  "email": "thomas@example.com",
  "password": "mindestens-8-zeichen"
}
```

Response: wie `POST /api/auth/register`.

### `GET /api/auth/me`

Gibt den aktuell angemeldeten Benutzer zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

## Families

### `GET /api/families/current`

Gibt den aktuellen Familienkontext zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `PATCH /api/families/current`

Aktualisiert Familieninformationen.

## Users

### `GET /api/users`

Listet Benutzer der Familie.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `POST /api/users`

Erstellt einen Eltern- oder Kinderbenutzer in der aktuellen Familie.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- `role` darf aktuell nur `PARENT` oder `CHILD` sein.
- Bei `PARENT` ist `password` erforderlich.
- Bei `CHILD` wird automatisch ein verknuepftes Kinderprofil angelegt. Kinder-Login/PIN wird spaeter separat gestaltet.

Request fuer Eltern:

```json
{
  "displayName": "Anna",
  "email": "anna@example.com",
  "role": "PARENT",
  "password": "mindestens-8-zeichen"
}
```

Request fuer Kinder:

```json
{
  "displayName": "Mia",
  "email": "mia@example.com",
  "role": "CHILD",
  "avatarKey": "starter-fox"
}
```

### `GET /api/users/{userId}`

Gibt einen Benutzer zurueck.

### `PATCH /api/users/{userId}`

Aktualisiert einen Benutzer.

### `DELETE /api/users/{userId}`

Deaktiviert oder loescht einen Benutzer. Das genaue Verhalten wird vor Implementierung entschieden.

## Children

### `GET /api/children`

Listet Kinderprofile der Familie.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `POST /api/children`

Erstellt ein Kinderprofil ohne eigenes Login-Konto.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Request:

```json
{
  "displayName": "Mia",
  "avatarKey": "starter-fox"
}
```

### `GET /api/children/{childId}`

Gibt ein Kinderprofil inklusive Fortschritt zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `PATCH /api/children/{childId}`

Aktualisiert ein Kinderprofil.

## Quests

### `GET /api/quests`

Listet Quest-Vorlagen.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `POST /api/quests`

Erstellt eine Quest.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- `type` ist `ONE_TIME` oder `RECURRING`.
- Einmalige Quests muessen `frequency: "NONE"` verwenden oder `frequency` weglassen.
- Wiederkehrende Quests muessen `DAILY`, `WEEKLY` oder `CUSTOM` verwenden.
- `xpReward` und `coinReward` muessen Zahlen zwischen `0` und `10000` sein.

Request:

```json
{
  "title": "Zimmer aufraeumen",
  "description": "Spielzeug sortieren und Boden frei machen.",
  "type": "RECURRING",
  "frequency": "DAILY",
  "xpReward": 25,
  "coinReward": 5,
  "requiresApproval": true,
  "isActive": true
}
```

### `GET /api/quests/{questId}`

Gibt eine Quest zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `PATCH /api/quests/{questId}`

Aktualisiert eine Quest.

### `DELETE /api/quests/{questId}`

Deaktiviert oder loescht eine Quest. Das genaue Verhalten wird vor Implementierung entschieden.

## Quest Assignments

### `GET /api/children/{childId}/quest-assignments`

Listet zugewiesene Quests fuer ein Kind.

Status: implementiert.

Auth: Bearer Token erforderlich.

Hinweis: Die Antwort enthaelt die Zuweisung und eingebettete Quest-Daten.

### `POST /api/quest-assignments`

Weist eine Quest einem Kind zu.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Quest und Kinderprofil muessen zur aktuellen Familie gehoeren.
- Inaktive Quests koennen nicht zugewiesen werden.
- Dieselbe Quest kann einem Kind aktuell nur einmal zugewiesen werden.

Request:

```json
{
  "questId": "<quest-id>",
  "childProfileId": "<child-profile-id>",
  "dueAt": "2026-07-10T18:00:00.000Z"
}
```

### `PATCH /api/quest-assignments/{assignmentId}`

Aktualisiert eine Quest-Zuweisung.

## Quest Completion

### `POST /api/quest-assignments/{assignmentId}/complete`

Kind markiert eine Quest als erledigt.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`, `CHILD`

Hinweise:

- Der Endpunkt erstellt einen `QuestCompletion` mit Status `SUBMITTED`.
- XP und Muenzen werden noch nicht vergeben; das passiert spaeter bei der Eltern-Bestaetigung.
- Kinder mit eigenem Login duerfen nur ihre eigenen Zuweisungen abschliessen.
- Eltern/Admin duerfen bis zum finalen Kinder-Login-Flow stellvertretend einreichen.
- Eine Zuweisung darf nur eine offene Einreichung mit Status `SUBMITTED` haben.
- Einmalige Quests koennen nach einer bestaetigten Einreichung nicht erneut eingereicht werden.

### `POST /api/quest-completions/{completionId}/approve`

Eltern bestaetigen eine erledigte Quest. XP und Muenzen werden vergeben.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Abschluesse mit Status `SUBMITTED` koennen bestaetigt werden.
- Der Abschluss wird auf `APPROVED` gesetzt.
- `xpGranted` und `coinsGranted` werden aus der Quest-Vorlage uebernommen.
- Das Kinderprofil erhaelt XP und Muenzen atomar in derselben Transaktion.
- Das Level wird nach der aktuellen Formel neu berechnet: `floor(sqrt(totalXp / 100)) + 1`.
- Wiederholtes Bestaetigen desselben Abschlusses wird mit `409 Conflict` abgelehnt.

### `POST /api/quest-completions/{completionId}/reject`

Eltern lehnen einen Abschluss ab.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Abschluesse mit Status `SUBMITTED` koennen abgelehnt werden.
- Der Abschluss wird auf `REJECTED` gesetzt.
- `rejectedAt` wird gesetzt.
- `rejectionReason` ist optional und auf 1000 Zeichen begrenzt.
- XP und Muenzen werden nicht vergeben.
- Nach einer Ablehnung kann dieselbe Zuweisung erneut eingereicht werden.

Request:

```json
{
  "rejectionReason": "Bitte noch das Bett machen."
}
```

## Rewards

### `GET /api/rewards`

Listet Belohnungen der Familie.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `POST /api/rewards`

Erstellt eine Belohnung.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- `price` ist der Preis in Muenzen.
- `imageUrl`, `category` und `maxRedemptions` sind optional.
- `isActive` und `requiresApproval` sind optional und standardmaessig `true`.
- `maxRedemptions` begrenzt spaeter die maximale Anzahl von Einloesungen.

Request:

```json
{
  "name": "30 Minuten Switch",
  "description": "Eine halbe Stunde Spielzeit am Nachmittag.",
  "imageUrl": "https://example.com/rewards/switch.png",
  "category": "Medienzeit",
  "price": 25,
  "isActive": true,
  "requiresApproval": true,
  "maxRedemptions": 3
}
```

### `GET /api/rewards/{rewardId}`

Gibt eine Belohnung zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `PATCH /api/rewards/{rewardId}`

Aktualisiert eine Belohnung.

### `DELETE /api/rewards/{rewardId}`

Deaktiviert oder loescht eine Belohnung. Das genaue Verhalten wird vor Implementierung entschieden.

## Reward Shop

### `GET /api/children/{childId}/shop`

Listet aktive und fuer das Kind relevante Belohnungen.

Status: implementiert.

Auth: Bearer Token erforderlich.

Hinweise:

- Das Kinderprofil muss zur aktuellen Familie gehoeren.
- Eltern/Admin koennen den Shop jedes Kindes der Familie abrufen.
- Kinder mit eigenem Login koennen nur den eigenen Shop abrufen.
- Es werden aktuell alle aktiven Belohnungen der Familie angezeigt.
- Sortierung: guenstigste Belohnungen zuerst, danach Name.

### `POST /api/rewards/{rewardId}/redeem`

Kind beantragt oder kauft eine Belohnung.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`, `CHILD`

Hinweise:

- Die Belohnung und das Kinderprofil muessen zur aktuellen Familie gehoeren.
- Kinder mit eigenem Login koennen nur fuer ihr eigenes Kinderprofil einloesen.
- Inaktive Belohnungen koennen nicht eingeloest werden.
- Das Kind muss genug Muenzen fuer den aktuellen Preis besitzen.
- Bei `requiresApproval: true` wird eine Anfrage mit Status `REQUESTED` erstellt; Muenzen werden noch nicht abgezogen.
- Bei `requiresApproval: false` wird direkt eine Einloesung mit Status `APPROVED` erstellt; Muenzen werden sofort abgezogen.
- `maxRedemptions` zaehlt bestehende Einloesungen mit Status `REQUESTED`, `APPROVED` und `REDEEMED` fuer dasselbe Kind.

Request:

```json
{
  "childProfileId": "child-profile-uuid"
}
```

### `POST /api/reward-redemptions/{redemptionId}/approve`

Eltern bestaetigen eine Belohnungsanfrage.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Die Einloesung muss zur aktuellen Familie gehoeren.
- Nur Einloesungen mit Status `REQUESTED` koennen bestaetigt werden.
- Beim Bestaetigen werden die in `coinCost` gespeicherten Muenzen vom Kinderprofil abgezogen.
- Falls das Kind nicht mehr genug Muenzen besitzt, wird die Bestaetigung abgelehnt.

### `POST /api/reward-redemptions/{redemptionId}/reject`

Eltern lehnen eine Belohnungsanfrage ab.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Einloesungen mit Status `REQUESTED` koennen abgelehnt werden.
- Es werden keine Muenzen abgezogen.

Request:

```json
{
  "rejectionReason": "Heute passt es leider nicht."
}
```

### `POST /api/reward-redemptions/{redemptionId}/mark-redeemed`

Markiert eine Belohnung als eingeloest.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Einloesungen mit Status `APPROVED` koennen als eingeloest markiert werden.

### `GET /api/reward-redemptions`

Listet Belohnungseinloesungen der aktuellen Familie.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Optionale Query-Parameter:

- `childProfileId`: filtert auf ein Kinderprofil.
- `status`: filtert auf `REQUESTED`, `APPROVED`, `REJECTED` oder `REDEEMED`.

## Dashboard und Statistiken

### `GET /api/dashboard`

Gibt Dashboard-Daten fuer den aktuellen Benutzer zurueck.

### `GET /api/children/{childId}/stats`

Gibt Statistiken fuer ein Kind zurueck.

## Display API fuer spaeter

### `GET /api/display/{childId}`

Gibt eine reduzierte JSON-Ausgabe fuer externe Displays zurueck.

Dieser Endpunkt gehoert nicht zum MVP, wird aber als zukuenftige Integrationsflaeche vorgemerkt.
