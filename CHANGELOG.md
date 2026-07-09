# CHANGELOG.md

Alle relevanten Aenderungen am Questory-Projekt werden in dieser Datei chronologisch dokumentiert.

Das Format orientiert sich an "Keep a Changelog". Versionen entstehen spaeter, sobald erste Releases geplant werden.

## Unreleased

### Added

- Initiale Projekt-Dokumentation angelegt.
- `README.md` mit Projektbeschreibung, Zielen, MVP, Stack und Roadmap erstellt.
- `AGENTS.md` mit Arbeitsregeln fuer Codex und Mitentwickler erstellt.
- `PROJECT_STATE.md` als zentrale Fortsetzungsdatei erstellt.
- `ARCHITECTURE.md` mit initialem Architekturzielbild erstellt.
- `DATABASE.md` mit erstem Datenmodell-Entwurf erstellt.
- `API.md` mit erstem REST-API-Entwurf erstellt.
- Root-Workspace mit `package.json` erstellt.
- `.env.example` und `.gitignore` erstellt.
- Docker Compose fuer PostgreSQL, Backend und Frontend erstellt.
- NestJS-Backend-Skelett mit Health-Endpunkt erstellt.
- Prisma-Schema fuer MVP-Kernentities erstellt.
- React/Vite/Material-UI-Frontend-Skelett mit erster Questory-Startseite erstellt.
- `package-lock.json` erzeugt und Dependencies erfolgreich installiert.
- Prisma 7 Konfiguration ueber `apps/backend/prisma.config.ts` ergaenzt.
- TypeScript fuer Backend und Frontend auf `5.9.3` gepinnt.
- Frontend-Typisierung fuer Material UI 9 angepasst.
- `.dockerignore` ergaenzt.
- Portainer-Stack-Datei unter `deploy/portainer/stack.yml` erstellt.
- `DEPLOYMENT.md` fuer Proxmox-LXC, Docker und Portainer erstellt.
- Dockerfiles auf `npm ci` und `package-lock.json` umgestellt.
- Portainer-Build-Kontext auf den Repository-Root korrigiert.

### Verified

- `npm ci` erfolgreich ausgefuehrt.
- `npm run prisma:generate` erfolgreich ausgefuehrt.
- `npm run build` erfolgreich ausgefuehrt.
- Backend lokal gestartet und `GET /api/health` erfolgreich geprueft.
- Frontend lokal gestartet und per HTTP mit Status `200` geprueft.

### Known Issues

- `docker compose config` konnte nicht verifiziert werden, weil die Docker-CLI lokal nicht verfuegbar ist.
- `npm audit` meldet 3 moderate Findings ueber eine transitive Prisma-Dev-Abhaengigkeit; automatisches Force-Fixing wuerde Prisma downgraden.
- `npm ci` meldet eine Node-Engine-Warnung fuer eine transitive Prisma-Abhaengigkeit, obwohl Build und Generate mit Node `20.19.6` funktionieren.
- Portainer-Deployment ist vorbereitet, aber noch nicht im LXC ausgefuehrt.
