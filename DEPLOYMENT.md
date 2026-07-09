# DEPLOYMENT.md

Dieses Dokument beschreibt den geplanten Deployment-Weg fuer Questory.

Primaeres Ziel fuer das Homelab-Deployment:

- Proxmox LXC
- Docker im LXC
- Portainer zur Stack-Verwaltung

## Zielarchitektur

Questory laeuft als Portainer Stack mit drei Services:

- `db`: PostgreSQL
- `backend`: NestJS REST API
- `frontend`: React-App, ausgeliefert ueber nginx

Persistente Daten liegen in einem Docker Volume:

- `questory-postgres-data`

## Voraussetzungen

Auf dem Docker-LXC muessen verfuegbar sein:

```bash
docker --version
docker compose version
```

Portainer ist im Homelab erreichbar unter:

```text
https://192.168.1.98:9443/
```

## Portainer Stack

Die Portainer-Stack-Datei liegt unter:

```text
deploy/portainer/stack.yml
```

Dieser Stack baut Backend und Frontend aus dem Repository. Dafuer muss Portainer Zugriff auf das Git-Repository haben.

Moegliche Wege:

- Repository auf GitHub/Gitea/GitLab veroeffentlichen und in Portainer als Git Stack hinterlegen.
- Privates Repository mit SSH-Key in Portainer verbinden.
- Alternativ spaeter Images bauen und in eine Registry pushen; dann nutzt Portainer nur fertige Images.

Der empfohlene erste Weg ist ein Git-basierter Portainer Stack.

## Portainer UI Ablauf

1. In Portainer anmelden.
2. Gewuenschte Docker-Environment auswaehlen.
3. `Stacks` oeffnen.
4. `Add stack` waehlen.
5. Name setzen:

```text
questory
```

6. Als Build-Methode `Repository` beziehungsweise Git-Repository auswaehlen.
7. Repository-URL eintragen.
8. Compose-Pfad setzen:

```text
deploy/portainer/stack.yml
```

Der Build-Kontext in der Stack-Datei ist `../..`, weil Portainer relative Pfade vom Ordner der Compose-Datei `deploy/portainer/` aus aufloest. Damit zeigen die Docker-Builds auf den Repository-Root.

9. Environment Variables setzen.
10. Stack deployen.

## Environment Variables

Minimal benoetigt:

```text
POSTGRES_DB=questory
POSTGRES_USER=questory
POSTGRES_PASSWORD=<strong-random-password>
JWT_SECRET=<strong-random-secret>
BACKEND_PORT=3000
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://192.168.1.98:3000/api
```

Fuer Produktion oder dauerhaften Familienbetrieb muessen `POSTGRES_PASSWORD` und `JWT_SECRET` starke, eindeutige Werte sein.

## Aktuelles LXC-Deployment

Der erste Portainer-Deploy auf dem Docker-LXC ist erfolgreich. Da Port `3000` auf dem LXC bereits belegt war, nutzt Questory aktuell:

```text
BACKEND_PORT=3001
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://192.168.1.98:3001/api
```

Gepruefte URLs:

- Frontend: `http://192.168.1.98:5173`
- Backend Health-Check: `http://192.168.1.98:3001/api/health`

## Standard-URLs nach Deployment

Wenn die Standardports verwendet werden:

- Frontend: `http://192.168.1.98:5173`
- Backend Health-Check: `http://192.168.1.98:3000/api/health`

## Reverse Proxy

Ein Reverse Proxy ist fuer den MVP-Start optional.

Spaeter sinnvolle Varianten:

- Portainer Stack hinter vorhandenem Reverse Proxy
- nginx
- Caddy
- Traefik

Wenn eine Domain genutzt wird, sollte das Frontend spaeter ueber HTTPS erreichbar sein und `VITE_API_BASE_URL` auf die oeffentliche API-URL zeigen.

## Datenbank und Backups

PostgreSQL-Daten liegen im Docker Volume:

```text
questory-postgres-data
```

Backups muessen spaeter separat eingerichtet werden. Fuer den Familienbetrieb ist mindestens ein regelmaessiger Datenbankdump sinnvoll.

Beispiel fuer spaeter:

```bash
docker exec <postgres-container> pg_dump -U questory questory > questory-backup.sql
```

## Migrationen

Prisma-Migrationen liegen unter:

```text
apps/backend/prisma/migrations
```

Der Backend-Container fuehrt beim Start automatisch aus:

```bash
npm run prisma:deploy -w apps/backend
```

Erst danach startet die NestJS API. Wenn eine Migration fehlschlaegt, startet der Backend-Container nicht erfolgreich. In Portainer sind dann die Backend-Logs die erste Stelle fuer die Fehlersuche.

Aktuelle erste Migration:

```text
20260709120000_init
```

## Aktueller Status

Lokal wurden erfolgreich geprueft:

```bash
npm ci
npm run prisma:generate
npm run build
```

Lokal noch nicht geprueft:

```bash
docker compose config
docker compose up --build
```

Grund: Auf der aktuellen Windows-Entwicklungsumgebung ist `docker` nicht als Befehl verfuegbar.

Auf dem Proxmox Docker-LXC wurde der Portainer Stack erfolgreich deployed und per HTTP geprueft.

Der Stack wurde nach Einfuehrung der ersten Prisma-Migration erneut deployed. Danach waren Backend Health-Check und Frontend weiterhin erreichbar:

- Backend Health-Check: `http://192.168.1.98:3001/api/health`
- Frontend: `http://192.168.1.98:5173`

Die Backend-Logs bestaetigen, dass Prisma die Migration `20260709120000_init` erfolgreich angewendet hat und die NestJS API danach gestartet ist.

## Naechste Deployment-Schritte

1. Backup-Strategie fuer PostgreSQL definieren.
2. Danach erste fachliche Backend-Module fuer Auth, Familien und Benutzer planen.
