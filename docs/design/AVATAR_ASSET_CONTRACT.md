# Questory 2D Avatar Asset Contract

## Ziel

Questory verwendet einen einfachen statischen 2D-Paper-Doll-Builder. Alle sichtbaren
Teile werden als transparente Bild-Layer auf exakt derselben Ganzkoerperpose
uebereinandergelegt. Eine 3D-Ansicht ist nicht Teil des Zielbilds.

## Verbindliche Asset-Regeln

- Jede Figur ist eine kindliche Ganzkoerperfigur in neutraler Frontpose.
- Alle Layer eines Figurensatzes besitzen dieselbe Leinwandgroesse und denselben Ursprung.
- Kein Layer darf seinen eigenen Kopf, Hals, Koerper oder Hintergrund mitbringen.
- Haare koennen aus einem Rueck- und einem Vorderlayer bestehen.
- Kleidung darf aus mehreren Ebenen bestehen, wenn Arme oder Haare davor und dahinter liegen.
- Junge, Maedchen und diverse Figuren duerfen eigene kompatible Layerkataloge verwenden.
- Farben sind frei waehlbar, soweit das Quellasset passende Varianten oder maskierbare Flaechen liefert.
- Level sperren besondere Stile und Gegenstaende, nicht grundlegende Haut-, Haar- oder Augenfarben.

## Laufzeit-Slots

Die bestehende API und `ChildAvatarLoadout` bleiben die fachliche Quelle. Der
Bildrenderer mappt die Slots auf folgende sichtbare Gruppen:

1. Szene
2. Begleiter hinten
3. Haar hinten
4. Basisfigur und Haut
5. Augenbrauen, Augen, Nase und Mund
6. Unterteil
7. Schuhe und Socken
8. Oberteil, Jacke oder Kleid
9. Haar vorne
10. Brille, Hut und Schmuck
11. Tasche, Handobjekt oder Gadget
12. Begleiter vorne

## Bedienung

Die mobile Werkstatt verwendet wenige, horizontal erreichbare Kategorien:

- Figur
- Gesicht
- Haare
- Kleidung
- Schuhe
- Extras
- Tiere

Jede Kategorie oeffnet einen kompakten Picker mit grossen Bildvorschauen. Farben
werden ueber Farbfelder gewaehlt. Die Ganzkoerpervorschau bleibt beim Wechsel der
Kategorie stabil sichtbar.

## Bevorzugte Quellassets

Die derzeit passendste gepruefte Quelle sind die Dress-up-Packs von Igor Galochkin:

- School Boy Character: https://igrastudios.itch.io/school-boy-character
- School Girl Character: https://igrastudios.itch.io/school-girl-character
- Anbieter und Lizenzhinweis: https://igrastudios.itch.io/

Die Packs liefern statische transparente `2048x2048`-PNGs und editierbare
Vektorquellen. Sie enthalten Basisfigur, Gesichtsteile, Haare, Kleidung, Schuhe,
Huete, Taschen und Handobjekte in einer gemeinsamen Pose. Die Quellassets duerfen
in Websites und Spielen verwendet, aber nicht als Rohasset weiterverteilt werden.

Die geprueften GraphicRiver-Kits `Children Avatar Creator Kit` und
`Kids Avatars Creator + 80 Ready Characters` sind fuer Questory nicht die erste
Wahl, weil sie Portrait- statt Ganzkoerper-Generatoren sind.

## Lizenz- und Repository-Regel

Das GitHub-Repository `BassXT/Questory` ist aktuell oeffentlich. Gekaufte
Quellassets oder daraus direkt extrahierbare Layer duerfen deshalb noch nicht
eingecheckt werden.

Vor dem Import muss eine der folgenden Bedingungen erfuellt sein:

1. Das Repository wird privat geschaltet.
2. Lizenzierte Assets werden ueber einen getrennten privaten Build-/Deploymentweg eingebunden.

Bis dahin liegen gekaufte ZIPs ausschliesslich lokal unter `private-assets/`.
Dieser Ordner wird von Git ignoriert.

## Import-Ablauf

1. Lizenz und Kaufbeleg zusammen mit dem Quellpaket archivieren.
2. ZIPs lokal unter `private-assets/avatar/source/` ablegen.
3. Dateistruktur, Leinwandgroesse und Layerreihenfolge automatisch inventarisieren.
4. Einen kleinen Referenzsatz importieren: Basisfigur, zwei Haare, zwei Gesichter,
   zwei Oberteile, zwei Unterteile und zwei Paar Schuhe.
5. Alle Kreuzkombinationen auf Desktop und iPhone visuell pruefen.
6. Erst nach erfolgreicher Referenzpruefung den restlichen Katalog importieren.
