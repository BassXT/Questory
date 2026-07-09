# PROJECT_STATE.md

Letzte Aktualisierung: 2026-07-09

Diese Datei ist die zentrale Fortsetzungsdatei fuer Questory. Sie beschreibt den aktuellen Projektstand, offene Aufgaben, Architekturentscheidungen und bekannte Probleme.

## Aktueller Projektstand

Das Repository wurde initialisiert, die grundlegende Projektdokumentation wurde angelegt und ein erstes Scaffold fuer Backend, Frontend, Prisma und Docker Compose existiert. Lokale Dependencies, Prisma Generate, Backend-Build, Frontend-Build und HTTP-Start wurden erfolgreich geprueft. Der Portainer Stack wurde auf dem Docker-LXC deployed und per HTTP geprueft. Docker ist lokal auf Windows weiterhin nicht im PATH verfuegbar.

## Bereits umgesetzt

- `README.md` mit Vision, Projektzielen, MVP, Stack, Roadmap und geplantem Docker-Start angelegt.
- `AGENTS.md` mit Arbeitsregeln, Reset-Regel, Coding Style und Definition of Done angelegt.
- `PROJECT_STATE.md` als zentrale Fortsetzungsdatei angelegt.
- `CHANGELOG.md` fuer chronologische Aenderungen angelegt.
- `ARCHITECTURE.md` mit initialem Architekturzielbild angelegt.
- `DATABASE.md` mit erstem Datenmodell-Entwurf angelegt.
- `API.md` mit erstem REST-API-Entwurf angelegt.
- Root-`package.json` mit npm-Workspaces fuer `apps/backend` und `apps/frontend` angelegt.
- `.env.example` und `.gitignore` angelegt.
- `docker-compose.yml` mit Services fuer PostgreSQL, Backend und Frontend angelegt.
- NestJS-Backend-Skelett unter `apps/backend` angelegt.
- Health-Endpunkt `GET /api/health` angelegt.
- Prisma-Schema mit MVP-Kernentities angelegt.
- React/Vite/Material-UI-Frontend-Skelett unter `apps/frontend` angelegt.
- Erste Questory-Startseite als visuelle Platzhalteroberflaeche angelegt.
- JSON-Syntax der drei `package.json` Dateien erfolgreich geprueft.
- `package-lock.json` erzeugt und Dependencies mit `npm ci` erfolgreich installiert.
- Prisma 7 kompatibel konfiguriert ueber `apps/backend/prisma.config.ts`.
- TypeScript fuer Tooling-Kompatibilitaet auf `5.9.3` gepinnt.
- `npm run prisma:generate` erfolgreich ausgefuehrt.
- `npm run build` erfolgreich ausgefuehrt.
- Backend lokal gestartet und `GET /api/health` erfolgreich per HTTP geprueft.
- Frontend lokal gestartet und per HTTP mit Status `200` geprueft.
- `.dockerignore` ergaenzt.
- Portainer-Stack-Datei unter `deploy/portainer/stack.yml` angelegt.
- `DEPLOYMENT.md` fuer Proxmox-LXC, Docker und Portainer angelegt.
- Dockerfiles auf reproduzierbare Builds mit `npm ci` und `package-lock.json` angepasst.
- Portainer-Build-Kontext auf `../..` korrigiert, weil Portainer relative Pfade vom Compose-Dateiordner aus aufloest.
- Portainer Stack auf dem Docker-LXC erfolgreich deployed.
- Frontend auf `http://192.168.1.98:5173` erfolgreich geprueft.
- Backend Health-Check auf `http://192.168.1.98:3001/api/health` erfolgreich geprueft.
- Backend-Port im LXC auf `3001` gesetzt, weil `3000` bereits belegt war.

## Offene Aufgaben

- Docker installieren oder sicherstellen, dass `docker` im PATH verfuegbar ist.
- Docker Compose Start pruefen.
- Erste Datenbankmigration fuer MVP-Entities erstellen.
- Authentifizierungs- und Rollenmodell implementieren.
- Erste API-Endpunkte fuer Familien, Benutzer und Kinder implementieren.
- Frontend-Grundlayout und Designsystem-Basis ausbauen.
- Erste Prisma-Migration fuer MVP-Entities erstellen und Datenbank-Migrationsfluss fuer Portainer klaeren.

## Naechster Schritt

Als naechstes die erste Prisma-Migration fuer die MVP-Entities erstellen und klaeren, wie Migrationen beim Portainer-Deployment ausgefuehrt werden.

## Architekturentscheidungen

- Questory wird als monorepo-artige Struktur mit getrennten Apps fuer Backend und Frontend aufgebaut.
- Backend wird mit NestJS umgesetzt, weil Module, Dependency Injection und klare Schichten gut zur langfristigen Wartbarkeit passen.
- Frontend wird mit React, TypeScript und Vite umgesetzt, weil die Kombination schnell, modern und gut fuer interaktive Oberflaechen geeignet ist.
- Material UI wird als UI-Basis genutzt, aber visuell in Richtung hochwertiges Familien-Spiel angepasst.
- PostgreSQL ist die primaere Datenbank.
- Prisma wird als ORM verwendet, um Schema, Migrationen und typisierten Datenzugriff zu buendeln.
- Authentifizierung erfolgt ueber JWT.
- Docker Compose ist der primaere lokale und self-hosted Startpfad.
- nginx bleibt optional und wird erst eingefuehrt, wenn ein konkretes Deployment-Szenario dokumentiert ist.
- Die erste Frontend-Oberflaeche nutzt Material UI und einfache CSS-Grid-Layouts, um nicht von experimentellen Layout-APIs abzuhaengen.
- Das aktuelle Scaffold wurde manuell erstellt, weil der NestJS-Generator wegen fehlendem Speicherplatz auf `C:` abgebrochen ist.
- Prisma 7 verwendet `prisma.config.ts`; die Datenbank-URL liegt nicht mehr in `schema.prisma`.
- TypeScript bleibt vorerst auf `5.9.3`, weil Nest CLI mit TypeScript 7 aktuell nicht sauber baut.
- Ziel-Deployment ist ein Proxmox-LXC. Die konkrete Betriebsart wird spaeter dokumentiert, voraussichtlich mit Docker/Podman im LXC oder Compose auf einer passenden Container-/VM-Umgebung.
- Fuer den Homelab-Start wird Portainer als Stack-Verwaltung genutzt.
- Portainer baut Questory aus dem Git-Repository mit `deploy/portainer/stack.yml`.

## Bekannte Probleme

- Docker wurde noch nicht verifiziert, weil `docker` lokal nicht als Befehl verfuegbar ist.
- `docker compose config` konnte nicht ausgefuehrt werden, weil `docker` nicht als Befehl verfuegbar ist.
- `npm audit` meldet 3 moderate Findings ueber `@hono/node-server`, transitiv ueber Prisma-Dev-Abhaengigkeiten. `npm audit fix --force` wuerde Prisma auf `6.19.3` downgraden und wird deshalb nicht automatisch ausgefuehrt.
- `npm ci` zeigt eine Engine-Warnung fuer `@prisma/streams-local`, weil diese transitive Prisma-Abhaengigkeit Node `>=22` erwartet. Build und Generate funktionieren unter Node `20.19.6`.
- Noch keine Tests vorhanden.
- Noch keine CI-Konfiguration vorhanden.
- Noch keine Prisma-Migration vorhanden.
- Port `3000` ist auf dem LXC bereits belegt; Questory nutzt fuer das Backend aktuell `3001`.

## Ideen fuer spaeter

- Badges
- Streaks
- Avatar-System
- Haustiere
- Abenteuerwelt
- Freischaltbare Gebiete
- Saisonale Events
- Wochenaufgaben
- Familien-Challenges
- Gluecksrad
- Taegliche Ueberraschungen
- Push-Benachrichtigungen
- Kalender
- Mehrsprachigkeit
- Home-Assistant-Integration
- ESP32 E-Ink Display API unter `/api/display/{childId}`
