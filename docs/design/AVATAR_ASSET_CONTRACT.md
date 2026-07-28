# Questory Complete Avatar Asset Contract

## Ziel

Questory verwendet einen einfachen 2D-Avatar-Picker aus genau zwei Bausteinen:

1. einer vollstaendig gezeichneten Kinderfigur
2. einem optionalen, separat gezeichneten Begleittier

Kopf, Haare, Gesicht und Kleidung werden nicht mehr zur Laufzeit aus einzelnen
Layern zusammengesetzt. Dadurch bleibt jeder Look grafisch konsistent und kann
ohne sichtbare Uebergaenge auf Desktop und Mobilgeraeten dargestellt werden.

## Laufzeit-Slots

`ChildAvatarLoadout.equippedItems` kennt fuer die aktive Werkstatt nur:

- `character`: Pflichtslot fuer eine komplette Kinderfigur
- `pet`: optionaler Slot fuer ein Begleittier

Alte Item-Keys und gespeicherte Loadout-Felder bleiben aus Datenkompatibilitaet
in PostgreSQL erhalten. Die Migration
`20260726234500_complete_avatar_presets` deaktiviert die alten Katalogeintraege,
ohne sie oder historische Kinder-Loadouts zu loeschen.

## Verbindliche Asset-Regeln

- Jede Kinderfigur zeigt genau ein Kind vollstaendig von Kopf bis Fuss.
- Jede Figur steht in einer neutralen Frontpose mit sichtbaren Haenden und Fuessen.
- Kinderfiguren liegen als transparente PNGs oder verlustfreie WebPs auf einer Leinwand von `768x1152`.
- Tiere liegen einzeln als transparente PNGs auf einer Leinwand von `640x640`.
- Innerhalb einer Assetgruppe sind Bodenlinie, Randabstand und Skalierung normalisiert.
- Ein Asset darf keinen Hintergrund, Schatten, Text, Schriftzug oder Wasserzeichen enthalten.
- Figuren und Tiere muessen dieselbe weiche, klar konturierte 2D-Abenteuerbildsprache verwenden.
- Neue Grafiken werden vor dem Import auf Alpha-Kanal, transparente Ecken,
  Beschnitt, Farbraender und mobile Lesbarkeit geprueft.

## Freischaltungen

Eine Figur ist immer vollstaendig. Frisur, Haarfarbe, Kleidung und Accessoires
sind Bestandteil des jeweiligen Presets. Neue Looks werden als Ganzes ueber
Level oder spaeter ueber besondere Erfolge freigeschaltet.

Die Stile `Smiley-Entdecker`, `Wirbelfrisur`, `Wald-Entdeckerin`,
`Sternen-Heldin` und `Zauberlehrling` besitzen je sechs frei waehlbare
Haarfarben. Auch diese Varianten sind
vollstaendige, flache Ganzkoerperbilder. Die Werkstatt gruppiert ihre
technischen Item-Keys lediglich als Stilkarte plus Farbfelder; sie legt im
Browser keine Haarmaske auf die Figur.

Der aktive Katalog verteilt:

- Smiley-Entdecker und Sternen-Heldin als geschlechtsspezifische Basis auf Level 1
- Wirbelfrisur und Wald-Entdeckerin auf Level 3
- Zauberlehrling auf Level 6
- Begleittiere auf Level 1 bis 10

Damit bleibt XP langfristig relevant, ohne einen technisch fragilen
Kleidungs-Layer-Editor zu betreiben.

## Bedienung

Die Werkstatt zeigt eine gemeinsame Vorschau und zwei Tabs:

- Figur
- Tier

Auf kleinen Displays werden die Auswahlkarten horizontal gewischt. Ab
Tabletbreite erscheinen sie in einem Raster. Ein Tier kann jederzeit wieder
abgelegt werden; eine Figur bleibt immer ausgeruestet.

## Asset-Herkunft

Die aktiven Produktionsgrafiken liegen unter
`apps/frontend/public/avatar-complete/v1` und
`apps/frontend/public/avatar-complete/v2`. Sie wurden fuer Questory mit dem
OpenAI-Bildgenerator aus einer projektintern freigegebenen, ebenfalls
KI-erzeugten Stilreferenz erstellt. Die Anwendung bindet keine externe
Avatar- oder Bild-API zur Laufzeit ein.

Die Stilreferenz bleibt unter
`docs/design/questory-avatar-style-reference.png` dokumentiert. Weitere
Details zum Erstellungs- und Normalisierungsprozess stehen in
`apps/frontend/public/avatar-complete/v1/SOURCE.md` und
`apps/frontend/public/avatar-complete/v2/SOURCE.md`. Die v2-Farbvarianten
werden reproduzierbar mit `scripts/generate-avatar-hair-variants.py` aus den
unveraenderten Ganzkoerper-Mastern exportiert. Der Git-Tag
`avatar-complete-v1` markiert den Rueckkehrpunkt vor diesem Pilot.
