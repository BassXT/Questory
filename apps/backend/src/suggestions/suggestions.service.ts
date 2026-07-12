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
  }
];

const questSuggestions: QuestSuggestion[] = [
  {
    id: 'tidy-room',
    title: 'Zimmer aufraeumen',
    description: 'Spielzeug sortieren, Boden frei machen und sichtbare Sachen an ihren Platz legen.',
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
    type: QuestType.ONE_TIME,
    frequency: QuestFrequency.NONE,
    xpReward: 20,
    coinReward: 4,
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
