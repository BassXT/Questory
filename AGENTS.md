# AGENTS.md

Diese Datei beschreibt die Arbeitsweise fuer Codex und menschliche Mitentwickler im Questory-Projekt.

## Grundhaltung

- Arbeite in kleinen, nachvollziehbaren Schritten.
- Architekturentscheidungen werden dokumentiert, bevor sie sich im Code verfestigen.
- Keine Quick-and-Dirty-Loesungen.
- Keine grossen parallelen Baustellen.
- Nach relevanten Aenderungen muessen `PROJECT_STATE.md` und `CHANGELOG.md` aktualisiert werden.

## Reset-Regel

Nach einem Token-Reset oder Kontextverlust zuerst lesen:

1. `README.md`
2. `AGENTS.md`
3. `PROJECT_STATE.md`
4. `CHANGELOG.md`
5. `ARCHITECTURE.md`

Danach den Stand zusammenfassen und mit dem naechsten offenen Punkt aus `PROJECT_STATE.md` fortfahren.

## Coding Style

- TypeScript strikt verwenden.
- Klar benannte Module, Services, DTOs und Komponenten.
- Kleine, testbare Funktionen.
- Keine unnoetigen Abhaengigkeiten.
- Fehlerfaelle explizit behandeln.
- Kommentare nur dort, wo sie Komplexitaet erklaeren.
- Formatierung und Linting werden projektweit einheitlich eingerichtet.

## Backend-Regeln

- Framework: NestJS.
- ORM: Prisma.
- Datenbank: PostgreSQL.
- API-Stil: REST.
- Authentifizierung: JWT.
- Rollenbasierte Autorisierung fuer Administratoren, Eltern und Kinder.
- Businesslogik gehoert in Services, nicht in Controller.
- Validierung ueber DTOs und Pipes.
- Datenbankzugriff zentral ueber Prisma.

## Frontend-Regeln

- Framework: React mit TypeScript und Vite.
- UI: Material UI.
- Keine klassische To-do-Listen-Anmutung.
- Das Erlebnis soll hochwertig, freundlich, farbenfroh und modern wirken.
- Bedienung muss fuer Kinder intuitiv sein, aber nicht kleinkindlich.
- Responsive Layouts sind Pflicht.
- PWA-Faehigkeit wird vorbereitet.

## Namenskonventionen

- Dateien und Ordner: `kebab-case`
- React-Komponenten: `PascalCase`
- TypeScript-Typen und Interfaces: `PascalCase`
- Variablen und Funktionen: `camelCase`
- Konstanten: `UPPER_SNAKE_CASE`, wenn global und unveraenderlich
- Datenbanktabellen: Prisma-Modelle in `PascalCase`, relationale Felder sprechend benannt

## Projektregeln

- Jede relevante Aenderung wird im Changelog dokumentiert.
- Architekturentscheidungen werden in `ARCHITECTURE.md` oder `PROJECT_STATE.md` festgehalten.
- API-Aenderungen werden in `API.md` dokumentiert.
- Datenmodell-Aenderungen werden in `DATABASE.md` dokumentiert.
- Docker muss als primaerer Startpfad funktionieren.
- Tests werden passend zum Risiko der Aenderung ergaenzt.

## Definition of Done

Eine Aufgabe gilt erst als erledigt, wenn:

- die Aenderung implementiert ist,
- relevante Dokumentation aktualisiert wurde,
- ein sinnvoller Test oder eine nachvollziehbare manuelle Pruefung erfolgt ist,
- bekannte Einschraenkungen dokumentiert sind,
- der naechste sinnvolle Schritt benannt ist.
