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
- Prisma Client Generator Output auf `apps/backend/src/generated/prisma` gesetzt und stabilen Backend-Wrapper fuer Prisma-Imports ergaenzt.
- TypeScript fuer Backend und Frontend auf `5.9.3` gepinnt.
- Frontend-Typisierung fuer Material UI 9 angepasst.
- `.dockerignore` ergaenzt.
- Portainer-Stack-Datei unter `deploy/portainer/stack.yml` erstellt.
- `DEPLOYMENT.md` fuer Proxmox-LXC, Docker und Portainer erstellt.
- Dockerfiles auf `npm ci` und `package-lock.json` umgestellt.
- Portainer-Build-Kontext auf den Repository-Root korrigiert.
- Erste Prisma-Migration `20260709120000_init` erstellt.
- Backend-Docker-Start fuehrt vor dem API-Start automatisch `prisma migrate deploy` aus.
- Prisma CLI und `dotenv` als Production-Dependencies fuer Runtime-Migrationen eingeordnet.
- PostgreSQL-Backup-Script fuer Portainer/LXC unter `deploy/portainer/backup-postgres.sh` erstellt.
- Backup-Strategie mit manuellem Aufruf, Cron-Beispiel, Retention und Restore-Hinweis dokumentiert.
- `.gitattributes` ergaenzt, damit Shell-Scripts mit LF-Line-Endings versioniert werden.
- Erster PostgreSQL-Backup-Test auf dem Docker-LXC erfolgreich ausgefuehrt.
- Cron-Vorlage `deploy/portainer/questory-backup.cron.example` fuer taegliche Backups erstellt.
- Taeglicher Backup-Cronjob auf dem Docker-LXC eingerichtet.
- Prisma-Service fuer NestJS erstellt.
- Prisma-Service fuer Prisma 7 mit PostgreSQL Driver Adapter `@prisma/adapter-pg` eingerichtet.
- Auth-Modul mit Registrierung, Login und `GET /api/auth/me` erstellt.
- JWT Guard fuer geschuetzte Endpunkte erstellt.
- Families-Modul mit `GET /api/families/current` erstellt.
- Users-Modul mit `GET /api/users` erstellt.
- Passwort-Hashing mit Node `crypto.scrypt` implementiert.
- Rollenbasierter `RolesGuard` und `@Roles()` Decorator erstellt.
- `POST /api/users` fuer neue Eltern- und Kinderbenutzer erstellt.
- Children-Modul mit `GET /api/children`, `POST /api/children` und `GET /api/children/:childId` erstellt.
- Quests-Modul mit `GET /api/quests`, `POST /api/quests` und `GET /api/quests/:questId` erstellt.
- QuestAssignments-Modul mit `POST /api/quest-assignments` und `GET /api/children/:childId/quest-assignments` erstellt.
- Quest-Abschluss-Endpunkt `POST /api/quest-assignments/:assignmentId/complete` erstellt.
- Quest-Bestaetigungs-Endpunkt `POST /api/quest-completions/:completionId/approve` mit XP-/Muenzen-Vergabe und Level-Neuberechnung erstellt.
- Quest-Ablehnungs-Endpunkt `POST /api/quest-completions/:completionId/reject` mit optionalem Ablehnungsgrund erstellt.
- Rewards-Modul mit `GET /api/rewards`, `POST /api/rewards` und `GET /api/rewards/:rewardId` erstellt.
- Reward-Shop-Endpunkt `GET /api/children/:childId/shop` erstellt.
- Reward-Einloesungs-Endpunkt `POST /api/rewards/:rewardId/redeem` erstellt.
- Reward-Einloesungsverwaltung fuer Eltern mit Listen, Bestaetigen, Ablehnen und Markieren als eingeloest erstellt.
- Kinder-Statistik-Endpunkt `GET /api/children/:childId/stats` erstellt.
- Dashboard-Summary-Endpunkt `GET /api/dashboard` erstellt.
- Frontend-Grundlayout mit Login, Registrierung, Session-Speicherung, Dashboard-Load, Refresh und Logout erstellt.
- Frontend-Kinderprofil-Workflow mit Kinderliste, Kinderanlage, Formular-Reset und Dashboard-Aktualisierung erstellt.
- Vite-Env-Typisierung fuer `import.meta.env` ergaenzt.
- Node-Docker-Build-Images auf `node:20-bookworm-slim` umgestellt, um Portainer-Builds robuster zu machen.
- Backend-Runtime-Dockerfile installiert OpenSSL und generiert Prisma Client fuer den Production-Container.
- `JwtAuthGuard` Provider-Export fuer Families/Users Module korrigiert.
- `JwtModule` Export fuer Feature-Module mit JWT Guards ergaenzt.

### Verified

- `npm ci` erfolgreich ausgefuehrt.
- `npm run prisma:generate` erfolgreich ausgefuehrt.
- `npm run build` erfolgreich ausgefuehrt.
- Backend lokal gestartet und `GET /api/health` erfolgreich geprueft.
- Frontend lokal gestartet und per HTTP mit Status `200` geprueft.
- Portainer Stack auf dem Docker-LXC erfolgreich deployed.
- LXC-Frontend unter `http://192.168.1.98:5173` erfolgreich geprueft.
- LXC-Backend-Health-Check unter `http://192.168.1.98:3001/api/health` erfolgreich geprueft.
- Prisma-Schema mit `prisma validate` erfolgreich validiert.
- Prisma Client mit `npm run prisma:generate` erfolgreich generiert.
- Portainer Stack nach Einfuehrung der ersten Prisma-Migration erneut deployed.
- LXC-Frontend und LXC-Backend-Health-Check nach Redeploy erneut erfolgreich geprueft.
- Portainer-Backend-Logs bestaetigen, dass Migration `20260709120000_init` erfolgreich angewendet wurde und die NestJS API gestartet ist.
- Backup-Datei `/opt/questory/backups/questory-postgres-20260709-164536.dump` erfolgreich erstellt.
- Backend-Build nach Auth/Families/Users-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Auth/Families/Users-Slice erfolgreich.
- LXC-API-Tests fuer Registrierung, Login, `auth/me`, aktuelle Familie und Benutzerliste erfolgreich ausgefuehrt.
- Prisma Client nach User-/Children-Slice erfolgreich generiert.
- Prisma-Schema nach User-/Children-Slice erfolgreich validiert.
- Backend- und Frontend-Build nach User-/Children-Slice erfolgreich ausgefuehrt.
- Portainer-Redeploy nach User-/Children-Slice erfolgreich.
- LXC-API-Tests fuer neue Eltern, Kinderbenutzer, Kinderprofile, Kinderliste und Kinderprofil-Einzelabruf erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Quest-Modul-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Quest-Slice erfolgreich.
- LXC-API-Tests fuer Quest-Erstellung, Quest-Liste, Quest-Einzelabruf und ungueltige Quest-Frequenz-Kombination erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Quest-Zuweisungs-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Quest-Zuweisungs-Slice erfolgreich.
- LXC-API-Tests fuer Quest-Zuweisung, Kinder-Zuweisungsliste und doppelte Quest-Zuweisung erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Quest-Abschluss-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Quest-Abschluss-Slice erfolgreich.
- LXC-API-Tests fuer Quest-Abschluss-Einreichung, `SUBMITTED` Status, noch nicht vergebene XP/Muenzen und doppelte Einreichung erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Quest-Bestaetigungs-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Quest-Bestaetigungs-Slice erfolgreich.
- LXC-API-Tests fuer Quest-Bestaetigung, XP-/Muenzen-Vergabe, Level-Neuberechnung und doppelte Bestaetigung erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Quest-Ablehnungs-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Quest-Ablehnungs-Slice erfolgreich.
- LXC-API-Tests fuer Quest-Ablehnung, Ablehnungsgrund, keine XP-/Muenzen-Vergabe, erneute Einreichung und doppelte Ablehnung erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Reward-Modul-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Reward-Slice erfolgreich.
- LXC-API-Tests fuer Reward-Erstellung, Reward-Liste, Reward-Einzelabruf und ungueltige Reward-Eingaben erfolgreich ausgefuehrt.
- Backend- und Frontend-Build nach Reward-Shop-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Reward-Shop-Slice erfolgreich.
- LXC-API-Tests fuer Reward-Shop, aktive Rewards, Ausschluss inaktiver Rewards, Sortierung und unbekanntes Kind erfolgreich ausgefuehrt.
- Prisma-Schema nach Reward-Einloesungs-Implementierung erfolgreich validiert.
- Backend- und Frontend-Build nach Reward-Einloesungs-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Reward-Einloesungs-Slice erfolgreich.
- LXC-API-Tests fuer Reward-Einloesung, `REQUESTED`-Anfragen, direkte `APPROVED`-Einloesungen, Coin-Abzug, Einloesungslimit und unzureichende Muenzen erfolgreich ausgefuehrt.
- Prisma-Schema nach Reward-Einloesungsverwaltungs-Implementierung erfolgreich validiert.
- Backend- und Frontend-Build nach Reward-Einloesungsverwaltungs-Implementierung erfolgreich ausgefuehrt.
- Prisma Client nach expliziter Output-Pfad-Konfiguration erfolgreich neu generiert.
- Backend-Build mit generiertem Prisma Client unter `dist/generated/prisma` erfolgreich geprueft.
- Portainer-Redeploy nach Prisma-/Reward-Einloesungsverwaltungs-Fix erfolgreich.
- LXC-API-Tests fuer Reward-Einloesungsverwaltung, Listen, Bestaetigung, Ablehnung, Markierung als eingeloest, Coin-Abzug und ungueltige Statuswechsel erfolgreich ausgefuehrt.
- Prisma-Schema nach Kinder-Statistik-Implementierung erfolgreich validiert.
- Backend-Build nach Kinder-Statistik-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Kinder-Statistik-Slice erfolgreich.
- LXC-API-Test fuer Kinder-Statistik mit Quest-Fortschritt, XP, Coins, Reward-Ausgaben, Reward-Statuszaehlern und unbekanntem Kind erfolgreich ausgefuehrt.
- Prisma-Schema nach Dashboard-Summary-Implementierung erfolgreich validiert.
- Backend-Build nach Dashboard-Summary-Implementierung erfolgreich ausgefuehrt.
- Portainer-Redeploy nach Dashboard-Summary-Slice erfolgreich.
- LXC-API-Test fuer Dashboard-Summary mit Familienuebersicht, Quest-Fortschritt, XP, Coins, aktiven Rewards, Reward-Ausgaben und offenen Reward-Anfragen erfolgreich ausgefuehrt.
- Frontend-Build nach Auth-/Dashboard-Grundlayout erfolgreich ausgefuehrt.
- Lokaler Browser-Test des Frontends gegen das LXC-Backend erfolgreich: Registrierung, Dashboard, Reload-Session, Logout/Login und mobile Ansicht ohne horizontalen Overflow.
- Portainer-Redeploy nach Frontend-Grundlayout-Slice erfolgreich.
- LXC-Browser-Test des Frontends unter `http://192.168.1.98:5173` erfolgreich: Registrierung, Dashboard, Reload-Session, Logout/Login und mobile Ansicht ohne horizontalen Overflow.
- Frontend-Build nach Kinderprofil-Workflow erfolgreich ausgefuehrt.
- Lokaler Browser-Test des Kinderprofil-Workflows gegen das LXC-Backend erfolgreich: Kind anlegen, Dashboard-/Kinderzaehler aktualisieren, Reload und mobile Ansicht ohne horizontalen Overflow.
- Portainer-Redeploy nach Frontend-Kinderprofil-Slice erfolgreich.
- LXC-Browser-Test des Kinderprofil-Workflows unter `http://192.168.1.98:5173` erfolgreich: Registrierung, Kind anlegen, Dashboard-/Kinderzaehler aktualisieren, Reload und mobile Ansicht ohne horizontalen Overflow.

### Fixed

- Prisma Client Importpfad fuer Portainer/Docker-Builds stabilisiert, damit `npm run build -w apps/backend` nicht vom internen `@prisma/client/.prisma` Layout abhaengt.

### Known Issues

- `docker compose config` konnte nicht verifiziert werden, weil die Docker-CLI lokal nicht verfuegbar ist.
- `npm audit` meldet 3 moderate Findings ueber eine transitive Prisma-Dev-Abhaengigkeit; automatisches Force-Fixing wuerde Prisma downgraden.
- `npm ci` meldet eine Node-Engine-Warnung fuer eine transitive Prisma-Abhaengigkeit, obwohl Build und Generate mit Node `20.19.6` funktionieren.
- Port `3000` ist auf dem LXC bereits belegt; das Questory-Backend nutzt aktuell `3001`.
- Lokaler Migration-Drift-Vergleich aus dem Migrationsordner benoetigt eine Shadow-Datenbank und wurde deshalb noch nicht ausgefuehrt.
