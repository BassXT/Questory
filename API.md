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

## Rewards

### `GET /api/rewards`

Listet Belohnungen der Familie.

### `POST /api/rewards`

Erstellt eine Belohnung.

### `GET /api/rewards/{rewardId}`

Gibt eine Belohnung zurueck.

### `PATCH /api/rewards/{rewardId}`

Aktualisiert eine Belohnung.

### `DELETE /api/rewards/{rewardId}`

Deaktiviert oder loescht eine Belohnung. Das genaue Verhalten wird vor Implementierung entschieden.

## Reward Shop

### `GET /api/children/{childId}/shop`

Listet aktive und fuer das Kind relevante Belohnungen.

### `POST /api/rewards/{rewardId}/redeem`

Kind beantragt oder kauft eine Belohnung.

### `POST /api/reward-redemptions/{redemptionId}/approve`

Eltern bestaetigen eine Belohnungsanfrage.

### `POST /api/reward-redemptions/{redemptionId}/reject`

Eltern lehnen eine Belohnungsanfrage ab.

### `POST /api/reward-redemptions/{redemptionId}/mark-redeemed`

Markiert eine Belohnung als eingeloest.

## Dashboard und Statistiken

### `GET /api/dashboard`

Gibt Dashboard-Daten fuer den aktuellen Benutzer zurueck.

### `GET /api/children/{childId}/stats`

Gibt Statistiken fuer ein Kind zurueck.

## Display API fuer spaeter

### `GET /api/display/{childId}`

Gibt eine reduzierte JSON-Ausgabe fuer externe Displays zurueck.

Dieser Endpunkt gehoert nicht zum MVP, wird aber als zukuenftige Integrationsflaeche vorgemerkt.
