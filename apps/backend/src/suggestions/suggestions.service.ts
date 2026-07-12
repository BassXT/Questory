import { Injectable } from '@nestjs/common';
import { QuestFrequency, QuestType } from '../prisma/client';

export interface RewardSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  requiresApproval: boolean;
  maxRedemptions: number | null;
}

export interface QuestSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  type: QuestType;
  frequency: QuestFrequency;
  xpReward: number;
  coinReward: number;
  requiresApproval: boolean;
}

const rewardSuggestions: RewardSuggestion[] = [
  {
    id: 'ice-cream',
    name: 'Eis essen',
    description: 'Ein gemeinsamer Ausflug zur Eisdiele oder ein besonderes Eis zuhause.',
    category: 'Ausflug',
    price: 20,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'switch-30',
    name: '30 Minuten Switch',
    description: 'Zusaetzliche Spielzeit fuer die Konsole nach Elternfreigabe.',
    category: 'Medienzeit',
    price: 30,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'movie-night',
    name: 'Filmabend',
    description: 'Das Kind darf einen passenden Film fuer den Familienabend aussuchen.',
    category: 'Familienzeit',
    price: 45,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'wish-dinner',
    name: 'Wunschessen',
    description: 'Ein frei waehlbares Lieblingsessen in der naechsten Woche.',
    category: 'Essen',
    price: 50,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'stay-up-15',
    name: '15 Minuten laenger wach bleiben',
    description: 'Ein kleiner Abendbonus an einem passenden Tag.',
    category: 'Bonuszeit',
    price: 25,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'choose-board-game',
    name: 'Brettspiel aussuchen',
    description: 'Das Kind bestimmt das naechste gemeinsame Spiel.',
    category: 'Familienzeit',
    price: 15,
    requiresApproval: false,
    maxRedemptions: null
  },
  {
    id: 'small-surprise',
    name: 'Kleine Ueberraschung',
    description: 'Eine kleine, vorher abgesprochene Ueberraschung aus der Familien-Schatzkiste.',
    category: 'Sammeln',
    price: 35,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'playground-trip',
    name: 'Spielplatz-Ausflug',
    description: 'Ein geplanter Ausflug zu einem Lieblingsspielplatz.',
    category: 'Ausflug',
    price: 40,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'pancake-breakfast',
    name: 'Pfannkuchen-Fruehstueck',
    description: 'Am Wochenende gibt es ein besonderes Fruehstueck nach Wunsch.',
    category: 'Essen',
    price: 55,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'pizza-night',
    name: 'Pizzaabend',
    description: 'Ein Pizzaabend mit gemeinsam ausgesuchten Belaegen.',
    category: 'Essen',
    price: 60,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'dessert-choice',
    name: 'Nachtisch aussuchen',
    description: 'Das Kind entscheidet ueber einen passenden Nachtisch.',
    category: 'Essen',
    price: 25,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'audio-story',
    name: 'Extra Hoergeschichte',
    description: 'Eine zusaetzliche Hoergeschichte vor dem Schlafen.',
    category: 'Abend',
    price: 18,
    requiresApproval: false,
    maxRedemptions: null
  },
  {
    id: 'bedtime-story-choice',
    name: 'Vorlesebuch bestimmen',
    description: 'Das Kind waehlt das Buch fuer die gemeinsame Vorlesezeit.',
    category: 'Abend',
    price: 15,
    requiresApproval: false,
    maxRedemptions: null
  },
  {
    id: 'family-bike-tour',
    name: 'Familien-Radtour',
    description: 'Eine geplante Radtour mit kurzer Pause an einem Lieblingsort.',
    category: 'Ausflug',
    price: 70,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'library-trip',
    name: 'Bibliotheksbesuch',
    description: 'Gemeinsam neue Buecher oder Hoerspiele aussuchen.',
    category: 'Ausflug',
    price: 35,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'swimming-trip',
    name: 'Schwimmbad-Ausflug',
    description: 'Ein Familienausflug ins Schwimmbad, wenn es zeitlich passt.',
    category: 'Ausflug',
    price: 90,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'craft-kit',
    name: 'Bastelset nutzen',
    description: 'Ein kleines Bastelprojekt aus vorhandenen Materialien aussuchen.',
    category: 'Kreativ',
    price: 30,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'lego-challenge',
    name: 'Lego-Challenge mit Eltern',
    description: 'Eine gemeinsame Bau-Challenge mit einem kleinen Thema.',
    category: 'Kreativ',
    price: 35,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'paint-afternoon',
    name: 'Malnachmittag',
    description: 'Zeit fuer Farben, Papier und ein ruhiges Kreativprojekt.',
    category: 'Kreativ',
    price: 30,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'garden-choice',
    name: 'Pflanze aussuchen',
    description: 'Eine kleine Pflanze oder Samen fuer Balkon, Garten oder Fensterbank aussuchen.',
    category: 'Natur',
    price: 45,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'picnic',
    name: 'Mini-Picknick',
    description: 'Ein kleines Picknick im Garten, Park oder Wohnzimmer.',
    category: 'Familienzeit',
    price: 40,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'choose-music',
    name: 'Musik im Auto bestimmen',
    description: 'Das Kind waehlt fuer eine passende Fahrt die Musik aus.',
    category: 'Bonuszeit',
    price: 10,
    requiresApproval: false,
    maxRedemptions: null
  },
  {
    id: 'extra-playdate',
    name: 'Freund einladen',
    description: 'Ein Treffen mit einem Freund oder einer Freundin planen.',
    category: 'Freizeit',
    price: 80,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'parkour-at-home',
    name: 'Wohnzimmer-Parcours',
    description: 'Ein sicherer Bewegungsparcours mit Elternfreigabe.',
    category: 'Bewegung',
    price: 25,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'treasure-box-pick',
    name: 'Schatzkisten-Auswahl',
    description: 'Ein kleines Teil aus einer vorbereiteten Schatzkiste aussuchen.',
    category: 'Sammeln',
    price: 28,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'sticker-pack',
    name: 'Stickerbogen',
    description: 'Ein kleiner Stickerbogen oder eine vorhandene Sammelkarte.',
    category: 'Sammeln',
    price: 22,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'screen-time-15',
    name: '15 Minuten Medienzeit',
    description: 'Kurze Zusatzzeit fuer eine abgesprochene App, Serie oder ein Spiel.',
    category: 'Medienzeit',
    price: 18,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'screen-time-45',
    name: '45 Minuten Medienzeit',
    description: 'Laengere Zusatzzeit fuer einen passenden Tag.',
    category: 'Medienzeit',
    price: 45,
    requiresApproval: true,
    maxRedemptions: null
  },
  {
    id: 'choose-weekend-activity',
    name: 'Wochenend-Aktivitaet waehlen',
    description: 'Das Kind sucht aus zwei bis drei passenden Familienoptionen aus.',
    category: 'Familienzeit',
    price: 75,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'parent-child-time',
    name: '1:1 Zeit mit Mama oder Papa',
    description: 'Eine feste Zeit nur mit einem Elternteil und einer passenden Aktivitaet.',
    category: 'Familienzeit',
    price: 65,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'museum-visit',
    name: 'Museum oder Ausstellung',
    description: 'Ein Ausflug zu einem kindgerechten Museum oder einer Ausstellung.',
    category: 'Ausflug',
    price: 95,
    requiresApproval: true,
    maxRedemptions: 1
  },
  {
    id: 'toy-allowance-small',
    name: 'Kleines Extra-Budget',
    description: 'Ein kleiner Zuschuss fuer ein vorher abgesprochenes Spielzeug oder Heft.',
    category: 'Sammeln',
    price: 100,
    requiresApproval: true,
    maxRedemptions: 1
  }
];

const questSuggestions: QuestSuggestion[] = [
  {
    id: 'tidy-room',
    title: 'Zimmer aufraeumen',
    description: 'Spielzeug sortieren, Boden frei machen und sichtbare Sachen an ihren Platz legen.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 30,
    coinReward: 6,
    requiresApproval: true
  },
  {
    id: 'brush-teeth-evening',
    title: 'Abends Zaehne putzen',
    description: 'Zaehne gruendlich putzen und danach kurz Bescheid sagen.',
    category: 'Routine',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 10,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'school-bag',
    title: 'Schulranzen vorbereiten',
    description: 'Hefte, Buecher, Federmappe und Trinkflasche fuer den naechsten Tag pruefen.',
    category: 'Schule',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'set-table',
    title: 'Tisch decken',
    description: 'Teller, Besteck und Glaeser fuer die Familie vorbereiten.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'laundry-basket',
    title: 'Waesche in den Korb bringen',
    description: 'Getragene Kleidung einsammeln und in den Waeschekorb legen.',
    category: 'Haushalt',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.WEEKLY,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'read-15',
    title: '15 Minuten lesen',
    description: 'In einem Buch, Comic oder Hoerlesebuch konzentriert dranbleiben.',
    category: 'Lernen',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'help-pet',
    title: 'Beim Haustier helfen',
    description: 'Futter, Wasser oder eine kleine Pflegeaufgabe nach Absprache uebernehmen.',
    category: 'Verantwortung',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 25,
    coinReward: 5,
    requiresApproval: true
  },
  {
    id: 'clear-desk',
    title: 'Schreibtisch startklar machen',
    description: 'Arbeitsflaeche freiraeumen und Schulsachen ordentlich bereitlegen.',
    category: 'Schule',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'make-bed',
    title: 'Bett machen',
    description: 'Decke richten, Kissen ordnen und Schlafplatz ordentlich hinterlassen.',
    category: 'Routine',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 8,
    coinReward: 1,
    requiresApproval: true
  },
  {
    id: 'morning-ready',
    title: 'Morgenroutine schaffen',
    description: 'Anziehen, waschen, Zaehne putzen und Tasche mitnehmen.',
    category: 'Routine',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'clear-plate',
    title: 'Geschirr wegraeumen',
    description: 'Eigenen Teller, Glas und Besteck nach dem Essen wegbringen.',
    category: 'Haushalt',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 8,
    coinReward: 1,
    requiresApproval: true
  },
  {
    id: 'empty-dishwasher',
    title: 'Spuelmaschine ausraeumen',
    description: 'Ungefaehrliche Teile aus der Spuelmaschine an ihren Platz stellen.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 25,
    coinReward: 5,
    requiresApproval: true
  },
  {
    id: 'trash-help',
    title: 'Beim Muell helfen',
    description: 'Eine passende Muellaufgabe uebernehmen, zum Beispiel Papier sammeln.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'water-plants',
    title: 'Pflanzen giessen',
    description: 'Ausgewaehlte Pflanzen mit der richtigen Menge Wasser versorgen.',
    category: 'Natur',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.WEEKLY,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'homework-start',
    title: 'Hausaufgaben starten',
    description: 'Arbeitsplatz vorbereiten und die erste Aufgabe konzentriert beginnen.',
    category: 'Schule',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'homework-pack',
    title: 'Hausaufgaben einpacken',
    description: 'Fertige Hefte, Mappen und Materialien wieder in die Tasche legen.',
    category: 'Schule',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 12,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'practice-instrument',
    title: 'Instrument ueben',
    description: 'Eine kurze, vorher abgesprochene Uebungseinheit absolvieren.',
    category: 'Lernen',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 25,
    coinReward: 5,
    requiresApproval: true
  },
  {
    id: 'vocabulary-10',
    title: '10 Minuten Vokabeln',
    description: 'Vokabeln wiederholen oder Lernkarten durchgehen.',
    category: 'Lernen',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'sport-20',
    title: '20 Minuten Bewegung',
    description: 'Draussen spielen, tanzen, Rad fahren oder eine passende Bewegungseinheit machen.',
    category: 'Bewegung',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'stretch-break',
    title: 'Bewegungspause',
    description: 'Eine kurze Pause mit Dehnen, Huepfen oder Lockerungsuebungen.',
    category: 'Bewegung',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 10,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'help-cooking',
    title: 'Beim Kochen helfen',
    description: 'Eine sichere Aufgabe in der Kueche uebernehmen.',
    category: 'Familie',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 25,
    coinReward: 5,
    requiresApproval: true
  },
  {
    id: 'help-shopping-list',
    title: 'Einkaufsliste mitpruefen',
    description: 'Nachsehen, ob ein abgesprochener Vorrat fehlt.',
    category: 'Familie',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 12,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'kindness-note',
    title: 'Freundliche Tat',
    description: 'Jemandem in der Familie bewusst helfen oder etwas Nettes tun.',
    category: 'Sozial',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'sibling-help',
    title: 'Geschwister helfen',
    description: 'Eine kleine, faire Hilfe fuer Bruder oder Schwester uebernehmen.',
    category: 'Sozial',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'screen-off-ready',
    title: 'Medienzeit gut beenden',
    description: 'Geraet rechtzeitig ausschalten und ohne Streit weglegen.',
    category: 'Medien',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'charge-device',
    title: 'Geraet laden und wegraeumen',
    description: 'Tablet, Controller oder anderes Geraet an den Ladeplatz legen.',
    category: 'Medien',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 10,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'toy-reset',
    title: 'Spielbereich zuruecksetzen',
    description: 'Nach dem Spielen den Bereich wieder benutzbar machen.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'closet-check',
    title: 'Kleiderschrank ordnen',
    description: 'Ein Fach oder eine kleine Schublade gemeinsam sortieren.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 35,
    coinReward: 7,
    requiresApproval: true
  },
  {
    id: 'weekly-room-reset',
    title: 'Wochen-Reset im Zimmer',
    description: 'Einmal pro Woche Bett, Boden, Schreibtisch und Waesche checken.',
    category: 'Haushalt',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.WEEKLY,
    xpReward: 45,
    coinReward: 9,
    requiresApproval: true
  },
  {
    id: 'pack-sports-bag',
    title: 'Sporttasche packen',
    description: 'Sportkleidung, Flasche und benoetigte Sachen pruefen.',
    category: 'Schule',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'prepare-clothes',
    title: 'Kleidung vorbereiten',
    description: 'Passende Kleidung fuer den naechsten Tag herauslegen.',
    category: 'Routine',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.DAILY,
    xpReward: 10,
    coinReward: 2,
    requiresApproval: true
  },
  {
    id: 'shower-ready',
    title: 'Duschen ohne Erinnerung',
    description: 'Nach Absprache selbststaendig duschen und Sachen wegraeumen.',
    category: 'Routine',
    type: QuestType.RECURRING,
    frequency: QuestFrequency.CUSTOM,
    xpReward: 20,
    coinReward: 4,
    requiresApproval: true
  },
  {
    id: 'craft-cleanup',
    title: 'Bastelplatz aufraeumen',
    description: 'Papier, Stifte, Kleber und Reste nach dem Basteln sortieren.',
    category: 'Kreativ',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 18,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'book-shelf',
    title: 'Buecher sortieren',
    description: 'Buecher ins Regal stellen und Lieblingsbuch bereitlegen.',
    category: 'Lernen',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 15,
    coinReward: 3,
    requiresApproval: true
  },
  {
    id: 'garden-help',
    title: 'Im Garten helfen',
    description: 'Eine kleine Aufgabe wie giessen, sammeln oder fegen uebernehmen.',
    category: 'Natur',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 25,
    coinReward: 5,
    requiresApproval: true
  },
  {
    id: 'car-cleanup',
    title: 'Auto mit aufraeumen',
    description: 'Eigene Sachen, Papier oder Flaschen aus dem Auto mitnehmen.',
    category: 'Haushalt',
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 12,
    coinReward: 2,
    requiresApproval: true
  }
];

@Injectable()
export class SuggestionsService {
  listSuggestions() {
    return {
      rewards: rewardSuggestions,
      quests: questSuggestions
    };
  }

  listRewardSuggestions() {
    return rewardSuggestions;
  }

  listQuestSuggestions() {
    return questSuggestions;
  }
}
