# Questory 2D Avatar Asset Contract

## Ziel

Questory verwendet einen einfachen statischen 2D-Paper-Doll-Builder. Alle sichtbaren
Teile werden als transparente Bild-Layer auf exakt derselben Ganzkoerperpose
uebereinandergelegt. Eine 3D-Ansicht ist nicht Teil des Zielbilds.

## Verbindliche Asset-Regeln

- Jede Figur ist eine kindliche Ganzkoerperfigur in neutraler Frontpose.
- Alle zur Laufzeit gerenderten Layer eines Figurensatzes besitzen dieselbe
  Leinwandgroesse und denselben Ursprung. Einzelteil-Rigs duerfen beim Import
  ueber feste Anker in diese gemeinsame Questory-Leinwand normalisiert werden.
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

## Kostenlose Quellassets

Questory verwendet fuer den Avatar-Builder keine gekauften Assetpakete. Neue
Quellgrafiken muessen kostenlos und mit einer Repository-kompatiblen Lizenz
verfuegbar sein. Bevorzugt wird CC0.

Die technisch passendste gepruefte Quelle ist `Kenney Modular Characters`:

- Original: https://kenney.nl/assets/modular-characters
- Spiegel und Paketbeschreibung: https://opengameart.org/content/modular-character-pack
- Lizenz: Creative Commons Zero 1.0
- Inhalt: 425 getrennte PNG-Elemente, sechs Spritesheets und sechs Vektorquellen
- Kategorien: Haut, Gesicht, Haare, Oberteile, Hosen und Schuhe

Kenney liefert keine fertigen Ganzkoerper-Layer auf einer gemeinsamen Leinwand,
sondern ein modulares 2D-Rig aus einzelnen Koerper- und Kleidungsteilen. Questory
muss deshalb einmal feste Anker fuer Kopf, Hals, Schultern, Haende, Huefte und
Fuesse definieren. Danach bleiben alle vorgesehenen Kombinationen geometrisch
kompatibel.

Als kindlichere, aber deutlich einfachere Alternative wurde
`Free - Character Creation Asset Pack` von nemo geprueft:

- Quelle: https://nonemo.itch.io/character-creation-asset-pack
- Lizenz: Creative Commons Zero 1.0
- Inhalt: 45 Frisuren, 15 Augenstile, drei Hauttoene, Brillen und 28 Outfits

DiceBear und die geprueften GraphicRiver-Kits bleiben ungeeignet, weil sie
ueberwiegend Portrait- statt Ganzkoerper-Generatoren sind. Die zuvor betrachteten
kostenpflichtigen Dress-up-Packs werden nicht beschafft.

## Lizenz- und Repository-Regel

Das GitHub-Repository `BassXT/Questory` ist aktuell oeffentlich. Nur Assets mit
einer Lizenz, die Quellweitergabe erlaubt, duerfen eingecheckt werden. CC0-Assets
koennen zusammen mit ihrer unveraenderten Lizenzdatei im Repository liegen.

Kostenpflichtige Marketplace-Assets oder kostenlose Downloads mit einem
Weitergabeverbot sind ausgeschlossen.

## Import-Ablauf

1. Lizenz und Originalquelle dokumentieren.
2. Das unveraenderte Quellpaket in einem temporaeren Arbeitsordner pruefen.
3. Dateistruktur, Bildgroessen und benoetigte Rig-Anker automatisch inventarisieren.
4. Einen kleinen Referenzsatz importieren: Basisfigur, zwei Haare, zwei Gesichter,
   zwei Oberteile, zwei Unterteile und zwei Paar Schuhe.
5. Alle Kreuzkombinationen auf Desktop und iPhone visuell pruefen.
6. Erst nach erfolgreicher Referenzpruefung den restlichen Katalog importieren.
7. Lizenzdatei und Quellenhinweis zusammen mit den uebernommenen Assets einchecken.
