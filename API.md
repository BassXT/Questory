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

### `POST /api/auth/child-login`

Meldet ein Kind ohne E-Mail-Adresse ueber Familiencode, Kinderprofil und PIN an.

Status: implementiert.

Geplanter Request:

```json
{
  "familyCode": "ABCD-1234",
  "childProfileId": "<child-profile-id>",
  "pin": "1234"
}
```

Response: wie `POST /api/auth/login`, aber mit Rolle `CHILD`, `email: null` und `id` als Kinderprofil-ID.

Hinweise:

- Der Familiencode kann spaeter als QR-Code oder kurze Login-URL angezeigt werden.
- Der Familiencode ist kein Passwort.
- Die PIN wird nur gehasht gespeichert.
- Kinder duerfen nach Login nur ihre eigenen Quests, ihren Shop und ihre eigenen Statistiken sehen.

### `GET /api/auth/child-login/{familyCode}/children`

Listet fuer einen Familiencode die fuer Kinderlogin freigegebenen Kinderprofile.

Status: implementiert.

Hinweise:

- Authentifizierung ist fuer diesen Endpunkt nicht erforderlich.
- Es werden nur Kinderprofile mit aktivierter PIN ausgegeben.
- Die Antwort enthaelt nur minimale Anzeigeinformationen: `id`, `displayName` und `avatarKey`.

## Families

### `GET /api/families/current`

Gibt den aktuellen Familienkontext zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

Response:

```json
{
  "id": "<family-id>",
  "name": "Familie Beispiel",
  "childLoginCode": "ABCD-1234",
  "createdAt": "2026-07-12T00:00:00.000Z",
  "updatedAt": "2026-07-12T00:00:00.000Z"
}
```

Hinweis: `childLoginCode` ist fuer bestehende Familien vor der Kinderlogin-Migration oder vor einer spaeteren Nachziehfunktion optional `null`.

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

Response enthaelt `pinEnabled` und `pinUpdatedAt`, aber niemals `pinHash`.

### `GET /api/children/{childId}`

Gibt ein Kinderprofil inklusive Fortschritt zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

### `POST /api/children/{childId}/pin`

Setzt oder ersetzt die Kinder-PIN fuer ein Kinderprofil.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Das Kinderprofil muss zur aktuellen Familie gehoeren.
- Die PIN muss aus 4 bis 12 Ziffern bestehen.
- Die PIN wird gehasht gespeichert.
- Die Response enthaelt `pinEnabled` und `pinUpdatedAt`, aber niemals `pinHash`.

Request:

```json
{
  "pin": "1234"
}
```

### `POST /api/children/{childId}/pin/disable`

Deaktiviert den Kinderlogin per PIN fuer ein Kinderprofil.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweis: Der gespeicherte PIN-Hash wird entfernt, `pinEnabled` wird auf `false` gesetzt.

### `PATCH /api/children/{childId}`

Aktualisiert ein Kinderprofil.

## Suggestions

### `GET /api/suggestions`

Listet kuratierte Systemvorschlaege fuer Quest-Vorlagen und Shop-Belohnungen.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Die Vorschlaege sind read-only und gehoeren nicht zu einer Familie.
- Das Frontend nutzt sie als Formularvorlagen; gespeichert wird erst ueber `POST /api/quests` oder `POST /api/rewards`.
- Die Bibliothek ist bewusst statisch im Backend versioniert, bis klar ist, ob Familien eigene Bibliotheken oder einen optionalen Generator pflegen sollen.
- Vorschlaege sind kategorisiert, damit das Frontend sie in einem kompakten Dialog filtern kann.

Response:

```json
{
  "rewards": [
    {
      "id": "ice-cream",
      "name": "Eis essen",
      "description": "Ein gemeinsamer Ausflug zur Eisdiele oder ein besonderes Eis zuhause.",
      "category": "Ausflug",
      "price": 20,
      "requiresApproval": true,
      "maxRedemptions": null
    }
  ],
  "quests": [
    {
      "id": "tidy-room",
      "title": "Zimmer aufraeumen",
      "description": "Spielzeug sortieren, Boden frei machen und sichtbare Sachen an ihren Platz legen.",
      "category": "Haushalt",
      "type": "ONE_TIME",
      "frequency": "NONE",
      "xpReward": 30,
      "coinReward": 6,
      "requiresApproval": true
    }
  ]
}
```

### `GET /api/suggestions/rewards`

Listet nur Shop-Belohnungsvorschlaege.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

### `GET /api/suggestions/quests`

Listet nur Quest-Vorlagenvorschlaege.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

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
- `isAssignable` steuert, ob Eltern die Quest manuell einem Kind zuweisen koennen.
- `isSelfService` steuert, ob Kinder die Quest ohne vorherige Zuweisung spontan einreichen koennen.

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
  "isAssignable": true,
  "isSelfService": false,
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

Hinweis: Die Antwort enthaelt die Zuweisung, eingebettete Quest-Daten und die neueste Completion im Feld `completions` mit maximal einem Eintrag. Dadurch kann das Frontend den aktuellen Status pro Zuweisung nach einem Reload anzeigen.

Beispiel:

```json
[
  {
    "id": "<assignment-id>",
    "questId": "<quest-id>",
    "childProfileId": "<child-profile-id>",
    "dueAt": "2026-07-16T12:00:00.000Z",
    "completions": [
      {
        "id": "<completion-id>",
        "status": "SUBMITTED",
        "submittedAt": "2026-07-11T20:30:00.000Z",
        "approvedAt": null,
        "rejectedAt": null,
        "rejectionReason": null,
        "xpGranted": 0,
        "coinsGranted": 0
      }
    ],
    "quest": {
      "id": "<quest-id>",
      "title": "Zimmer aufraeumen",
      "xpReward": 40,
      "coinReward": 8,
      "requiresApproval": true,
      "isActive": true
    }
  }
]
```

### `POST /api/quest-assignments`

Weist eine Quest einem Kind zu.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Quest und Kinderprofil muessen zur aktuellen Familie gehoeren.
- Inaktive Quests koennen nicht zugewiesen werden.
- Quests mit `isAssignable: false` koennen nicht manuell zugewiesen werden.
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

Response: Die erzeugte Completion mit Status `SUBMITTED`.

### `POST /api/quests/{questId}/self-service-completions`

Kind, Elternteil oder Admin reicht eine spontane Quest fuer ein Kind ein.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`, `CHILD`

Hinweise:

- Die Quest muss aktiv sein und `isSelfService: true` besitzen.
- Das Kinderprofil muss zur aktuellen Familie gehoeren.
- Kinder mit eigenem Login duerfen nur fuer das eigene Kinderprofil einreichen.
- Wenn schon eine Zuweisung fuer Quest und Kind existiert, wird sie wiederverwendet.
- Wenn keine Zuweisung existiert, wird intern eine Zuweisung ohne Faelligkeitsdatum angelegt.
- Einmalige spontane Quests blockieren weitere Einreichungen, sobald eine Einreichung `SUBMITTED` oder `APPROVED` ist.
- Wiederkehrende spontane Quests blockieren nur parallele offene Einreichungen mit Status `SUBMITTED`.

Request:

```json
{
  "childProfileId": "<child-profile-id>"
}
```

Response: Die erzeugte Completion mit Status `SUBMITTED`.

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
- `imageUrl` kann eine eigene Bild-URL oder eine vom Frontend-Motiv-Picker gesetzte MDI/Iconify-HTTPS-URL sein.
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
- Die Muenzen werden beim Beantragen oder direkten Einloesen sofort reserviert und vom Kinderprofil abgezogen.
- Bei `requiresApproval: true` wird eine Anfrage mit Status `REQUESTED` erstellt.
- Bei `requiresApproval: false` wird direkt eine Einloesung mit Status `APPROVED` erstellt.
- Bei Ablehnung oder Storno werden reservierte Muenzen wieder gutgeschrieben.
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
- Die Muenzen wurden bereits beim Beantragen reserviert; beim Bestaetigen werden keine weiteren Muenzen abgezogen.

### `POST /api/reward-redemptions/{redemptionId}/reject`

Eltern lehnen eine Belohnungsanfrage ab.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Einloesungen mit Status `REQUESTED` koennen abgelehnt werden.
- Die beim Beantragen reservierten Muenzen werden wieder gutgeschrieben.

Request:

```json
{
  "rejectionReason": "Heute passt es leider nicht."
}
```

### `POST /api/reward-redemptions/{redemptionId}/cancel`

Storniert eine noch nicht ausgegebene Belohnung.

Status: implementiert.

Auth: Bearer Token erforderlich.

Rollen: `ADMIN`, `PARENT`

Hinweise:

- Nur Einloesungen mit Status `REQUESTED` oder `APPROVED` koennen storniert werden.
- Stornierte Einloesungen erhalten Status `CANCELLED`.
- Die in `coinCost` reservierten Muenzen werden wieder gutgeschrieben.
- Einloesungen mit Status `REDEEMED` koennen nicht mehr storniert werden.

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
- `status`: filtert auf `REQUESTED`, `APPROVED`, `REJECTED`, `CANCELLED` oder `REDEEMED`.

## Dashboard und Statistiken

### `GET /api/dashboard`

Gibt Dashboard-Daten fuer den aktuellen Benutzer zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

Hinweise:

- Eltern/Admin erhalten eine Familienuebersicht.
- Kinder mit eigenem Login erhalten eine auf ihr Kinderprofil begrenzte Uebersicht.
- Der Endpunkt ist ein Read-Model fuer Startseiten und soll haeufig benoetigte Dashboard-Zahlen buendeln.

Response:

```json
{
  "family": {
    "id": "family-uuid",
    "name": "Familie Beispiel"
  },
  "scope": "FAMILY",
  "children": [
    {
      "id": "child-profile-uuid",
      "displayName": "Mika",
      "level": 1,
      "xp": 25,
      "coins": 14
    }
  ],
  "totals": {
    "children": 1,
    "parents": 1,
    "childUsers": 0,
    "activeQuests": 3,
    "activeRewards": 4,
    "xp": 25,
    "coins": 14
  },
  "quests": {
    "assigned": 1,
    "submitted": 0,
    "approved": 1,
    "rejected": 0,
    "totalCompletions": 1,
    "xpGranted": 25,
    "coinsGranted": 20
  },
  "rewards": {
    "requested": 1,
    "approved": 0,
    "redeemed": 1,
    "rejected": 1,
    "totalRedemptions": 3,
    "coinsSpent": 6
  }
}
```

### `GET /api/children/{childId}/stats`

Gibt Statistiken fuer ein Kind zurueck.

Status: implementiert.

Auth: Bearer Token erforderlich.

Hinweise:

- Das Kinderprofil muss zur aktuellen Familie gehoeren.
- Eltern/Admin koennen die Statistik jedes Kindes der Familie abrufen.
- Kinder mit eigenem Login koennen nur die eigene Statistik abrufen.
- `coinsSpent` zaehlt aktuell gebundene oder final ausgegebene Reward-Muenzen mit Status `REQUESTED`, `APPROVED` und `REDEEMED`. Bei `REJECTED` oder `CANCELLED` werden Muenzen zurueckgegeben und nicht mitgezaehlt.

Response:

```json
{
  "child": {
    "id": "child-profile-uuid",
    "displayName": "Mika",
    "level": 1,
    "xp": 40,
    "coins": 23
  },
  "progression": {
    "level": 1,
    "xp": 40,
    "coins": 23,
    "nextLevelXp": 100,
    "xpToNextLevel": 60
  },
  "quests": {
    "assigned": 3,
    "submitted": 1,
    "approved": 2,
    "rejected": 0,
    "totalCompletions": 3,
    "xpGranted": 40,
    "coinsGranted": 30
  },
  "rewards": {
    "requested": 1,
    "approved": 1,
    "redeemed": 1,
    "rejected": 0,
    "totalRedemptions": 3,
    "coinsSpent": 7
  }
}
```

## Display API fuer spaeter

### `GET /api/display/{childId}`

Gibt eine reduzierte JSON-Ausgabe fuer externe Displays zurueck.

Dieser Endpunkt gehoert nicht zum MVP, wird aber als zukuenftige Integrationsflaeche vorgemerkt.
