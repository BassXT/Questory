# ARCHITECTURE.md

Dieses Dokument beschreibt das Architekturzielbild von Questory. Details werden mit der Implementierung fortlaufend ergaenzt.

## Gesamtuebersicht

Questory wird als self-hosted Webanwendung aufgebaut. Die Anwendung besteht aus einem React-Frontend, einer NestJS REST API und einer PostgreSQL-Datenbank.

Geplante Struktur:

```text
questory/
  apps/
    backend/
      prisma/
      src/
    frontend/
      public/
      src/
  docker-compose.yml
  .env.example
  README.md
  AGENTS.md
  PROJECT_STATE.md
  CHANGELOG.md
  ARCHITECTURE.md
  DATABASE.md
  API.md
```

Die Dokumentationsdateien bleiben im Repository-Root, damit sie nach einem Reset sofort gefunden werden.

## Backend

Technologien:

- Node.js
- NestJS
- TypeScript
- Prisma
- `@prisma/adapter-pg` fuer Prisma 7 PostgreSQL Runtime-Verbindungen
- PostgreSQL
- JWT

Geplante Schichten:

- Controller: REST-Endpunkte, Request/Response-Grenze
- DTOs: Validierung und Datenform der API
- Services: Businesslogik
- Repositories oder Prisma Services: Datenzugriff
- Guards: Authentifizierung und Autorisierung
- Modules: fachliche Kapselung

Aktuell vorhanden:

- `AppModule`
- `AppController`
- `AppService`
- `GET /api/health`
- `AuthModule` mit Registrierung, Login, JWT und Guards
- `FamiliesModule` fuer den aktuellen Familienkontext
- `UsersModule` fuer Benutzerliste und neue Eltern-/Kinderbenutzer
- `ChildrenModule` fuer Kinderprofile und kindbezogene Statistik-Read-Models
- `DashboardModule` fuer familienweite Startseiten-Read-Models
- `QuestsModule` fuer Quest-Vorlagen
- `QuestAssignmentsModule` fuer die Zuweisung von Quests an Kinder
- `RewardsModule` fuer Belohnungen im Familienshop
- `RewardRedemptionsController` im `RewardsModule` fuer Einloeseanfragen, Bestaetigung, Ablehnung und Ausgabe
- Prisma-Schema unter `apps/backend/prisma/schema.prisma`
- Prisma-CLI-Konfiguration unter `apps/backend/prisma.config.ts`

Geplante Backend-Module:

- `auth`: Login, JWT, Passwort-Hashing, Rollen
- `users`: Eltern, Kinder, Administratoren
- `families`: Familienkontext und Mitgliedschaften
- `quests`: Aufgaben, wiederkehrende Aufgaben, Abschluesse
- `rewards`: Belohnungen, Shop, Einloeseanfragen
- `progression`: XP, Muenzen, Level
- `stats`: Dashboard- und Statistikdaten
- `display`: spaetere Display-API fuer externe Geraete

## Frontend

Technologien:

- React
- TypeScript
- Vite
- Material UI

Ziel:

Das Frontend soll sich wie eine hochwertige, moderne Familien-Spieloberflaeche anfuehlen. Es soll freundlich und farbenfroh sein, ohne kleinkindlich zu wirken.

Geplante Bereiche:

- Login
- Familien-Dashboard
- Kinderprofil
- Quest-Board
- Aufgabenabschluss
- Eltern-Bestaetigung
- Reward-Shop
- Einloeseanfragen
- Statistiken
- Einstellungen

Aktuell vorhanden:

- Vite-App unter `apps/frontend`
- Material-UI-Theme unter `apps/frontend/src/theme.ts`
- Auth-/Dashboard-Grundlayout unter `apps/frontend/src/App.tsx`
- API-Anbindung ueber `VITE_API_BASE_URL`
- JWT-Session wird aktuell im Browser-`localStorage` gehalten

## Datenbank

Primaere Datenbank: PostgreSQL.

ORM: Prisma.

Das Prisma-Schema startet mit Familien, Benutzern, Kindern, Aufgaben, Aufgabenabschluessen, Belohnungen und Einloesungen. Erweiterungen wie Badges, Streaks und Sammelobjekte werden spaeter modular ergaenzt.

Prisma 7 nutzt `prisma.config.ts` fuer CLI-Konfiguration und Datenbank-URL. Deshalb enthaelt `schema.prisma` nur den Provider, nicht die Connection URL. Zur Laufzeit konstruiert der NestJS `PrismaService` den Client mit `PrismaPg` aus `@prisma/adapter-pg`.

Der Prisma Client Generator schreibt nach `apps/backend/src/generated/prisma`. Backend-Code importiert Prisma-Typen und `PrismaClient` ueber den stabilen Wrapper `apps/backend/src/prisma/client.ts`; Nest kopiert den generierten Client beim Build nach `dist/generated/prisma`. Dadurch haengt der Docker-Build nicht vom internen `@prisma/client/.prisma` Layout ab.

Details stehen in `DATABASE.md`.

## API

Die API wird als REST API umgesetzt.

Konventionen:

- Basis-Prefix: `/api`
- JSON als Request- und Response-Format
- JWT Bearer Token fuer geschuetzte Endpunkte
- Rollenbasierte Autorisierung
- Konsistente Fehlerformate
- Pagination fuer Listen, sobald Listen wachsen koennen

Details stehen in `API.md`.

## Authentifizierung

Questory nutzt JWT-basierte Authentifizierung.

Geplante Rollen:

- `ADMIN`
- `PARENT`
- `CHILD`

Kinderkonten koennen langfristig andere Login-Mechanismen erhalten als Elternkonten, zum Beispiel PIN oder familieninterne Auswahl. Fuer das MVP wird zunaechst ein einfaches, sicheres Rollenmodell vorbereitet.

Aktueller Stand:

- `JwtAuthGuard` prueft Bearer Tokens und haengt den aktuellen Benutzer an den Request.
- `RolesGuard` wertet `@Roles()` Metadata aus und begrenzt Aktionen auf erlaubte Rollen.
- Weitere Eltern und Kinderbenutzer koennen von `ADMIN` oder `PARENT` angelegt werden.
- Reine Kinderprofile ohne Login sind ebenfalls moeglich, damit Familien schon Fortschritt und Aufgaben modellieren koennen, bevor ein eigener Kinder-Login existiert.

## Docker

Docker Compose ist der primaere Startpfad.

Geplante Services:

- `db`: PostgreSQL
- `backend`: NestJS API
- `frontend`: React/Vite App
- optional `nginx`: Reverse Proxy

Aktuell umgesetzt:

- `db` nutzt `postgres:17-alpine`
- `backend` wird aus `apps/backend/Dockerfile` gebaut, nutzt Node Debian-slim Images, installiert OpenSSL und generiert Prisma Client im Runtime-Image
- `frontend` wird aus `apps/frontend/Dockerfile` gebaut und ueber nginx ausgeliefert
- Portainer-Stack liegt unter `deploy/portainer/stack.yml`

Die lokale Entwicklung soll mit einem Befehl startbar sein:

```bash
docker compose up --build
```

## Deployment

Ziel ist ein einfaches self-hosted Deployment auf einem privaten Server oder Homelab.

Das bevorzugte Ziel-Deployment ist ein Proxmox-LXC mit Docker und Portainer. Details stehen in `DEPLOYMENT.md`.

Vorgesehene Eigenschaften:

- Konfiguration ueber `.env`
- persistentes PostgreSQL-Volume
- reproduzierbarer Docker-Build
- optionaler nginx Reverse Proxy
- spaeter PWA-Unterstuetzung

## Architekturprinzipien

- Modularitaet vor frueher Optimierung.
- Fachliche Module statt technischer Sammelordner.
- Businesslogik testbar halten.
- API, Datenmodell und Architektur werden gemeinsam versioniert.
- Erweiterungen wie Badges oder Abenteuerwelt duerfen das MVP nicht verkomplizieren.
