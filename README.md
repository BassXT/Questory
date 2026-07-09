# Questory

Questory ist eine self-hosted Familien-Webanwendung, die Kindern alltaegliche Aufgaben spielerisch naeherbringt. Die App soll sich wie ein modernes Spiel anfuehlen, nicht wie eine klassische To-do-Liste.

Das Projekt ist als Open-Source-Anwendung geplant und wird schrittweise, dokumentiert und Docker-first entwickelt.

## Projektziele

- Familien koennen Eltern- und Kinderprofile verwalten.
- Kinder erledigen Quests und erhalten XP, Muenzen und Fortschritt.
- Eltern bestaetigen Aufgaben und verwalten Belohnungen.
- Ein Belohnungsshop motiviert durch einloesbare Rewards.
- Die Architektur bleibt modular, testbar und langfristig wartbar.
- Die Anwendung ist responsive und spaeter PWA-faehig.

## MVP

Der erste Release umfasst:

- Kinder anlegen
- Eltern anlegen
- Aufgaben anlegen
- Wiederkehrende Aufgaben
- Einmalige Aufgaben
- Aufgaben erledigen
- Aufgaben bestaetigen
- XP vergeben
- Muenzen vergeben
- Level automatisch berechnen
- Belohnungen anlegen
- Belohnungsshop
- Belohnung beantragen
- Belohnung einloesen
- Dashboard
- Statistiken

## Technologiestack

Backend:

- Node.js
- NestJS
- Prisma
- PostgreSQL
- JWT-Authentifizierung

Frontend:

- React
- TypeScript
- Vite
- Material UI

Deployment:

- Docker Compose
- Optional nginx als Reverse Proxy

## Installation

Die Grundstruktur fuer Backend, Frontend und Docker Compose ist angelegt.

Lokaler Start:

```bash
git clone <repository-url>
cd questory
cp .env.example .env
npm install
npm run dev
```

Docker-Start:

```bash
cp .env.example .env
docker compose up --build
```

Hinweis: `npm ci`, `npm run prisma:generate` und `npm run build` wurden lokal erfolgreich geprueft. Docker konnte noch nicht lokal geprueft werden, weil `docker` nicht als Befehl verfuegbar war.

## Docker-Start

Docker Compose wird die folgenden Services enthalten:

- `backend`: NestJS API
- `frontend`: React/Vite Web-App
- `db`: PostgreSQL
- optional `nginx`: Reverse Proxy fuer produktionsnahe Deployments

Der geplante Startbefehl lautet:

```bash
docker compose up --build
```

Nach erfolgreichem Start:

- Frontend: `http://localhost:5173`
- Backend Health-Check: `http://localhost:3000/api/health`

## Roadmap

Phase 1: Projektbasis

- Dokumentationsstruktur anlegen
- Architekturentscheidungen festhalten
- Backend-, Frontend- und Docker-Scaffold erstellen
- Lokale Entwicklungsumgebung verifizieren

Status: Dokumentationsstruktur und Scaffold sind angelegt. Lokale Installation, Prisma Generate, Backend-Build, Frontend-Build und HTTP-Start wurden geprueft. Die Docker-Verifikation ist wegen fehlender Docker-CLI noch offen.

Phase 2: MVP-Grundlagen

- Authentifizierung und Rollenmodell
- Familien-, Eltern- und Kinderprofile
- Quest- und Aufgabenverwaltung
- Abschluss- und Bestaetigungsworkflow

Phase 3: Motivation und Shop

- XP, Level und Muenzen
- Belohnungen und Reward-Shop
- Einloeseanfragen und Bestaetigung
- Dashboard und einfache Statistiken

Phase 4: Spielwelt-Ausbau

- Badges
- Streaks
- Avatare
- Sammelobjekte
- Abenteuerwelt
- PWA-Funktionen

## Projekt-Dokumentation

Wichtige Dateien:

- `AGENTS.md`: Arbeitsregeln fuer Codex und Mitentwickler
- `PROJECT_STATE.md`: Aktueller Stand und naechste Schritte
- `CHANGELOG.md`: Chronologische Aenderungen
- `ARCHITECTURE.md`: Architekturuebersicht
- `DATABASE.md`: Datenmodell
- `API.md`: REST-API-Dokumentation
- `DEPLOYMENT.md`: Deployment mit Docker, Portainer und Proxmox-LXC

`PROJECT_STATE.md` ist die zentrale Fortsetzungsdatei und muss nach jeder relevanten Aenderung aktualisiert werden.
