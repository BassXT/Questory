import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { AvatarBuilderPanel, AvatarResponse } from './avatar-builder';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
const TOKEN_STORAGE_KEY = 'questory.accessToken';

type AuthMode = 'login' | 'register' | 'child';
type DashboardTab = 'overview' | 'children' | 'avatar' | 'quests' | 'shop' | 'approvals';
type ShopTab = 'shop' | 'manage';
type QuestType = 'ONE_TIME' | 'RECURRING';
type QuestFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'CUSTOM';
type QuestCompletionStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';

interface AuthUser {
  id: string;
  familyId: string;
  email: string | null;
  displayName: string;
  role: 'ADMIN' | 'PARENT' | 'CHILD';
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface ChildLoginProfile {
  id: string;
  displayName: string;
  avatarKey: string | null;
}

interface DashboardChild {
  id: string;
  displayName: string;
  avatarKey: string | null;
  gender: string | null;
  birthDate: string | null;
  pinEnabled: boolean;
  pinUpdatedAt: string | null;
  level: number;
  xp: number;
  coins: number;
}

interface DashboardResponse {
  family: {
    id: string;
    name: string;
  };
  scope: 'FAMILY' | 'CHILD';
  children: DashboardChild[];
  totals: {
    children: number;
    parents: number;
    childUsers: number;
    activeQuests: number;
    activeRewards: number;
    xp: number;
    coins: number;
  };
  quests: {
    assigned: number;
    submitted: number;
    approved: number;
    rejected: number;
    totalCompletions: number;
    xpGranted: number;
    coinsGranted: number;
  };
  rewards: {
    requested: number;
    approved: number;
    redeemed: number;
    rejected: number;
    cancelled: number;
    totalRedemptions: number;
    coinsSpent: number;
  };
}

interface ChildProfile {
  id: string;
  familyId: string;
  userId: string | null;
  displayName: string;
  avatarKey: string | null;
  gender: string | null;
  birthDate: string | null;
  pinEnabled: boolean;
  pinUpdatedAt: string | null;
  level: number;
  xp: number;
  coins: number;
  createdAt: string;
  updatedAt: string;
}

interface ChildStatsResponse {
  child: ChildProfile;
  progression: {
    level: number;
    xp: number;
    coins: number;
    nextLevelXp: number;
    xpToNextLevel: number;
  };
  quests: {
    assigned: number;
    submitted: number;
    approved: number;
    rejected: number;
    totalCompletions: number;
    xpGranted: number;
    coinsGranted: number;
  };
  rewards: {
    requested: number;
    approved: number;
    redeemed: number;
    rejected: number;
    cancelled: number;
    totalRedemptions: number;
    coinsSpent: number;
  };
}

interface QuestTemplate {
  id: string;
  familyId: string;
  title: string;
  description: string | null;
  type: QuestType;
  frequency: QuestFrequency;
  xpReward: number;
  coinReward: number;
  requiresApproval: boolean;
  isActive: boolean;
  isAssignable: boolean;
  isSelfService: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestAssignment {
  id: string;
  questId: string;
  childProfileId: string;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  completions?: QuestCompletionSummary[];
  quest: {
    id: string;
    title: string;
    description: string | null;
    type: QuestType;
    frequency: QuestFrequency;
    xpReward: number;
    coinReward: number;
    requiresApproval: boolean;
    isActive: boolean;
    isAssignable: boolean;
    isSelfService: boolean;
  };
}

interface QuestCompletionSummary {
  id: string;
  status: QuestCompletionStatus;
  submittedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  xpGranted: number;
  coinsGranted: number;
}

interface Reward {
  id: string;
  familyId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  price: number;
  isActive: boolean;
  requiresApproval: boolean;
  maxRedemptions: number | null;
  createdAt: string;
  updatedAt: string;
}

type RewardRedemptionStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REDEEMED';

interface RewardRedemption {
  id: string;
  rewardId: string;
  childProfileId: string;
  status: RewardRedemptionStatus;
  requestedAt: string;
  approvedAt: string | null;
  approvedByUserId: string | null;
  redeemedAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;
  rejectionReason: string | null;
  coinCost: number;
  reward: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    category: string | null;
    price: number;
    requiresApproval: boolean;
  };
  childProfile: {
    id: string;
    displayName: string;
    coins: number;
  };
}

interface RewardSuggestion {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  requiresApproval: boolean;
  maxRedemptions: number | null;
}

interface QuestSuggestion {
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

interface SuggestionLibraryResponse {
  rewards: RewardSuggestion[];
  quests: QuestSuggestion[];
}

interface AuthFormState {
  familyName: string;
  displayName: string;
  email: string;
  password: string;
}

interface ChildLoginFormState {
  familyCode: string;
  childProfileId: string;
  pin: string;
}

interface ChildFormState {
  displayName: string;
  gender: string;
  birthDate: string;
}

interface ChildPinFormState {
  childProfileId: string;
  pin: string;
}

interface QuestFormState {
  title: string;
  description: string;
  type: QuestType;
  frequency: QuestFrequency;
  xpReward: string;
  coinReward: string;
  requiresApproval: boolean;
  isAssignable: boolean;
  isSelfService: boolean;
  isActive: boolean;
}

interface QuestAssignmentFormState {
  childProfileId: string;
  questId: string;
  dueAt: string;
}

interface RewardFormState {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: string;
  isActive: boolean;
  requiresApproval: boolean;
  maxRedemptions: string;
}

const initialAuthForm: AuthFormState = {
  familyName: '',
  displayName: '',
  email: '',
  password: ''
};

const initialChildLoginForm: ChildLoginFormState = {
  familyCode: '',
  childProfileId: '',
  pin: ''
};

const initialChildForm: ChildFormState = {
  displayName: '',
  gender: 'UNSPECIFIED',
  birthDate: ''
};

const initialChildPinForm: ChildPinFormState = {
  childProfileId: '',
  pin: ''
};

const initialQuestForm: QuestFormState = {
  title: '',
  description: '',
  type: 'ONE_TIME',
  frequency: 'NONE',
  xpReward: '25',
  coinReward: '5',
  requiresApproval: true,
  isAssignable: true,
  isSelfService: false,
  isActive: true
};

const initialQuestAssignmentForm: QuestAssignmentFormState = {
  childProfileId: '',
  questId: '',
  dueAt: ''
};

const initialRewardForm: RewardFormState = {
  name: '',
  description: '',
  imageUrl: '',
  category: '',
  price: '10',
  isActive: true,
  requiresApproval: true,
  maxRedemptions: ''
};

const emptySuggestions: SuggestionLibraryResponse = {
  rewards: [],
  quests: []
};

interface AvatarPreset {
  key: string;
  label: string;
  role: string;
  initials: string;
  primary: string;
  secondary: string;
}

interface AvatarUnlock {
  level: number;
  label: string;
  slot: string;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  { key: 'trail-scout', label: 'Pfadfinder', role: 'Natur & Mut', initials: 'PF', primary: '#2568d8', secondary: '#2f8f6f' },
  { key: 'star-maker', label: 'Sternenschmied', role: 'Kreativ & Ruhm', initials: 'SS', primary: '#7a5ccf', secondary: '#d04c73' },
  { key: 'river-runner', label: 'Flussläufer', role: 'Fokus & Tempo', initials: 'FL', primary: '#188dd8', secondary: '#38a6a5' },
  { key: 'ember-crafter', label: 'Funkenbauer', role: 'Bauen & Energie', initials: 'FB', primary: '#d87532', secondary: '#ca9b23' },
  { key: 'cloud-tamer', label: 'Wolkenzähmer', role: 'Ruhe & Fantasie', initials: 'WZ', primary: '#587087', secondary: '#9c4dcc' },
  { key: 'gadget-hero', label: 'Gadget-Held', role: 'Technik & Tricks', initials: 'GH', primary: '#496ec8', secondary: '#607d8b' },
  { key: 'garden-keeper', label: 'Gartenhüter', role: 'Natur & Pflege', initials: 'GH', primary: '#3a8d4a', secondary: '#a9792b' },
  { key: 'moon-rider', label: 'Mondreiter', role: 'Abend & Abenteuer', initials: 'MR', primary: '#5264b8', secondary: '#6a5acd' }
];

const AVATAR_UNLOCKS: AvatarUnlock[] = [
  { level: 2, label: 'Abenteuer-Mütze', slot: 'Outfit' },
  { level: 3, label: 'Sticker-Rucksack', slot: 'Gadget' },
  { level: 4, label: 'Helden-Cape', slot: 'Outfit' },
  { level: 5, label: 'Sternen-Kompass', slot: 'Gadget' },
  { level: 7, label: 'Forscherjacke', slot: 'Outfit' },
  { level: 9, label: 'Leuchtende Schuhe', slot: 'Outfit' },
  { level: 12, label: 'Mini-Drone', slot: 'Gadget' },
  { level: 15, label: 'Legendenset', slot: 'Set' }
];

interface RewardVisualOption {
  id: string;
  label: string;
  category: string;
  icon: string;
  color: string;
  keywords: string[];
  url: string;
}

const REWARD_VISUAL_OPTIONS = [
  { id: 'ice-cream', label: 'Eis essen', category: 'Leckereien', icon: 'ice-cream', color: 'd45aa4', keywords: ['eis', 'ice', 'dessert'] },
  { id: 'pizza', label: 'Pizza', category: 'Leckereien', icon: 'pizza', color: 'd96b24', keywords: ['pizza', 'essen'] },
  { id: 'wish-dinner', label: 'Wunschessen', category: 'Leckereien', icon: 'silverware-fork-knife', color: '2f8f6f', keywords: ['wunschessen', 'essen', 'restaurant'] },
  { id: 'popcorn', label: 'Popcorn', category: 'Leckereien', icon: 'popcorn', color: 'c9951a', keywords: ['popcorn', 'kino', 'film'] },
  { id: 'cupcake', label: 'Cupcake', category: 'Leckereien', icon: 'cupcake', color: 'c45f8c', keywords: ['kuchen', 'cupcake', 'muffin'] },
  { id: 'candy', label: 'Süßigkeit', category: 'Leckereien', icon: 'candy', color: 'bd4c9b', keywords: ['suess', 'bonbon', 'candy'] },
  { id: 'cookie', label: 'Keks', category: 'Leckereien', icon: 'cookie', color: '9b6a36', keywords: ['keks', 'cookie'] },
  { id: 'smoothie', label: 'Lieblingsdrink', category: 'Leckereien', icon: 'cup', color: '2d8fb8', keywords: ['drink', 'saft', 'smoothie'] },
  { id: 'switch-time', label: 'Switch-Zeit', category: 'Medienzeit', icon: 'nintendo-switch', color: 'e14545', keywords: ['switch', 'nintendo', 'konsole'] },
  { id: 'gamepad', label: 'Gaming-Zeit', category: 'Medienzeit', icon: 'gamepad-variant', color: '4f5bd5', keywords: ['gaming', 'spiel', 'zocken', 'konsole'] },
  { id: 'movie-night', label: 'Filmabend', category: 'Medienzeit', icon: 'movie-open', color: '6a5acd', keywords: ['film', 'kino', 'movie'] },
  { id: 'tablet-time', label: 'Tablet-Zeit', category: 'Medienzeit', icon: 'tablet-cellphone', color: '2568d8', keywords: ['tablet', 'app', 'medien'] },
  { id: 'headphones', label: 'Hörgeschichte', category: 'Medienzeit', icon: 'headphones', color: '217c8f', keywords: ['hoerbuch', 'geschichte', 'musik'] },
  { id: 'tv', label: 'Serienfolge', category: 'Medienzeit', icon: 'television-classic', color: '5d6978', keywords: ['serie', 'tv', 'fernsehen'] },
  { id: 'music', label: 'Musikzeit', category: 'Medienzeit', icon: 'music', color: '9c4dcc', keywords: ['musik', 'song'] },
  { id: 'camera', label: 'Foto-Mission', category: 'Medienzeit', icon: 'camera', color: '6f7a87', keywords: ['foto', 'kamera'] },
  { id: 'playground', label: 'Spielplatz', category: 'Ausflug', icon: 'slide', color: 'e38b29', keywords: ['spielplatz', 'rutsche', 'ausflug'] },
  { id: 'swim', label: 'Schwimmen', category: 'Ausflug', icon: 'swim', color: '188dd8', keywords: ['schwimmen', 'bad', 'pool'] },
  { id: 'bike', label: 'Radtour', category: 'Ausflug', icon: 'bicycle', color: '2f8f6f', keywords: ['rad', 'fahrrad', 'tour'] },
  { id: 'forest', label: 'Waldabenteuer', category: 'Ausflug', icon: 'forest', color: '3a8d4a', keywords: ['wald', 'abenteuer', 'natur'] },
  { id: 'tent', label: 'Picknick', category: 'Ausflug', icon: 'tent', color: 'd87532', keywords: ['picknick', 'camping', 'zelt'] },
  { id: 'museum', label: 'Museum', category: 'Ausflug', icon: 'bank', color: '7d6a3b', keywords: ['museum', 'ausstellung'] },
  { id: 'train', label: 'Zugfahrt', category: 'Ausflug', icon: 'train', color: '4d72c8', keywords: ['zug', 'bahn', 'fahrt'] },
  { id: 'map', label: 'Mini-Reise', category: 'Ausflug', icon: 'map-marker-path', color: 'c9583b', keywords: ['reise', 'ausflug', 'karte'] },
  { id: 'paint', label: 'Malen', category: 'Kreativ', icon: 'palette', color: 'd04c73', keywords: ['malen', 'kunst', 'farbe'] },
  { id: 'puzzle', label: 'Bauen', category: 'Kreativ', icon: 'puzzle', color: 'ca9b23', keywords: ['bauen', 'lego', 'puzzle'] },
  { id: 'crafts', label: 'Bastelzeit', category: 'Kreativ', icon: 'content-cut', color: '2e9f9c', keywords: ['basteln', 'schere'] },
  { id: 'book', label: 'Buch aussuchen', category: 'Kreativ', icon: 'book-open-page-variant', color: '7a5ccf', keywords: ['buch', 'lesen'] },
  { id: 'story', label: 'Geschichtenzeit', category: 'Kreativ', icon: 'book-heart', color: 'bf4d74', keywords: ['geschichte', 'vorlesen'] },
  { id: 'microphone', label: 'Karaoke', category: 'Kreativ', icon: 'microphone-variant', color: '8b55c9', keywords: ['karaoke', 'singen'] },
  { id: 'brush', label: 'Kreativ-Projekt', category: 'Kreativ', icon: 'brush', color: 'd6603a', keywords: ['projekt', 'kreativ'] },
  { id: 'blocks', label: 'Bausteine', category: 'Kreativ', icon: 'toy-brick', color: '3578c8', keywords: ['bausteine', 'lego'] },
  { id: 'gift', label: 'Geschenk', category: 'Extras', icon: 'gift', color: 'd63f61', keywords: ['geschenk', 'ueberraschung'] },
  { id: 'treasure', label: 'Schatzkiste', category: 'Extras', icon: 'treasure-chest', color: 'a9792b', keywords: ['schatz', 'kiste', 'loot'] },
  { id: 'sticker', label: 'Sticker', category: 'Extras', icon: 'sticker', color: '38a6a5', keywords: ['sticker', 'sammeln'] },
  { id: 'star', label: 'Sternbonus', category: 'Extras', icon: 'star-four-points', color: 'd2a818', keywords: ['stern', 'bonus'] },
  { id: 'badge', label: 'Abzeichen', category: 'Extras', icon: 'shield-star', color: '496ec8', keywords: ['badge', 'abzeichen'] },
  { id: 'sparkle', label: 'Überraschung', category: 'Extras', icon: 'auto-fix', color: '8e59cf', keywords: ['ueberraschung', 'magie'] },
  { id: 'coins', label: 'Bonus-Münzen', category: 'Extras', icon: 'hand-coin', color: 'c99719', keywords: ['muenzen', 'bonus'] },
  { id: 'ticket', label: 'Extra-Ticket', category: 'Extras', icon: 'ticket-confirmation', color: 'd15d39', keywords: ['ticket', 'gutschein'] },
  { id: 'family', label: 'Familienzeit', category: 'Gemeinsam', icon: 'account-group', color: '276d84', keywords: ['familie', 'gemeinsam'] },
  { id: 'board-game', label: 'Spieleabend', category: 'Gemeinsam', icon: 'dice-multiple', color: '7f5cc4', keywords: ['spieleabend', 'brettspiel', 'wuerfel'] },
  { id: 'home-cinema', label: 'Kuschelabend', category: 'Gemeinsam', icon: 'sofa', color: '9b6b55', keywords: ['kuscheln', 'sofa'] },
  { id: 'restaurant', label: 'Restaurant', category: 'Gemeinsam', icon: 'food', color: 'c26b38', keywords: ['restaurant', 'essen'] },
  { id: 'calendar', label: 'Wunsch-Tag', category: 'Gemeinsam', icon: 'calendar-star', color: '3878c5', keywords: ['tag', 'wunsch'] },
  { id: 'walk', label: 'Spaziergang', category: 'Gemeinsam', icon: 'walk', color: '49905a', keywords: ['spaziergang', 'laufen'] },
  { id: 'garden', label: 'Gartenzeit', category: 'Gemeinsam', icon: 'flower-tulip', color: '4b9c61', keywords: ['garten', 'blumen'] },
  { id: 'heart', label: 'Eltern-Kind-Zeit', category: 'Gemeinsam', icon: 'heart', color: 'c84e70', keywords: ['eltern', 'kind', 'zeit'] },
  { id: 'timer', label: 'Extra-Zeit', category: 'Zeitbonus', icon: 'timer-sand', color: '2f7fc0', keywords: ['zeit', 'extra'] },
  { id: 'sleep-in', label: 'Länger wach', category: 'Zeitbonus', icon: 'weather-night', color: '5264b8', keywords: ['wach', 'abend'] },
  { id: 'alarm-off', label: 'Langsamer Morgen', category: 'Zeitbonus', icon: 'alarm-off', color: 'ad7e28', keywords: ['morgen', 'ausschlafen'] },
  { id: 'pause', label: 'Pause-Karte', category: 'Zeitbonus', icon: 'pause-circle', color: '607d8b', keywords: ['pause', 'joker'] },
  { id: 'choice', label: 'Du entscheidest', category: 'Zeitbonus', icon: 'gesture-tap-button', color: '348985', keywords: ['entscheiden', 'wahl'] },
  { id: 'bath', label: 'Schaumbad', category: 'Zeitbonus', icon: 'bathtub', color: '4ba4d8', keywords: ['bad', 'schaumbad'] },
  { id: 'sprout', label: 'Pflanzen-Projekt', category: 'Lernen', icon: 'sprout', color: '3d9144', keywords: ['pflanzen', 'lernen'] },
  { id: 'rocket', label: 'Experiment', category: 'Lernen', icon: 'rocket-launch', color: 'd24a42', keywords: ['experiment', 'forschen'] },
  { id: 'school', label: 'Lern-Abenteuer', category: 'Lernen', icon: 'school', color: '3467b7', keywords: ['lernen', 'schule'] },
  { id: 'telescope', label: 'Sterne schauen', category: 'Lernen', icon: 'telescope', color: '4d5ab9', keywords: ['sterne', 'weltraum'] },
  { id: 'magnify', label: 'Forscherauftrag', category: 'Lernen', icon: 'magnify-scan', color: '527c66', keywords: ['forschen', 'auftrag'] },
  { id: 'robot', label: 'Technikzeit', category: 'Lernen', icon: 'robot-happy', color: '587087', keywords: ['technik', 'roboter'] }
].map((option) => ({ ...option, url: createMdiIconUrl(option.icon, option.color) })) satisfies RewardVisualOption[];

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [form, setForm] = useState<AuthFormState>(initialAuthForm);
  const [childLoginForm, setChildLoginForm] = useState<ChildLoginFormState>(initialChildLoginForm);
  const [childLoginProfiles, setChildLoginProfiles] = useState<ChildLoginProfile[]>([]);
  const [childForm, setChildForm] = useState<ChildFormState>(initialChildForm);
  const [childPinForm, setChildPinForm] = useState<ChildPinFormState>(initialChildPinForm);
  const [questForm, setQuestForm] = useState<QuestFormState>(initialQuestForm);
  const [questAssignmentForm, setQuestAssignmentForm] = useState<QuestAssignmentFormState>(
    initialQuestAssignmentForm
  );
  const [rewardForm, setRewardForm] = useState<RewardFormState>(initialRewardForm);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [childStats, setChildStats] = useState<ChildStatsResponse | null>(null);
  const [avatar, setAvatar] = useState<AvatarResponse | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [quests, setQuests] = useState<QuestTemplate[]>([]);
  const [questAssignments, setQuestAssignments] = useState<QuestAssignment[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardRedemptions, setRewardRedemptions] = useState<RewardRedemption[]>([]);
  const [shopRewards, setShopRewards] = useState<Reward[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionLibraryResponse>(emptySuggestions);
  const [authLoading, setAuthLoading] = useState(false);
  const [childStatsLoading, setChildStatsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [redemptionLoading, setRedemptionLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [childSaving, setChildSaving] = useState(false);
  const [childPinSaving, setChildPinSaving] = useState(false);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [completionSavingId, setCompletionSavingId] = useState<string | null>(null);
  const [questSaving, setQuestSaving] = useState(false);
  const [rewardSaving, setRewardSaving] = useState(false);
  const [redemptionSavingId, setRedemptionSavingId] = useState<string | null>(null);
  const [redeemingRewardId, setRedeemingRewardId] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setDashboard(null);
      setChildStats(null);
      setAvatar(null);
      setChildLoginProfiles([]);
      setChildLoginForm(initialChildLoginForm);
      setChildren([]);
      setChildPinForm(initialChildPinForm);
      setQuests([]);
      setQuestAssignments([]);
      setQuestAssignmentForm(initialQuestAssignmentForm);
      setRewards([]);
      setRewardRedemptions([]);
      setRewardForm(initialRewardForm);
      setShopRewards([]);
      setSuggestions(emptySuggestions);
      return;
    }

    void loadSession(token);
  }, [token]);

  async function loadSession(activeToken: string) {
    try {
      setDashboardLoading(true);
      const [currentUser, dashboardData, childData, questData, rewardData] = await Promise.all([
        apiRequest<AuthUser>('/auth/me', { token: activeToken }),
        apiRequest<DashboardResponse>('/dashboard', { token: activeToken }),
        apiRequest<ChildProfile[]>('/children', { token: activeToken }),
        apiRequest<QuestTemplate[]>('/quests', { token: activeToken }),
        apiRequest<Reward[]>('/rewards', { token: activeToken })
      ]);
      setUser(currentUser);
      setDashboard(dashboardData);
      setChildren(childData);
      setQuests(questData);
      setRewards(rewardData);
      await loadSuggestions(activeToken, currentUser);
      await loadRewardRedemptions(activeToken, currentUser);
      await loadAssignmentsForChildren(activeToken, childData, questData, questAssignmentForm.childProfileId);
      setError(null);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
      logout();
    } finally {
      setDashboardLoading(false);
    }
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (authMode === 'child') {
      await submitChildLogin();
      return;
    }

    setAuthLoading(true);
    setError(null);

    const path = authMode === 'login' ? '/auth/login' : '/auth/register';
    const body =
      authMode === 'login'
        ? {
            email: form.email,
            password: form.password
          }
        : {
            familyName: form.familyName,
            displayName: form.displayName,
            email: form.email,
            password: form.password
          };

    try {
      const auth = await apiRequest<AuthResponse>(path, {
        method: 'POST',
        body
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, auth.accessToken);
      setToken(auth.accessToken);
      setUser(auth.user);
      setForm(initialAuthForm);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadChildLoginProfiles() {
    const familyCode = childLoginForm.familyCode.trim();

    if (!familyCode) {
      return;
    }

    setAuthLoading(true);
    setError(null);

    try {
      const profiles = await apiRequest<ChildLoginProfile[]>(
        `/auth/child-login/${encodeURIComponent(familyCode)}/children`
      );
      setChildLoginProfiles(profiles);
      setChildLoginForm((currentForm) => ({
        ...currentForm,
        familyCode: familyCode.toUpperCase(),
        childProfileId: resolveSelectedChildLoginProfileId(profiles, currentForm.childProfileId)
      }));
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAuthLoading(false);
    }
  }

  async function submitChildLogin() {
    setAuthLoading(true);
    setError(null);

    try {
      const auth = await apiRequest<AuthResponse>('/auth/child-login', {
        method: 'POST',
        body: {
          familyCode: childLoginForm.familyCode,
          childProfileId: childLoginForm.childProfileId,
          pin: childLoginForm.pin
        }
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, auth.accessToken);
      setToken(auth.accessToken);
      setUser(auth.user);
      setChildLoginForm(initialChildLoginForm);
      setChildLoginProfiles([]);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAuthLoading(false);
    }
  }

  async function refreshDashboard(preferredChildId = questAssignmentForm.childProfileId) {
    if (!token) {
      return;
    }

    setDashboardLoading(true);
    setError(null);

    try {
      const [dashboardData, childData, questData, rewardData] = await Promise.all([
        apiRequest<DashboardResponse>('/dashboard', { token }),
        apiRequest<ChildProfile[]>('/children', { token }),
        apiRequest<QuestTemplate[]>('/quests', { token }),
        apiRequest<Reward[]>('/rewards', { token })
      ]);
      setDashboard(dashboardData);
      setChildren(childData);
      setQuests(questData);
      setRewards(rewardData);
      await loadSuggestions(token, user);
      await loadRewardRedemptions(token, user);
      await loadAssignmentsForChildren(token, childData, questData, preferredChildId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setDashboardLoading(false);
    }
  }

  async function loadAssignmentsForChildren(
    activeToken: string,
    childData: ChildProfile[],
    questData: QuestTemplate[],
    preferredChildId: string
  ) {
    const childProfileId = resolveSelectedChildId(childData, preferredChildId);

    setQuestAssignmentForm((currentForm) => ({
      ...currentForm,
      childProfileId,
      questId: resolveSelectedQuestId(questData, currentForm.questId),
      dueAt: currentForm.dueAt
    }));

    if (!childProfileId) {
      setQuestAssignments([]);
      setChildStats(null);
      setAvatar(null);
      setShopRewards([]);
      return;
    }

    setAssignmentLoading(true);
    setChildStatsLoading(true);
    setAvatarLoading(true);
    setShopLoading(true);

    try {
      const [assignments, childShopRewards, stats, avatarData] = await Promise.all([
        apiRequest<QuestAssignment[]>(`/children/${childProfileId}/quest-assignments`, {
          token: activeToken
        }),
        apiRequest<Reward[]>(`/children/${childProfileId}/shop`, {
          token: activeToken
        }),
        apiRequest<ChildStatsResponse>(`/children/${childProfileId}/stats`, {
          token: activeToken
        }),
        apiRequest<AvatarResponse>(`/children/${childProfileId}/avatar`, {
          token: activeToken
        })
      ]);
      setQuestAssignments(assignments);
      setShopRewards(childShopRewards);
      setChildStats(stats);
      setAvatar(avatarData);
    } finally {
      setAssignmentLoading(false);
      setChildStatsLoading(false);
      setAvatarLoading(false);
      setShopLoading(false);
    }
  }

  async function loadRewardRedemptions(activeToken: string, activeUser: AuthUser | null) {
    if (activeUser?.role === 'CHILD') {
      setRewardRedemptions([]);
      return;
    }

    setRedemptionLoading(true);

    try {
      const redemptionData = await apiRequest<RewardRedemption[]>('/reward-redemptions', {
        token: activeToken
      });
      setRewardRedemptions(redemptionData);
    } finally {
      setRedemptionLoading(false);
    }
  }

  async function loadSuggestions(activeToken: string, activeUser: AuthUser | null) {
    if (activeUser?.role === 'CHILD') {
      setSuggestions(emptySuggestions);
      return;
    }

    const suggestionData = await apiRequest<SuggestionLibraryResponse>('/suggestions', {
      token: activeToken
    });
    setSuggestions(suggestionData);
  }

  async function changeAssignmentChild(childProfileId: string) {
    if (!token) {
      return;
    }

    setQuestAssignmentForm((currentForm) => ({ ...currentForm, childProfileId }));
    setAssignmentLoading(true);
    setChildStatsLoading(true);
    setAvatarLoading(true);
    setShopLoading(true);
    setError(null);

    try {
      const [assignments, childShopRewards, stats, avatarData] = await Promise.all([
        apiRequest<QuestAssignment[]>(`/children/${childProfileId}/quest-assignments`, {
          token
        }),
        apiRequest<Reward[]>(`/children/${childProfileId}/shop`, {
          token
        }),
        apiRequest<ChildStatsResponse>(`/children/${childProfileId}/stats`, {
          token
        }),
        apiRequest<AvatarResponse>(`/children/${childProfileId}/avatar`, {
          token
        })
      ]);
      setQuestAssignments(assignments);
      setShopRewards(childShopRewards);
      setChildStats(stats);
      setAvatar(avatarData);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAssignmentLoading(false);
      setChildStatsLoading(false);
      setAvatarLoading(false);
      setShopLoading(false);
    }
  }

  async function submitChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setChildSaving(true);
    setError(null);

    try {
      const child = await apiRequest<ChildProfile>('/children', {
        method: 'POST',
        token,
        body: {
          displayName: childForm.displayName,
          gender: childForm.gender !== 'UNSPECIFIED' ? childForm.gender : undefined,
          birthDate: childForm.birthDate || undefined
        }
      });
      setChildForm(initialChildForm);
      await refreshDashboard(child.id);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setChildSaving(false);
    }
  }

  async function submitChildPin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedChildId = resolveSelectedChildId(children, childPinForm.childProfileId);

    if (!token || !selectedChildId) {
      return;
    }

    setChildPinSaving(true);
    setError(null);

    try {
      await apiRequest<ChildProfile>(`/children/${selectedChildId}/pin`, {
        method: 'POST',
        token,
        body: {
          pin: childPinForm.pin
        }
      });
      setChildPinForm({ childProfileId: selectedChildId, pin: '' });
      await refreshDashboard(questAssignmentForm.childProfileId || selectedChildId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setChildPinSaving(false);
    }
  }

  async function disableChildPin(childProfileId: string) {
    if (!token) {
      return;
    }

    setChildPinSaving(true);
    setError(null);

    try {
      await apiRequest<ChildProfile>(`/children/${childProfileId}/pin/disable`, {
        method: 'POST',
        token
      });
      setChildPinForm({ childProfileId, pin: '' });
      await refreshDashboard(questAssignmentForm.childProfileId || childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setChildPinSaving(false);
    }
  }

  async function submitQuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setQuestSaving(true);
    setError(null);

    try {
      const quest = await apiRequest<QuestTemplate>('/quests', {
        method: 'POST',
        token,
        body: {
          title: questForm.title,
          description: questForm.description || undefined,
          type: questForm.type,
          frequency: questForm.type === 'ONE_TIME' ? 'NONE' : questForm.frequency,
          xpReward: Number(questForm.xpReward),
          coinReward: Number(questForm.coinReward),
          requiresApproval: questForm.requiresApproval,
          isAssignable: questForm.isAssignable,
          isSelfService: questForm.isSelfService,
          isActive: questForm.isActive
        }
      });
      setQuestForm(initialQuestForm);
      setQuestAssignmentForm((currentForm) => ({ ...currentForm, questId: quest.id }));
      await refreshDashboard();
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setQuestSaving(false);
    }
  }

  function applyQuestSuggestion(suggestion: QuestSuggestion) {
    setQuestForm({
      title: suggestion.title,
      description: suggestion.description,
      type: suggestion.type,
      frequency: suggestion.frequency,
      xpReward: String(suggestion.xpReward),
      coinReward: String(suggestion.coinReward),
      requiresApproval: suggestion.requiresApproval,
      isAssignable: true,
      isSelfService: false,
      isActive: true
    });
  }

  async function submitQuestAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const formElement = event.currentTarget;
    const dueAtValue = formElement.querySelector<HTMLInputElement>('input[type="date"]')?.value ?? questAssignmentForm.dueAt;

    setAssignmentSaving(true);
    setError(null);

    try {
      await apiRequest<QuestAssignment>('/quest-assignments', {
        method: 'POST',
        token,
        body: {
          childProfileId: questAssignmentForm.childProfileId,
          questId: questAssignmentForm.questId,
          dueAt: dueAtValue ? `${dueAtValue}T12:00:00.000Z` : undefined
        }
      });
      setQuestAssignmentForm((currentForm) => ({ ...currentForm, dueAt: '' }));
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAssignmentSaving(false);
    }
  }

  async function submitQuestCompletion(assignmentId: string) {
    if (!token) {
      return;
    }

    setCompletionSavingId(assignmentId);
    setError(null);

    try {
      await apiRequest<QuestCompletionSummary>(`/quest-assignments/${assignmentId}/complete`, {
        method: 'POST',
        token
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setCompletionSavingId(null);
    }
  }

  async function submitSelfServiceQuest(questId: string) {
    if (!token || !questAssignmentForm.childProfileId) {
      return;
    }

    setCompletionSavingId(`self-service:${questId}`);
    setError(null);

    try {
      await apiRequest<QuestCompletionSummary>(`/quests/${questId}/self-service-completions`, {
        method: 'POST',
        token,
        body: {
          childProfileId: questAssignmentForm.childProfileId
        }
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setCompletionSavingId(null);
    }
  }

  async function approveQuestCompletion(assignmentId: string, completionId: string) {
    if (!token) {
      return;
    }

    setCompletionSavingId(assignmentId);
    setError(null);

    try {
      await apiRequest<QuestCompletionSummary>(`/quest-completions/${completionId}/approve`, {
        method: 'POST',
        token
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setCompletionSavingId(null);
    }
  }

  async function rejectQuestCompletion(assignmentId: string, completionId: string) {
    if (!token) {
      return;
    }

    setCompletionSavingId(assignmentId);
    setError(null);

    try {
      await apiRequest<QuestCompletionSummary>(`/quest-completions/${completionId}/reject`, {
        method: 'POST',
        token,
        body: {}
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setCompletionSavingId(null);
    }
  }

  async function submitReward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setRewardSaving(true);
    setError(null);

    try {
      await apiRequest<Reward>('/rewards', {
        method: 'POST',
        token,
        body: {
          name: rewardForm.name,
          description: rewardForm.description || undefined,
          imageUrl: rewardForm.imageUrl || undefined,
          category: rewardForm.category || undefined,
          price: Number(rewardForm.price),
          isActive: rewardForm.isActive,
          requiresApproval: rewardForm.requiresApproval,
          maxRedemptions: rewardForm.maxRedemptions ? Number(rewardForm.maxRedemptions) : undefined
        }
      });
      setRewardForm(initialRewardForm);
      await refreshDashboard();
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRewardSaving(false);
    }
  }

  function applyRewardSuggestion(suggestion: RewardSuggestion) {
    const visualOption = findRewardVisualForSuggestion(suggestion);

    setRewardForm({
      name: suggestion.name,
      description: suggestion.description,
      imageUrl: visualOption?.url ?? '',
      category: suggestion.category,
      price: String(suggestion.price),
      isActive: true,
      requiresApproval: suggestion.requiresApproval,
      maxRedemptions: suggestion.maxRedemptions ? String(suggestion.maxRedemptions) : ''
    });
  }

  async function redeemReward(rewardId: string) {
    if (!token || !questAssignmentForm.childProfileId) {
      return;
    }

    setRedeemingRewardId(rewardId);
    setError(null);

    try {
      await apiRequest<RewardRedemption>(`/rewards/${rewardId}/redeem`, {
        method: 'POST',
        token,
        body: {
          childProfileId: questAssignmentForm.childProfileId
        }
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRedeemingRewardId(null);
    }
  }

  async function approveRewardRedemption(redemptionId: string) {
    if (!token) {
      return;
    }

    setRedemptionSavingId(redemptionId);
    setError(null);

    try {
      await apiRequest<RewardRedemption>(`/reward-redemptions/${redemptionId}/approve`, {
        method: 'POST',
        token
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRedemptionSavingId(null);
    }
  }

  async function rejectRewardRedemption(redemptionId: string) {
    if (!token) {
      return;
    }

    setRedemptionSavingId(redemptionId);
    setError(null);

    try {
      await apiRequest<RewardRedemption>(`/reward-redemptions/${redemptionId}/reject`, {
        method: 'POST',
        token,
        body: {}
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRedemptionSavingId(null);
    }
  }

  async function cancelRewardRedemption(redemptionId: string) {
    if (!token) {
      return;
    }

    setRedemptionSavingId(redemptionId);
    setError(null);

    try {
      await apiRequest<RewardRedemption>(`/reward-redemptions/${redemptionId}/cancel`, {
        method: 'POST',
        token
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRedemptionSavingId(null);
    }
  }

  async function markRewardRedemptionRedeemed(redemptionId: string) {
    if (!token) {
      return;
    }

    setRedemptionSavingId(redemptionId);
    setError(null);

    try {
      await apiRequest<RewardRedemption>(`/reward-redemptions/${redemptionId}/mark-redeemed`, {
        method: 'POST',
        token
      });
      await refreshDashboard(questAssignmentForm.childProfileId);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setRedemptionSavingId(null);
    }
  }

  async function saveAvatarLoadout(equippedItems: Record<string, string>) {
    if (!token || !questAssignmentForm.childProfileId) {
      return;
    }

    setAvatarSaving(true);
    setError(null);

    try {
      const avatarData = await apiRequest<AvatarResponse>(`/children/${questAssignmentForm.childProfileId}/avatar/loadout`, {
        method: 'PUT',
        token,
        body: {
          equippedItems
        }
      });
      setAvatar(avatarData);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAvatarSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setDashboard(null);
    setChildStats(null);
    setAvatar(null);
    setChildLoginForm(initialChildLoginForm);
    setChildLoginProfiles([]);
    setChildren([]);
    setChildForm(initialChildForm);
    setChildPinForm(initialChildPinForm);
    setQuests([]);
    setQuestForm(initialQuestForm);
    setQuestAssignments([]);
    setQuestAssignmentForm(initialQuestAssignmentForm);
    setRewards([]);
    setRewardRedemptions([]);
    setRewardForm(initialRewardForm);
    setShopRewards([]);
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.25, sm: 2, md: 3 }, py: { xs: 1.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <AppHeader
            dashboard={dashboard}
            isAuthenticated={isAuthenticated}
            user={user}
            onRefresh={refreshDashboard}
            onLogout={logout}
            refreshing={dashboardLoading}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          {isAuthenticated ? (
            <DashboardView
              childForm={childForm}
              childPinForm={childPinForm}
              childPinSaving={childPinSaving}
              childSaving={childSaving}
              avatar={avatar}
              avatarLoading={avatarLoading}
              avatarSaving={avatarSaving}
              childStats={childStats}
              childStatsLoading={childStatsLoading}
              children={children}
              dashboard={dashboard}
              assignmentForm={questAssignmentForm}
              assignmentLoading={assignmentLoading}
              assignmentSaving={assignmentSaving}
              assignments={questAssignments}
              completionSavingId={completionSavingId}
              loading={dashboardLoading}
              questForm={questForm}
              questSaving={questSaving}
              quests={quests}
              rewardForm={rewardForm}
              redemptionLoading={redemptionLoading}
              redemptionSavingId={redemptionSavingId}
              rewardRedemptions={rewardRedemptions}
              rewardSaving={rewardSaving}
              rewards={rewards}
              redeemingRewardId={redeemingRewardId}
              shopLoading={shopLoading}
              shopRewards={shopRewards}
              suggestions={suggestions}
              user={user}
              onChildFormChange={setChildForm}
              onChildPinDisable={disableChildPin}
              onChildPinFormChange={setChildPinForm}
              onChildPinSubmit={submitChildPin}
              onChildSubmit={submitChild}
              onAssignmentChildChange={changeAssignmentChild}
              onAssignmentFormChange={setQuestAssignmentForm}
              onAssignmentSubmit={submitQuestAssignment}
              onAssignmentComplete={submitQuestCompletion}
              onAssignmentApprove={approveQuestCompletion}
              onAssignmentReject={rejectQuestCompletion}
              onSelfServiceQuestComplete={submitSelfServiceQuest}
              onQuestFormChange={setQuestForm}
              onQuestSuggestionSelect={applyQuestSuggestion}
              onQuestSubmit={submitQuest}
              onRewardFormChange={setRewardForm}
              onRewardRedemptionApprove={approveRewardRedemption}
              onRewardRedemptionCancel={cancelRewardRedemption}
              onRewardRedemptionMarkRedeemed={markRewardRedemptionRedeemed}
              onRewardRedemptionReject={rejectRewardRedemption}
              onRewardRedeem={redeemReward}
              onRewardSuggestionSelect={applyRewardSuggestion}
              onRewardSubmit={submitReward}
              onAvatarSave={saveAvatarLoadout}
            />
          ) : (
            <AuthView
              authMode={authMode}
              childLoginForm={childLoginForm}
              childLoginProfiles={childLoginProfiles}
              form={form}
              loading={authLoading}
              onAuthModeChange={setAuthMode}
              onChildLoginFormChange={setChildLoginForm}
              onChildLoginProfilesLoad={loadChildLoginProfiles}
              onFormChange={setForm}
              onSubmit={submitAuth}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}

interface AppHeaderProps {
  dashboard: DashboardResponse | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
  onRefresh: () => void;
  onLogout: () => void;
  refreshing: boolean;
}

function AppHeader({
  dashboard,
  isAuthenticated,
  user,
  onRefresh,
  onLogout,
  refreshing
}: AppHeaderProps) {
  return (
    <Paper elevation={0} sx={{ px: { xs: 2, md: 2.5 }, py: 1.5 }}>
      <Box
        sx={{
          alignItems: { xs: 'stretch', sm: 'center' },
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          minWidth: 0
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              borderRadius: 2,
              color: 'primary.contrastText',
              display: 'grid',
              flex: '0 0 auto',
              height: 42,
              placeItems: 'center',
              width: 42
            }}
          >
            <AutoAwesomeRoundedIcon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              Questory
            </Typography>
            <Typography color="text.secondary" noWrap>
              {dashboard?.family.name ?? 'Familien-Dashboard'}
            </Typography>
          </Box>
        </Box>

        {isAuthenticated ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
            <Chip
              icon={<ShieldRoundedIcon />}
              label={user?.role ?? 'SESSION'}
              size="small"
              variant="outlined"
            />
            <Tooltip title="Aktualisieren">
              <span>
                <Button
                  aria-label="Aktualisieren"
                  disabled={refreshing}
                  onClick={onRefresh}
                  sx={{ minWidth: 42, px: 1 }}
                  variant="outlined"
                >
                  <RefreshRoundedIcon />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Abmelden">
              <Button
                aria-label="Abmelden"
                color="inherit"
                onClick={onLogout}
                sx={{ minWidth: 42, px: 1 }}
                variant="outlined"
              >
                <LogoutRoundedIcon />
              </Button>
            </Tooltip>
          </Stack>
        ) : null}
      </Box>
    </Paper>
  );
}

interface AuthViewProps {
  authMode: AuthMode;
  childLoginForm: ChildLoginFormState;
  childLoginProfiles: ChildLoginProfile[];
  form: AuthFormState;
  loading: boolean;
  onAuthModeChange: (mode: AuthMode) => void;
  onChildLoginFormChange: (form: ChildLoginFormState) => void;
  onChildLoginProfilesLoad: () => void;
  onFormChange: (form: AuthFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AuthView({
  authMode,
  childLoginForm,
  childLoginProfiles,
  form,
  loading,
  onAuthModeChange,
  onChildLoginFormChange,
  onChildLoginProfilesLoad,
  onFormChange,
  onSubmit
}: AuthViewProps) {
  const isRegister = authMode === 'register';
  const isChildLogin = authMode === 'child';
  const selectedChildLoginProfileId = resolveSelectedChildLoginProfileId(
    childLoginProfiles,
    childLoginForm.childProfileId
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(340px, 420px) minmax(0, 1fr)' }
      }}
    >
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack component="form" onSubmit={onSubmit} spacing={2.25}>
          <Tabs
            onChange={(_, value: AuthMode) => onAuthModeChange(value)}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ '& .MuiTab-root': { minWidth: { xs: 88, sm: 120 }, px: { xs: 1, sm: 2 } } }}
            value={authMode}
            variant="scrollable"
          >
            <Tab icon={<LoginRoundedIcon />} iconPosition="start" label="Login" value="login" />
            <Tab icon={<EmojiEventsRoundedIcon />} iconPosition="start" label="Kind" value="child" />
            <Tab
              icon={<PersonAddRoundedIcon />}
              iconPosition="start"
              label="Registrieren"
              value="register"
            />
          </Tabs>

          {isChildLogin ? (
            <>
              <TextField
                autoComplete="off"
                label="Familiencode"
                onChange={(event) =>
                  onChildLoginFormChange({
                    ...childLoginForm,
                    familyCode: event.target.value,
                    childProfileId: '',
                    pin: ''
                  })
                }
                required
                value={childLoginForm.familyCode}
              />
              <Button
                disabled={loading || !childLoginForm.familyCode.trim()}
                onClick={onChildLoginProfilesLoad}
                startIcon={<PeopleAltRoundedIcon />}
                type="button"
                variant="outlined"
              >
                Kinder laden
              </Button>
              <TextField
                disabled={childLoginProfiles.length === 0}
                label="Kind"
                onChange={(event) =>
                  onChildLoginFormChange({ ...childLoginForm, childProfileId: event.target.value })
                }
                required
                select
                value={selectedChildLoginProfileId}
              >
                {childLoginProfiles.map((profile) => (
                  <MenuItem key={profile.id} value={profile.id}>
                    {profile.displayName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoComplete="current-password"
                disabled={childLoginProfiles.length === 0}
                label="PIN"
                onChange={(event) => onChildLoginFormChange({ ...childLoginForm, pin: event.target.value })}
                required
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 12, minLength: 4, pattern: '[0-9]*' } }}
                type="password"
                value={childLoginForm.pin}
              />
            </>
          ) : isRegister ? (
            <>
              <TextField
                autoComplete="organization"
                label="Familienname"
                onChange={(event) => onFormChange({ ...form, familyName: event.target.value })}
                required
                value={form.familyName}
              />
              <TextField
                autoComplete="name"
                label="Anzeigename"
                onChange={(event) => onFormChange({ ...form, displayName: event.target.value })}
                required
                value={form.displayName}
              />
            </>
          ) : null}

          {!isChildLogin ? (
            <>
              <TextField
                autoComplete="email"
                label="E-Mail"
                onChange={(event) => onFormChange({ ...form, email: event.target.value })}
                required
                type="email"
                value={form.email}
              />
              <TextField
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                label="Passwort"
                onChange={(event) => onFormChange({ ...form, password: event.target.value })}
                required
                type="password"
                value={form.password}
              />
            </>
          ) : null}
          <Button
            disabled={loading || (isChildLogin && (!selectedChildLoginProfileId || !childLoginForm.pin))}
            size="large"
            startIcon={<LoginRoundedIcon />}
            type="submit"
            variant="contained"
          >
            {isChildLogin ? 'Als Kind starten' : isRegister ? 'Familie erstellen' : 'Einloggen'}
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Quest-Zentrale
            </Typography>
            <Typography color="text.secondary">
              XP, Münzen, Belohnungen und Familienfortschritt.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }
            }}
          >
            <FeatureTile icon={<TaskAltRoundedIcon />} label="Quests" value="Missionen" />
            <FeatureTile icon={<PaidRoundedIcon />} label="Münzen" value="Shop" />
            <FeatureTile icon={<EmojiEventsRoundedIcon />} label="Level" value="Fortschritt" />
            <FeatureTile icon={<StorefrontRoundedIcon />} label="Rewards" value="Einlösen" />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

interface DashboardViewProps {
  assignmentForm: QuestAssignmentFormState;
  assignmentLoading: boolean;
  assignmentSaving: boolean;
  assignments: QuestAssignment[];
  avatar: AvatarResponse | null;
  avatarLoading: boolean;
  avatarSaving: boolean;
  childForm: ChildFormState;
  childPinForm: ChildPinFormState;
  childPinSaving: boolean;
  childSaving: boolean;
  childStats: ChildStatsResponse | null;
  childStatsLoading: boolean;
  children: ChildProfile[];
  completionSavingId: string | null;
  dashboard: DashboardResponse | null;
  loading: boolean;
  questForm: QuestFormState;
  questSaving: boolean;
  quests: QuestTemplate[];
  redeemingRewardId: string | null;
  redemptionLoading: boolean;
  redemptionSavingId: string | null;
  rewardForm: RewardFormState;
  rewardRedemptions: RewardRedemption[];
  rewardSaving: boolean;
  rewards: Reward[];
  shopLoading: boolean;
  shopRewards: Reward[];
  suggestions: SuggestionLibraryResponse;
  user: AuthUser | null;
  onAssignmentApprove: (assignmentId: string, completionId: string) => void;
  onAssignmentChildChange: (childProfileId: string) => void;
  onAssignmentComplete: (assignmentId: string) => void;
  onAssignmentFormChange: (form: QuestAssignmentFormState) => void;
  onAssignmentReject: (assignmentId: string, completionId: string) => void;
  onAssignmentSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAvatarSave: (equippedItems: Record<string, string>) => void;
  onSelfServiceQuestComplete: (questId: string) => void;
  onChildFormChange: (form: ChildFormState) => void;
  onChildPinDisable: (childProfileId: string) => void;
  onChildPinFormChange: (form: ChildPinFormState) => void;
  onChildPinSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChildSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuestFormChange: (form: QuestFormState) => void;
  onQuestSuggestionSelect: (suggestion: QuestSuggestion) => void;
  onQuestSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRewardFormChange: (form: RewardFormState) => void;
  onRewardRedemptionApprove: (redemptionId: string) => void;
  onRewardRedemptionCancel: (redemptionId: string) => void;
  onRewardRedemptionMarkRedeemed: (redemptionId: string) => void;
  onRewardRedemptionReject: (redemptionId: string) => void;
  onRewardRedeem: (rewardId: string) => void;
  onRewardSuggestionSelect: (suggestion: RewardSuggestion) => void;
  onRewardSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function DashboardView({
  assignmentForm,
  assignmentLoading,
  assignmentSaving,
  assignments,
  avatar,
  avatarLoading,
  avatarSaving,
  childForm,
  childPinForm,
  childPinSaving,
  childSaving,
  childStats,
  childStatsLoading,
  children,
  completionSavingId,
  dashboard,
  loading,
  questForm,
  questSaving,
  quests,
  redeemingRewardId,
  redemptionLoading,
  redemptionSavingId,
  rewardForm,
  rewardRedemptions,
  rewardSaving,
  rewards,
  shopLoading,
  shopRewards,
  suggestions,
  user,
  onAssignmentApprove,
  onAssignmentChildChange,
  onAssignmentComplete,
  onAssignmentFormChange,
  onAssignmentReject,
  onAssignmentSubmit,
  onAvatarSave,
  onSelfServiceQuestComplete,
  onChildFormChange,
  onChildPinDisable,
  onChildPinFormChange,
  onChildPinSubmit,
  onChildSubmit,
  onQuestFormChange,
  onQuestSuggestionSelect,
  onQuestSubmit,
  onRewardFormChange,
  onRewardRedemptionApprove,
  onRewardRedemptionCancel,
  onRewardRedemptionMarkRedeemed,
  onRewardRedemptionReject,
  onRewardRedeem,
  onRewardSuggestionSelect,
  onRewardSubmit
}: DashboardViewProps) {
  const childRows = children;
  const xpMax = useMemo(() => Math.max(...childRows.map((child) => child.xp), 1), [childRows]);
  const canManageChildren = user?.role === 'ADMIN' || user?.role === 'PARENT';
  const selectedPinChildId = resolveSelectedChildId(children, childPinForm.childProfileId);
  const selectedPinChild = children.find((child) => child.id === selectedPinChildId) ?? null;
  const dashboardTabs = useMemo(
    () =>
      canManageChildren
        ? [
            { label: 'Übersicht', value: 'overview' as DashboardTab },
            { label: 'Kinder', value: 'children' as DashboardTab },
            { label: 'Avatar', value: 'avatar' as DashboardTab },
            { label: 'Quests', value: 'quests' as DashboardTab },
            { label: 'Shop', value: 'shop' as DashboardTab },
            { label: 'Freigaben', value: 'approvals' as DashboardTab }
          ]
        : [
            { label: 'Übersicht', value: 'overview' as DashboardTab },
            { label: 'Avatar', value: 'avatar' as DashboardTab },
            { label: 'Quests', value: 'quests' as DashboardTab },
            { label: 'Shop', value: 'shop' as DashboardTab }
          ],
    [canManageChildren]
  );
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTab>('overview');
  const [activeShopTab, setActiveShopTab] = useState<ShopTab>('shop');

  useEffect(() => {
    if (!dashboardTabs.some((tab) => tab.value === activeDashboardTab)) {
      setActiveDashboardTab(dashboardTabs[0].value);
    }
  }, [activeDashboardTab, dashboardTabs]);

  if (!dashboard) {
    return (
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Dashboard wird geladen</Typography>
          <LinearProgress />
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {loading ? <LinearProgress /> : null}

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }
        }}
      >
        <MetricCard icon={<PeopleAltRoundedIcon />} label="Kinder" value={dashboard.totals.children} />
        <MetricCard icon={<TaskAltRoundedIcon />} label="Aktive Quests" value={dashboard.totals.activeQuests} />
        <MetricCard icon={<PaidRoundedIcon />} label="Münzen" value={dashboard.totals.coins} />
        <MetricCard icon={<StorefrontRoundedIcon />} label="Offene Rewards" value={dashboard.rewards.requested} />
      </Box>

      <Paper elevation={0} sx={{ p: 0.5 }}>
        <Tabs
          onChange={(_, value: DashboardTab) => setActiveDashboardTab(value)}
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              minWidth: { xs: 88, sm: 110 },
              px: { xs: 1.25, sm: 2 }
            }
          }}
          value={activeDashboardTab}
          variant="scrollable"
        >
          {dashboardTabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Paper>

      {activeDashboardTab === 'overview' ? (
        <Stack spacing={2}>
          <ChildrenOverviewStrip
            children={children}
            selectedChildId={assignmentForm.childProfileId}
            onChildSelect={onAssignmentChildChange}
          />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)' }
            }}
          >
            <ChildStatsPanel
              loading={childStatsLoading}
              stats={childStats}
              onOpenAvatar={() => setActiveDashboardTab('avatar')}
              onOpenQuests={() => setActiveDashboardTab('quests')}
              onOpenShop={() => setActiveDashboardTab('shop')}
            />
            <FamilyStatusPanel dashboard={dashboard} />
          </Box>
        </Stack>
      ) : null}

      {activeDashboardTab === 'children' && canManageChildren ? (
        <ChildrenProfilesPanel
          canManage={canManageChildren}
          childForm={childForm}
          childPinForm={childPinForm}
          childPinSaving={childPinSaving}
          childRows={childRows}
          childSaving={childSaving}
          children={children}
          maxXp={xpMax}
          selectedPinChild={selectedPinChild}
          selectedPinChildId={selectedPinChildId}
          onChildOpen={(childProfileId) => {
            onAssignmentChildChange(childProfileId);
            setActiveDashboardTab('overview');
          }}
          onChildFormChange={onChildFormChange}
          onChildPinDisable={onChildPinDisable}
          onChildPinFormChange={onChildPinFormChange}
          onChildPinSubmit={onChildPinSubmit}
          onChildSubmit={onChildSubmit}
        />
      ) : null}

      {activeDashboardTab === 'avatar' ? (
        <AvatarBuilderPanel
          avatar={avatar}
          children={children}
          loading={avatarLoading}
          saving={avatarSaving}
          selectedChildId={assignmentForm.childProfileId}
          onChildChange={onAssignmentChildChange}
          onSave={onAvatarSave}
        />
      ) : null}

      {activeDashboardTab === 'quests' ? (
        <Stack spacing={2}>
          {canManageChildren ? (
            <QuestTemplatesPanel
              canManage={canManageChildren}
              form={questForm}
              quests={quests}
              saving={questSaving}
              suggestions={suggestions.quests}
              onFormChange={onQuestFormChange}
              onSuggestionSelect={onQuestSuggestionSelect}
              onSubmit={onQuestSubmit}
            />
          ) : null}

          <QuestAssignmentsPanel
            assignments={assignments}
            canManage={canManageChildren}
            children={children}
            completionSavingId={completionSavingId}
            form={assignmentForm}
            loading={assignmentLoading}
            quests={quests}
            saving={assignmentSaving}
            selectedChildId={assignmentForm.childProfileId}
            onApprove={onAssignmentApprove}
            onChildChange={onAssignmentChildChange}
            onComplete={onAssignmentComplete}
            onFormChange={onAssignmentFormChange}
            onReject={onAssignmentReject}
            onSubmit={onAssignmentSubmit}
          />

          <SelfServiceQuestsPanel
            children={children}
            completionSavingId={completionSavingId}
            quests={quests}
            selectedChildId={assignmentForm.childProfileId}
            onComplete={onSelfServiceQuestComplete}
          />
        </Stack>
      ) : null}

      {activeDashboardTab === 'shop' ? (
        <Stack spacing={2}>
          {canManageChildren ? (
            <Paper elevation={0} sx={{ p: 0.5 }}>
              <Tabs
                allowScrollButtonsMobile
                onChange={(_, value: ShopTab) => setActiveShopTab(value)}
                scrollButtons="auto"
                sx={{
                  minHeight: 44,
                  '& .MuiTab-root': {
                    minHeight: 44,
                    minWidth: { xs: 104, sm: 132 },
                    px: { xs: 1.25, sm: 2 }
                  }
                }}
                value={activeShopTab}
                variant="scrollable"
              >
                <Tab label="Shop" value="shop" />
                <Tab label="Belohnungen" value="manage" />
              </Tabs>
            </Paper>
          ) : null}

          {!canManageChildren || activeShopTab === 'shop' ? (
            <RewardShopPanel
              children={children}
              redeemingRewardId={redeemingRewardId}
              onChildChange={onAssignmentChildChange}
              selectedChildId={assignmentForm.childProfileId}
              shopLoading={shopLoading}
              shopRewards={shopRewards}
              onRedeem={onRewardRedeem}
            />
          ) : null}

          {canManageChildren && activeShopTab === 'manage' ? (
            <RewardsPanel
              canManage={canManageChildren}
              form={rewardForm}
              rewards={rewards}
              saving={rewardSaving}
              suggestions={suggestions.rewards}
              onFormChange={onRewardFormChange}
              onSuggestionSelect={onRewardSuggestionSelect}
              onSubmit={onRewardSubmit}
            />
          ) : null}
        </Stack>
      ) : null}

      {activeDashboardTab === 'approvals' && canManageChildren ? (
        <RewardRedemptionsPanel
          canManage={canManageChildren}
          loading={redemptionLoading}
          redemptions={rewardRedemptions}
          savingId={redemptionSavingId}
          onApprove={onRewardRedemptionApprove}
          onCancel={onRewardRedemptionCancel}
          onMarkRedeemed={onRewardRedemptionMarkRedeemed}
          onReject={onRewardRedemptionReject}
        />
      ) : null}
    </Stack>
  );
}

interface ChildrenProfilesPanelProps {
  canManage: boolean;
  childForm: ChildFormState;
  childPinForm: ChildPinFormState;
  childPinSaving: boolean;
  childRows: ChildProfile[];
  childSaving: boolean;
  children: ChildProfile[];
  maxXp: number;
  selectedPinChild: ChildProfile | null;
  selectedPinChildId: string;
  onChildOpen: (childProfileId: string) => void;
  onChildFormChange: (form: ChildFormState) => void;
  onChildPinDisable: (childProfileId: string) => void;
  onChildPinFormChange: (form: ChildPinFormState) => void;
  onChildPinSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChildSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ChildrenProfilesPanel({
  canManage,
  childForm,
  childPinForm,
  childPinSaving,
  childRows,
  childSaving,
  children,
  maxXp,
  selectedPinChild,
  selectedPinChildId,
  onChildOpen,
  onChildFormChange,
  onChildPinDisable,
  onChildPinFormChange,
  onChildPinSubmit,
  onChildSubmit
}: ChildrenProfilesPanelProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<EmojiEventsRoundedIcon />} title="Kinderprofile" />
          <Chip icon={<PeopleAltRoundedIcon />} label={`${childRows.length} aktiv`} variant="outlined" />
        </Box>

        {canManage ? (
          <Stack spacing={1.25}>
            <Box
              component="form"
              onSubmit={onChildSubmit}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 1fr) minmax(150px, 0.8fr) minmax(150px, 0.8fr) auto' },
                p: 1.5
              }}
            >
              <TextField
                autoComplete="off"
                label="Kindername"
                onChange={(event) => onChildFormChange({ ...childForm, displayName: event.target.value })}
                required
                size="small"
                value={childForm.displayName}
              />
              <TextField
                label="Geschlecht"
                onChange={(event) => onChildFormChange({ ...childForm, gender: event.target.value })}
                select
                size="small"
                value={childForm.gender}
              >
                <MenuItem value="UNSPECIFIED">Keine Angabe</MenuItem>
                <MenuItem value="GIRL">Mädchen</MenuItem>
                <MenuItem value="BOY">Junge</MenuItem>
                <MenuItem value="DIVERSE">Divers</MenuItem>
              </TextField>
              <TextField
                label="Geburtsdatum"
                onChange={(event) => onChildFormChange({ ...childForm, birthDate: event.target.value })}
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                value={childForm.birthDate}
              />
              <Button
                disabled={childSaving}
                startIcon={<PersonAddRoundedIcon />}
                sx={{ minHeight: 40, width: { xs: '100%', md: 'auto' } }}
                type="submit"
                variant="contained"
              >
                Anlegen
              </Button>
            </Box>

            {children.length > 0 ? (
              <Box
                component="form"
                onSubmit={onChildPinSubmit}
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  display: 'grid',
                  gap: 1.25,
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 1fr) minmax(140px, 0.7fr) auto auto' },
                  p: 1.5
                }}
              >
                <TextField
                  label="Kind"
                  onChange={(event) => onChildPinFormChange({ ...childPinForm, childProfileId: event.target.value })}
                  select
                  size="small"
                  value={selectedPinChildId}
                >
                  {children.map((child) => (
                    <MenuItem key={child.id} value={child.id}>
                      {child.displayName}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  autoComplete="new-password"
                  label="Kinder-PIN"
                  onChange={(event) => onChildPinFormChange({ ...childPinForm, pin: event.target.value })}
                  required
                  size="small"
                  slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 12, minLength: 4, pattern: '[0-9]*' } }}
                  type="password"
                  value={childPinForm.pin}
                />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    color={selectedPinChild?.pinEnabled ? 'success' : 'default'}
                    label={selectedPinChild?.pinEnabled ? 'PIN aktiv' : 'PIN aus'}
                    variant="outlined"
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: 'stretch' }}>
                  <Button disabled={childPinSaving} size="small" type="submit" variant="contained">
                    PIN speichern
                  </Button>
                  {selectedPinChild?.pinEnabled ? (
                    <Button
                      disabled={childPinSaving}
                      onClick={() => onChildPinDisable(selectedPinChild.id)}
                      size="small"
                      variant="outlined"
                    >
                      Deaktivieren
                    </Button>
                  ) : null}
                </Stack>
              </Box>
            ) : null}
          </Stack>
        ) : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {childRows.length > 0 ? (
            childRows.map((child) => (
              <ChildRow child={child} key={child.id} maxXp={maxXp} onOpen={() => onChildOpen(child.id)} />
            ))
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">Noch keine Kinderprofile</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface FamilyStatusPanelProps {
  dashboard: DashboardResponse;
}

function FamilyStatusPanel({ dashboard }: FamilyStatusPanelProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <SectionTitle icon={<ShieldRoundedIcon />} title="Familienlage" />
        <SummaryRow label="Eltern/Admins" value={dashboard.totals.parents} />
        <SummaryRow label="Kinderprofile" value={dashboard.totals.children} />
        <SummaryRow label="Kinder-Logins" value={dashboard.totals.childUsers} />
        <Divider />
        <SummaryRow label="Quest-Abschlüsse" value={dashboard.quests.totalCompletions} />
        <SummaryRow label="Bestätigt" value={dashboard.quests.approved} />
        <SummaryRow label="Eingereicht" value={dashboard.quests.submitted} />
        <Divider />
        <SummaryRow label="Rewards aktiv" value={dashboard.totals.activeRewards} />
        <SummaryRow label="Rewards eingeloest" value={dashboard.rewards.redeemed} />
        <SummaryRow label="Coins gebunden" value={dashboard.rewards.coinsSpent} />
      </Stack>
    </Paper>
  );
}

interface ChildrenOverviewStripProps {
  children: ChildProfile[];
  selectedChildId: string;
  onChildSelect: (childProfileId: string) => void;
}

function ChildrenOverviewStrip({ children, selectedChildId, onChildSelect }: ChildrenOverviewStripProps) {
  if (children.length === 0) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.5 } }}>
      <Stack spacing={1.25}>
        <SectionTitle icon={<PeopleAltRoundedIcon />} title="Kinder im Überblick" />
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridAutoColumns: { xs: 'minmax(172px, 78vw)', sm: 'minmax(188px, 240px)' },
            gridAutoFlow: 'column',
            overflowX: 'auto',
            pb: 0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {children.map((child) => {
            const active = child.id === selectedChildId;

            return (
              <Button
                key={child.id}
                onClick={() => onChildSelect(child.id)}
                sx={{
                  alignItems: 'stretch',
                  bgcolor: active ? 'rgba(37, 104, 216, 0.09)' : 'action.hover',
                  borderColor: active ? 'primary.main' : 'divider',
                  color: 'text.primary',
                  display: 'grid',
                  gap: 1,
                  justifyContent: 'stretch',
                  minWidth: 0,
                  p: 1.25,
                  textAlign: 'left'
                }}
                variant="outlined"
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                  <AvatarBadge avatarKey={child.avatarKey} name={child.displayName} size="small" />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900 }} noWrap>
                      {child.displayName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Level {child.level}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                  <Chip icon={<PaidRoundedIcon />} label={child.coins} size="small" variant="outlined" />
                  <Chip label={`${child.xp} XP`} size="small" variant="outlined" />
                  {active ? <Chip color="primary" label="Aktiv" size="small" /> : null}
                </Stack>
              </Button>
            );
          })}
        </Box>
      </Stack>
    </Paper>
  );
}

interface RewardRedemptionsPanelProps {
  canManage: boolean;
  loading: boolean;
  redemptions: RewardRedemption[];
  savingId: string | null;
  onApprove: (redemptionId: string) => void;
  onCancel: (redemptionId: string) => void;
  onMarkRedeemed: (redemptionId: string) => void;
  onReject: (redemptionId: string) => void;
}

function RewardRedemptionsPanel({
  canManage,
  loading,
  redemptions,
  savingId,
  onApprove,
  onCancel,
  onMarkRedeemed,
  onReject
}: RewardRedemptionsPanelProps) {
  const requestedCount = redemptions.filter((redemption) => redemption.status === 'REQUESTED').length;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<ShieldRoundedIcon />} title="Einlöseanfragen" />
          <Chip icon={<StorefrontRoundedIcon />} label={`${requestedCount} offen`} variant="outlined" />
        </Box>

        {loading ? <LinearProgress /> : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {redemptions.length > 0 ? (
            redemptions.map((redemption) => (
              <RewardRedemptionRow
                canManage={canManage}
                key={redemption.id}
                redemption={redemption}
                saving={savingId === redemption.id}
                onApprove={onApprove}
                onCancel={onCancel}
                onMarkRedeemed={onMarkRedeemed}
                onReject={onReject}
              />
            ))
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">Noch keine Einlöseanfragen</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface ChildStatsPanelProps {
  loading: boolean;
  stats: ChildStatsResponse | null;
  onOpenAvatar: () => void;
  onOpenQuests: () => void;
  onOpenShop: () => void;
}

function ChildStatsPanel({ loading, stats, onOpenAvatar, onOpenQuests, onOpenShop }: ChildStatsPanelProps) {
  const nextLevelXp = Math.max(stats?.progression.nextLevelXp ?? 1, 1);
  const xpProgress = stats ? Math.min((stats.progression.xp / nextLevelXp) * 100, 100) : 0;
  const nextUnlock = stats ? getNextAvatarUnlock(stats.progression.level) : null;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<EmojiEventsRoundedIcon />} title="Abenteuerstatus" />
          <Chip
            icon={<PeopleAltRoundedIcon />}
            label={stats ? stats.child.displayName : 'Kein Kind'}
            variant="outlined"
          />
        </Box>

        {loading ? <LinearProgress /> : null}

        {stats ? (
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 0.95fr) minmax(0, 1.05fr)' }
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(37, 104, 216, 0.14), rgba(47, 143, 111, 0.16))',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1.5
              }}
            >
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <AvatarBadge avatarKey={stats.child.avatarKey} name={stats.child.displayName} size="large" />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900 }} variant="h5" noWrap>
                      {stats.child.displayName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {resolveAvatarPreset(stats.child.avatarKey, stats.child.displayName).role}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip icon={<EmojiEventsRoundedIcon />} label={`Level ${stats.progression.level}`} variant="outlined" />
                  <Chip icon={<PaidRoundedIcon />} label={`${stats.progression.coins} Münzen`} variant="outlined" />
                </Stack>

                <Box>
                  <LinearProgress value={xpProgress} variant="determinate" />
                  <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                    {stats.progression.xp} XP - noch {stats.progression.xpToNextLevel} XP bis Level {stats.progression.level + 1}
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 1.25 }}>
                  <Typography sx={{ fontWeight: 900 }} variant="body2">
                    {nextUnlock ? `Naechster Unlock: ${nextUnlock.label}` : 'Alle Basis-Unlocks erreicht'}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {nextUnlock ? `${nextUnlock.slot} ab Level ${nextUnlock.level}` : 'Weitere Sets kommen mit dem Avatar-Builder.'}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Button onClick={onOpenAvatar} size="small" startIcon={<AutoAwesomeRoundedIcon />} variant="contained">
                    Avatar
                  </Button>
                  <Button onClick={onOpenQuests} size="small" startIcon={<TaskAltRoundedIcon />} variant="contained">
                    Quests
                  </Button>
                  <Button onClick={onOpenShop} size="small" startIcon={<StorefrontRoundedIcon />} variant="outlined">
                    Shop
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }
              }}
            >
              <StatTile label="Quest-Zuweisungen" value={stats.quests.assigned} />
              <StatTile label="Bestätigte Quests" value={stats.quests.approved} />
              <StatTile label="Warten auf Freigabe" value={stats.quests.submitted} />
              <StatTile label="Verdiente XP" value={stats.quests.xpGranted} />
              <StatTile label="Reward-Anfragen" value={stats.rewards.requested} />
              <StatTile label="Reservierte Coins" value={stats.rewards.coinsSpent} />
            </Box>

            <AvatarUnlockTrack level={stats.progression.level} />
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
            <Typography color="text.secondary">Noch kein Kind für Statistiken ausgewählt</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

interface AvatarUnlockTrackProps {
  level: number;
}

function AvatarUnlockTrack({ level }: AvatarUnlockTrackProps) {
  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridColumn: { lg: '1 / -1' },
        p: 1.5
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 900 }}>Level schaltet Avatar-Teile frei</Typography>
        <Chip label="XP-Pfad" size="small" variant="outlined" />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' }
        }}
      >
        {AVATAR_UNLOCKS.slice(0, 8).map((unlock) => {
          const unlocked = level >= unlock.level;

          return (
            <Box
              key={`${unlock.level}-${unlock.label}`}
              sx={{
                bgcolor: unlocked ? 'background.paper' : 'rgba(255,255,255,0.55)',
                border: '1px solid',
                borderColor: unlocked ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 1.25
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 900 }} variant="body2" noWrap>
                  {unlock.label}
                </Typography>
                <Chip
                  color={unlocked ? 'success' : 'default'}
                  label={unlocked ? 'frei' : `Lvl ${unlock.level}`}
                  size="small"
                />
              </Stack>
              <Typography color="text.secondary" variant="caption">
                {unlock.slot}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

interface AvatarBadgeProps {
  avatarKey: string | null;
  name: string;
  size: 'small' | 'large';
}

function AvatarBadge({ avatarKey, name, size }: AvatarBadgeProps) {
  const avatar = resolveAvatarPreset(avatarKey, name);
  const dimension = size === 'large' ? 92 : 48;
  const fontSize = size === 'large' ? '1.45rem' : '0.8rem';

  return (
    <Box
      sx={{
        alignItems: 'center',
        background: `linear-gradient(135deg, ${avatar.primary}, ${avatar.secondary})`,
        border: '2px solid',
        borderColor: 'background.paper',
        borderRadius: '28%',
        boxShadow: '0 10px 26px rgba(25, 42, 68, 0.18)',
        color: 'common.white',
        display: 'flex',
        flexShrink: 0,
        height: dimension,
        justifyContent: 'center',
        position: 'relative',
        width: dimension
      }}
      title={avatar.label}
    >
      <Typography sx={{ fontSize, fontWeight: 950 }}>{avatar.initials}</Typography>
      {size === 'large' ? (
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 999,
            bottom: 6,
            color: 'primary.main',
            display: 'grid',
            height: 24,
            placeItems: 'center',
            position: 'absolute',
            right: 6,
            width: 24
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
        </Box>
      ) : null}
    </Box>
  );
}

interface StatTileProps {
  label: string;
  value: number;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, minWidth: 0, p: 1.25 }}>
      <Typography color="text.secondary" variant="body2" noWrap>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 900 }} variant="h6">
        {value}
      </Typography>
    </Box>
  );
}

interface EconomyHintPanelProps {
  mode: 'quests' | 'rewards';
}

function EconomyHintPanel({ mode }: EconomyHintPanelProps) {
  const hints =
    mode === 'quests'
      ? ['Routine 1-3 Coins', 'echte Hilfe 4-7 Coins', 'Wochenziel 8-12 Coins']
      : ['kleine Extras 25-50', 'Familienzeit 80-130', 'Ausfluege 150+'];

  return (
    <Box
      sx={{
        alignItems: { xs: 'stretch', sm: 'center' },
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1,
        justifyContent: 'space-between',
        p: 1.25
      }}
    >
      <Typography color="text.secondary" variant="body2">
        {mode === 'quests' ? 'Coin-Balance für Quests' : 'Preis-Balance für Rewards'}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          overflowX: { xs: 'auto', sm: 'visible' },
          pb: { xs: 0.25, sm: 0 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {hints.map((hint) => (
          <Chip key={hint} label={hint} size="small" variant="outlined" />
        ))}
      </Stack>
    </Box>
  );
}

interface ChildFocusBarProps {
  children: ChildProfile[];
  selectedChildId: string;
  onChildChange: (childProfileId: string) => void;
}

function ChildFocusBar({ children, selectedChildId, onChildChange }: ChildFocusBarProps) {
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;

  if (children.length === 0) {
    return (
      <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.25 }}>
        <Typography color="text.secondary">Noch kein Kind ausgewählt</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignItems: { xs: 'stretch', md: 'center' },
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: { xs: '1fr', md: '56px minmax(220px, 0.8fr) minmax(0, 1fr)' },
        p: 1.25
      }}
    >
      {selectedChild ? (
        <AvatarBadge avatarKey={selectedChild.avatarKey} name={selectedChild.displayName} size="small" />
      ) : null}
      <TextField
        label="Aktives Kind"
        onChange={(event) => onChildChange(event.target.value)}
        select
        size="small"
        value={selectedChildId}
      >
        {children.map((child) => (
          <MenuItem key={child.id} value={child.id}>
            {child.displayName}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip icon={<EmojiEventsRoundedIcon />} label={selectedChild ? `Level ${selectedChild.level}` : 'Kein Level'} variant="outlined" />
        <Chip label={selectedChild ? `${selectedChild.xp} XP` : '0 XP'} variant="outlined" />
        <Chip icon={<PaidRoundedIcon />} label={selectedChild ? `${selectedChild.coins} Münzen` : '0 Münzen'} variant="outlined" />
      </Stack>
    </Box>
  );
}

interface RewardShopPanelProps {
  children: ChildProfile[];
  redeemingRewardId: string | null;
  selectedChildId: string;
  shopLoading: boolean;
  shopRewards: Reward[];
  onChildChange: (childProfileId: string) => void;
  onRedeem: (rewardId: string) => void;
}

function RewardShopPanel({
  children,
  redeemingRewardId,
  selectedChildId,
  shopLoading,
  shopRewards,
  onChildChange,
  onRedeem
}: RewardShopPanelProps) {
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<StorefrontRoundedIcon />} title="Belohnungsshop" />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip icon={<StorefrontRoundedIcon />} label={`${shopRewards.length} im Shop`} variant="outlined" />
            <Chip
              icon={<PaidRoundedIcon />}
              label={selectedChild ? `${selectedChild.coins} Münzen` : 'Kein Kind'}
              variant="outlined"
            />
          </Stack>
        </Box>

        <ChildFocusBar children={children} selectedChildId={selectedChildId} onChildChange={onChildChange} />

        {shopLoading ? <LinearProgress /> : null}

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { xs: '1fr', lg: shopRewards.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr' }
          }}
        >
          {selectedChild && shopRewards.length > 0 ? (
            shopRewards.map((reward) => (
              <RewardShopRow
                child={selectedChild}
                key={reward.id}
                redeeming={redeemingRewardId === reward.id}
                reward={reward}
                onRedeem={onRedeem}
              />
            ))
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">
                {selectedChild ? 'Noch keine aktiven Belohnungen im Shop' : 'Noch kein Kind für den Shop ausgewählt'}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface RewardsPanelProps {
  canManage: boolean;
  form: RewardFormState;
  rewards: Reward[];
  saving: boolean;
  suggestions: RewardSuggestion[];
  onFormChange: (form: RewardFormState) => void;
  onSuggestionSelect: (suggestion: RewardSuggestion) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function RewardsPanel({
  canManage,
  form,
  rewards,
  saving,
  suggestions,
  onFormChange,
  onSuggestionSelect,
  onSubmit
}: RewardsPanelProps) {
  const activeRewards = rewards.filter((reward) => reward.isActive);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<StorefrontRoundedIcon />} title="Belohnungen" />
          <Chip icon={<StorefrontRoundedIcon />} label={`${activeRewards.length} aktiv`} variant="outlined" />
        </Box>

        {canManage ? (
          <Stack spacing={1.25}>
            <SuggestionLibraryButton
              actionLabel="Vorlagen"
              existingLabels={rewards.map((reward) => reward.name)}
              getLabel={(suggestion) => suggestion.name}
              getMeta={(suggestion) => `${suggestion.price} Münzen`}
              suggestions={suggestions}
              title="Shop-Bibliothek"
              onSelect={onSuggestionSelect}
            />
            <EconomyHintPanel mode="rewards" />
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                p: 1.5
              }}
            >
              <TextField
                autoComplete="off"
                label="Belohnung"
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                required
                size="small"
                value={form.name}
              />
              <TextField
                autoComplete="off"
                label="Beschreibung"
                onChange={(event) => onFormChange({ ...form, description: event.target.value })}
                size="small"
                value={form.description}
              />
              <TextField
                autoComplete="off"
                label="Kategorie"
                onChange={(event) => onFormChange({ ...form, category: event.target.value })}
                size="small"
                value={form.category}
              />
              <TextField
                label="Preis"
                onChange={(event) => onFormChange({ ...form, price: event.target.value })}
                required
                size="small"
                slotProps={{ htmlInput: { min: 0, max: 100000 } }}
                type="number"
                value={form.price}
              />
              <RewardVisualPicker
                value={form.imageUrl}
                onChange={(imageUrl) => onFormChange({ ...form, imageUrl })}
              />
              <TextField
                autoComplete="off"
                label="Bild-URL"
                onChange={(event) => onFormChange({ ...form, imageUrl: event.target.value })}
                size="small"
                sx={{ gridColumn: { md: 'span 2' } }}
                value={form.imageUrl}
              />
              <TextField
                label="Max. Einlösungen"
                onChange={(event) => onFormChange({ ...form, maxRedemptions: event.target.value })}
                size="small"
                slotProps={{ htmlInput: { min: 1, max: 10000 } }}
                type="number"
                value={form.maxRedemptions}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.requiresApproval}
                      onChange={(event) => onFormChange({ ...form, requiresApproval: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Bestätigung"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(event) => onFormChange({ ...form, isActive: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Aktiv"
                />
              </Stack>
              <Button
                disabled={saving}
                startIcon={<StorefrontRoundedIcon />}
                sx={{ minHeight: 40, width: { xs: '100%', md: 'auto' } }}
                type="submit"
                variant="contained"
              >
                Anlegen
              </Button>
            </Box>
          </Stack>
        ) : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {rewards.length > 0 ? (
            rewards.map((reward) => <RewardRow key={reward.id} reward={reward} />)
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">Noch keine Belohnungen</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface QuestAssignmentsPanelProps {
  assignments: QuestAssignment[];
  canManage: boolean;
  children: ChildProfile[];
  completionSavingId: string | null;
  form: QuestAssignmentFormState;
  loading: boolean;
  quests: QuestTemplate[];
  saving: boolean;
  selectedChildId: string;
  onApprove: (assignmentId: string, completionId: string) => void;
  onChildChange: (childProfileId: string) => void;
  onComplete: (assignmentId: string) => void;
  onFormChange: (form: QuestAssignmentFormState) => void;
  onReject: (assignmentId: string, completionId: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function QuestAssignmentsPanel({
  assignments,
  canManage,
  children,
  completionSavingId,
  form,
  loading,
  quests,
  saving,
  selectedChildId,
  onApprove,
  onChildChange,
  onComplete,
  onFormChange,
  onReject,
  onSubmit
}: QuestAssignmentsPanelProps) {
  const activeQuests = quests.filter((quest) => quest.isActive);
  const canAssign = canManage && children.length > 0 && activeQuests.length > 0;
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<TaskAltRoundedIcon />} title="Quest-Zuweisungen" />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip icon={<PeopleAltRoundedIcon />} label={selectedChild ? selectedChild.displayName : 'Kein Kind'} variant="outlined" />
            <Chip icon={<TaskAltRoundedIcon />} label={`${assignments.length} zugewiesen`} variant="outlined" />
          </Stack>
        </Box>

        <ChildFocusBar children={children} selectedChildId={selectedChildId} onChildChange={onChildChange} />

        {canManage ? (
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              bgcolor: 'action.hover',
              borderRadius: 2,
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 1fr) minmax(220px, 1.2fr) minmax(160px, 0.8fr) auto' },
              p: 1.5
            }}
          >
            <TextField
              disabled={children.length === 0}
              label="Kind"
              onChange={(event) => {
                const childProfileId = event.target.value;
                onFormChange({ ...form, childProfileId });
                onChildChange(childProfileId);
              }}
              required
              select
              size="small"
              value={form.childProfileId}
            >
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.displayName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={activeQuests.length === 0}
              label="Quest"
              onChange={(event) => onFormChange({ ...form, questId: event.target.value })}
              required
              select
              size="small"
              value={form.questId}
            >
              {activeQuests.map((quest) => (
                <MenuItem key={quest.id} value={quest.id}>
                  {quest.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Faellig am"
              onChange={(event) => onFormChange({ ...form, dueAt: event.target.value })}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={form.dueAt}
            />
            <Button
              disabled={!canAssign || saving}
              startIcon={<TaskAltRoundedIcon />}
              sx={{ minHeight: 40, width: { xs: '100%', md: 'auto' } }}
              type="submit"
              variant="contained"
            >
              Zuweisen
            </Button>
          </Box>
        ) : null}

        {loading ? <LinearProgress /> : null}

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { xs: '1fr', lg: assignments.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr' }
          }}
        >
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <QuestAssignmentRow
                assignment={assignment}
                canManage={canManage}
                completionSaving={completionSavingId === assignment.id}
                key={assignment.id}
                onApprove={onApprove}
                onComplete={onComplete}
                onReject={onReject}
              />
            ))
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">
                {children.length === 0 ? 'Noch kein Kind für Zuweisungen' : 'Noch keine Quest-Zuweisungen'}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface QuestTemplatesPanelProps {
  canManage: boolean;
  form: QuestFormState;
  quests: QuestTemplate[];
  saving: boolean;
  suggestions: QuestSuggestion[];
  onFormChange: (form: QuestFormState) => void;
  onSuggestionSelect: (suggestion: QuestSuggestion) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function QuestTemplatesPanel({
  canManage,
  form,
  quests,
  saving,
  suggestions,
  onFormChange,
  onSuggestionSelect,
  onSubmit
}: QuestTemplatesPanelProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<TaskAltRoundedIcon />} title="Quest-Vorlagen" />
          <Chip icon={<TaskAltRoundedIcon />} label={`${quests.length} Vorlagen`} variant="outlined" />
        </Box>

        {canManage ? (
          <Stack spacing={1.25}>
            <SuggestionLibraryButton
              actionLabel="Vorlagen"
              existingLabels={quests.map((quest) => quest.title)}
              getLabel={(suggestion) => suggestion.title}
              getMeta={(suggestion) =>
                `${suggestion.type === 'ONE_TIME' ? 'Einmalig' : 'Wiederkehrend'} | ${suggestion.xpReward} XP | ${suggestion.coinReward} Münzen`
              }
              suggestions={suggestions}
              title="Quest-Bibliothek"
              onSelect={onSuggestionSelect}
            />
            <EconomyHintPanel mode="quests" />
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 2,
                display: 'grid',
                gap: 1.25,
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                p: 1.5
              }}
            >
              <TextField
                autoComplete="off"
                label="Quest"
                onChange={(event) => onFormChange({ ...form, title: event.target.value })}
                required
                size="small"
                value={form.title}
              />
              <TextField
                autoComplete="off"
                label="Beschreibung"
                onChange={(event) => onFormChange({ ...form, description: event.target.value })}
                size="small"
                value={form.description}
              />
              <TextField
                label="Typ"
                onChange={(event) => {
                  const type = event.target.value as QuestType;
                  onFormChange({
                    ...form,
                    type,
                    frequency: type === 'ONE_TIME' ? 'NONE' : form.frequency === 'NONE' ? 'DAILY' : form.frequency
                  });
                }}
                select
                size="small"
                value={form.type}
              >
                <MenuItem value="ONE_TIME">Einmalig</MenuItem>
                <MenuItem value="RECURRING">Wiederkehrend</MenuItem>
              </TextField>
              <TextField
                disabled={form.type === 'ONE_TIME'}
                label="Rhythmus"
                onChange={(event) => onFormChange({ ...form, frequency: event.target.value as QuestFrequency })}
                select
                size="small"
                value={form.type === 'ONE_TIME' ? 'NONE' : form.frequency}
              >
                <MenuItem value="NONE">Kein Rhythmus</MenuItem>
                <MenuItem value="DAILY">Täglich</MenuItem>
                <MenuItem value="WEEKLY">Wöchentlich</MenuItem>
                <MenuItem value="CUSTOM">Individuell</MenuItem>
              </TextField>
              <TextField
                label="XP"
                onChange={(event) => onFormChange({ ...form, xpReward: event.target.value })}
                required
                size="small"
                slotProps={{ htmlInput: { min: 0, max: 10000 } }}
                type="number"
                value={form.xpReward}
              />
              <TextField
                label="Münzen"
                onChange={(event) => onFormChange({ ...form, coinReward: event.target.value })}
                required
                size="small"
                slotProps={{ htmlInput: { min: 0, max: 10000 } }}
                type="number"
                value={form.coinReward}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.requiresApproval}
                      onChange={(event) => onFormChange({ ...form, requiresApproval: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Bestätigung"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isAssignable}
                      onChange={(event) => onFormChange({ ...form, isAssignable: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Zuweisbar"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isSelfService}
                      onChange={(event) => onFormChange({ ...form, isSelfService: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Spontan"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(event) => onFormChange({ ...form, isActive: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Aktiv"
                />
              </Stack>
              <Button
                disabled={saving}
                startIcon={<TaskAltRoundedIcon />}
                sx={{ minHeight: 40, width: { xs: '100%', md: 'auto' } }}
                type="submit"
                variant="contained"
              >
                Erstellen
              </Button>
            </Box>
          </Stack>
        ) : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {quests.length > 0 ? (
            quests.map((quest) => <QuestTemplateRow key={quest.id} quest={quest} />)
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">Noch keine Quest-Vorlagen</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface SelfServiceQuestsPanelProps {
  children: ChildProfile[];
  completionSavingId: string | null;
  quests: QuestTemplate[];
  selectedChildId: string;
  onComplete: (questId: string) => void;
}

function SelfServiceQuestsPanel({
  children,
  completionSavingId,
  quests,
  selectedChildId,
  onComplete
}: SelfServiceQuestsPanelProps) {
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const selfServiceQuests = quests.filter((quest) => quest.isActive && quest.isSelfService);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <SectionTitle icon={<AutoAwesomeRoundedIcon />} title="Spontane Quests" />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip icon={<TaskAltRoundedIcon />} label={`${selfServiceQuests.length} bereit`} variant="outlined" />
            <Chip
              icon={<PeopleAltRoundedIcon />}
              label={selectedChild ? selectedChild.displayName : 'Kein Kind'}
              variant="outlined"
            />
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {selectedChild && selfServiceQuests.length > 0 ? (
            selfServiceQuests.map((quest) => (
              <SelfServiceQuestRow
                key={quest.id}
                quest={quest}
                saving={completionSavingId === `self-service:${quest.id}`}
                onComplete={onComplete}
              />
            ))
          ) : (
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Typography color="text.secondary">
                {selectedChild ? 'Noch keine spontanen Quests aktiv' : 'Noch kein Kind für spontane Quests ausgewählt'}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface SelfServiceQuestRowProps {
  quest: QuestTemplate;
  saving: boolean;
  onComplete: (questId: string) => void;
}

function SelfServiceQuestRow({ quest, saving, onComplete }: SelfServiceQuestRowProps) {
  return (
    <Box
      sx={{
        alignContent: 'space-between',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        minHeight: 170,
        p: 1.5
      }}
    >
      <Stack spacing={0.75}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' }, justifyContent: 'space-between', minWidth: 0 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {quest.title}
            </Typography>
            {quest.description ? (
              <Typography color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }} variant="body2">
                {quest.description}
              </Typography>
            ) : null}
          </Box>
          <Chip color="success" label="Spontan" size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', minWidth: 0 }}>
          <Chip label={quest.type === 'ONE_TIME' ? 'Einmalig' : frequencyLabel(quest.frequency)} size="small" variant="outlined" />
          <Chip icon={<EmojiEventsRoundedIcon />} label={`${quest.xpReward} XP`} size="small" variant="outlined" />
          <Chip icon={<PaidRoundedIcon />} label={`${quest.coinReward}`} size="small" variant="outlined" />
        </Stack>
      </Stack>
      <Button
        disabled={saving}
        onClick={() => onComplete(quest.id)}
        size="small"
        startIcon={<TaskAltRoundedIcon />}
        variant="contained"
      >
        Ich hab's erledigt
      </Button>
    </Box>
  );
}

interface SuggestionLibraryButtonProps<TSuggestion extends { category: string; description: string; id: string }> {
  actionLabel: string;
  existingLabels: string[];
  getLabel: (suggestion: TSuggestion) => string;
  getMeta: (suggestion: TSuggestion) => string;
  suggestions: TSuggestion[];
  title: string;
  onSelect: (suggestion: TSuggestion) => void;
}

function SuggestionLibraryButton<TSuggestion extends { category: string; description: string; id: string }>({
  actionLabel,
  existingLabels,
  getLabel,
  getMeta,
  suggestions,
  title,
  onSelect
}: SuggestionLibraryButtonProps<TSuggestion>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const existingLabelSet = useMemo(() => new Set(existingLabels.map(normalizeSuggestionLabel)), [existingLabels]);
  const availableSuggestions = useMemo(
    () => suggestions.filter((suggestion) => !existingLabelSet.has(normalizeSuggestionLabel(getLabel(suggestion)))),
    [existingLabelSet, getLabel, suggestions]
  );
  const categories = useMemo(
    () => ['Alle', ...Array.from(new Set(availableSuggestions.map((suggestion) => suggestion.category))).sort()],
    [availableSuggestions]
  );
  const visibleSuggestions = useMemo(() => {
    const normalizedQuery = normalizeSuggestionLabel(query);

    return availableSuggestions.filter((suggestion) => {
      const matchesCategory = category === 'Alle' || suggestion.category === category;
      const searchable = `${getLabel(suggestion)} ${suggestion.description} ${suggestion.category} ${getMeta(suggestion)}`;
      const matchesQuery = normalizedQuery.length === 0 || normalizeSuggestionLabel(searchable).includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [availableSuggestions, category, getLabel, getMeta, query]);

  function closeDialog() {
    setOpen(false);
    setQuery('');
    setCategory('Alle');
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          disabled={availableSuggestions.length === 0}
          onClick={() => setOpen(true)}
          size="small"
          startIcon={<LibraryBooksRoundedIcon />}
          variant="outlined"
        >
          {actionLabel}
        </Button>
      </Box>

      <Dialog fullWidth maxWidth="md" onClose={closeDialog} open={open}>
        <DialogTitle
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            justifyContent: 'space-between',
            pb: 1
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
              <LibraryBooksRoundedIcon />
            </Box>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {title}
            </Typography>
            <Chip label={`${availableSuggestions.length} offen`} size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} variant="outlined" />
          </Stack>
          <Tooltip title="Schließen">
            <IconButton aria-label="Schließen" onClick={closeDialog} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, maxHeight: { xs: 'calc(100dvh - 96px)', sm: 'none' }, pt: 1 }}>
          <TextField
            autoComplete="off"
            label="Suchen"
            onChange={(event) => setQuery(event.target.value)}
            size="small"
            value={query}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: { xs: 'nowrap', sm: 'wrap' },
              overflowX: { xs: 'auto', sm: 'visible' },
              pb: { xs: 0.5, sm: 0 },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {categories.map((categoryOption) => (
              <Chip
                color={category === categoryOption ? 'primary' : 'default'}
                key={categoryOption}
                label={categoryOption}
                onClick={() => setCategory(categoryOption)}
                variant={category === categoryOption ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              maxHeight: { xs: '55vh', md: '58vh' },
              overflow: 'auto',
              pr: 0.5
            }}
          >
            {visibleSuggestions.length > 0 ? (
              visibleSuggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  onClick={() => {
                    onSelect(suggestion);
                    closeDialog();
                  }}
                  sx={{
                    alignItems: 'stretch',
                    borderColor: 'divider',
                    color: 'text.primary',
                    display: 'grid',
                    gap: 0.75,
                    justifyContent: 'stretch',
                    minWidth: 0,
                    minHeight: 112,
                    p: 1.25,
                    textAlign: 'left'
                  }}
                  variant="outlined"
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900 }} noWrap>
                      {getLabel(suggestion)}
                    </Typography>
                    <Chip label={suggestion.category} size="small" variant="outlined" />
                  </Stack>
                  <Typography color="text.secondary" sx={{ whiteSpace: 'normal' }} variant="body2">
                    {suggestion.description}
                  </Typography>
                  <Typography color="primary" sx={{ fontWeight: 800 }} variant="body2">
                    {getMeta(suggestion)}
                  </Typography>
                </Button>
              ))
            ) : (
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, gridColumn: '1 / -1', p: 1.5 }}>
                <Typography color="text.secondary">Keine passende Vorlage</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface RewardVisualPickerProps {
  value: string;
  onChange: (imageUrl: string) => void;
}

function RewardVisualPicker({ value, onChange }: RewardVisualPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Alle');
  const selectedOption = useMemo(() => getRewardVisualOptionByUrl(value), [value]);
  const categories = useMemo(
    () => ['Alle', ...Array.from(new Set(REWARD_VISUAL_OPTIONS.map((option) => option.category))).sort()],
    []
  );
  const visibleOptions = useMemo(() => {
    const normalizedQuery = normalizeSuggestionLabel(query);

    return REWARD_VISUAL_OPTIONS.filter((option) => {
      const matchesCategory = category === 'Alle' || option.category === category;
      const searchable = `${option.label} ${option.category} ${option.keywords.join(' ')} ${option.icon}`;
      const matchesQuery =
        normalizedQuery.length === 0 || normalizeSuggestionLabel(searchable).includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function closeDialog() {
    setOpen(false);
    setQuery('');
    setCategory('Alle');
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          gridColumn: { md: 'span 2' },
          p: 1.25
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <Box
            sx={{
              alignItems: 'center',
              aspectRatio: '1 / 1',
              bgcolor: 'action.hover',
              borderRadius: 2,
              color: 'secondary.main',
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              width: 56
            }}
          >
            {value ? (
              <Box
                alt=""
                component="img"
                src={value}
                sx={{
                  height: '100%',
                  objectFit: isIconVisualUrl(value) ? 'contain' : 'cover',
                  p: isIconVisualUrl(value) ? 1.1 : 0,
                  width: '100%'
                }}
              />
            ) : (
              <AutoAwesomeRoundedIcon />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 900 }} noWrap>
                {selectedOption?.label ?? (value ? 'Eigenes Bild' : 'Motiv')}
              </Typography>
              <Chip
                label={selectedOption?.category ?? (value ? 'URL' : 'Optional')}
                size="small"
                variant="outlined"
              />
            </Stack>
            <Typography color="text.secondary" noWrap variant="body2">
              {value || 'Motiv wählen oder unten eigene Bild-URL eintragen'}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexShrink: 0 }}>
            <Button onClick={() => setOpen(true)} size="small" startIcon={<AutoAwesomeRoundedIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }} variant="outlined">
              Motiv wählen
            </Button>
            {value ? (
              <Button color="inherit" onClick={() => onChange('')} size="small" sx={{ width: { xs: '100%', sm: 'auto' } }} variant="text">
                Entfernen
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <Dialog fullWidth maxWidth="md" onClose={closeDialog} open={open}>
        <DialogTitle
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            justifyContent: 'space-between',
            pb: 1
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
              <AutoAwesomeRoundedIcon />
            </Box>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              Motiv-Picker
            </Typography>
            <Chip label={`${REWARD_VISUAL_OPTIONS.length} Motive`} size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} variant="outlined" />
          </Stack>
          <Tooltip title="Schließen">
            <IconButton aria-label="Schließen" onClick={closeDialog} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, maxHeight: { xs: 'calc(100dvh - 96px)', sm: 'none' }, pt: 1 }}>
          <TextField
            autoComplete="off"
            label="Suchen"
            onChange={(event) => setQuery(event.target.value)}
            size="small"
            value={query}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: { xs: 'nowrap', sm: 'wrap' },
              overflowX: { xs: 'auto', sm: 'visible' },
              pb: { xs: 0.5, sm: 0 },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {categories.map((categoryOption) => (
              <Chip
                color={category === categoryOption ? 'primary' : 'default'}
                key={categoryOption}
                label={categoryOption}
                onClick={() => setCategory(categoryOption)}
                variant={category === categoryOption ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              maxHeight: { xs: '58vh', md: '60vh' },
              overflow: 'auto',
              pr: 0.5
            }}
          >
            {visibleOptions.length > 0 ? (
              visibleOptions.map((option) => {
                const selected = value === option.url;

                return (
                  <Button
                    key={option.id}
                    onClick={() => {
                      onChange(option.url);
                      closeDialog();
                    }}
                    sx={{
                      alignItems: 'center',
                      bgcolor: selected ? 'rgba(37, 104, 216, 0.08)' : 'background.paper',
                      borderColor: selected ? 'primary.main' : 'divider',
                      color: 'text.primary',
                      display: 'grid',
                      gap: 0.75,
                      justifyContent: 'stretch',
                      minWidth: 0,
                      minHeight: 132,
                      p: 1,
                      textAlign: 'center'
                    }}
                    variant="outlined"
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        aspectRatio: '1 / 1',
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        justifySelf: 'center',
                        width: 56
                      }}
                    >
                      <Box
                        alt=""
                        component="img"
                        src={option.url}
                        sx={{ height: 38, objectFit: 'contain', width: 38 }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 900 }} noWrap variant="body2">
                      {option.label}
                    </Typography>
                    <Typography color="text.secondary" noWrap variant="caption">
                      {option.category}
                    </Typography>
                  </Button>
                );
              })
            ) : (
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, gridColumn: '1 / -1', p: 1.5 }}>
                <Typography color="text.secondary">Kein passendes Motiv</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

function createMdiIconUrl(icon: string, color: string) {
  return `https://api.iconify.design/mdi:${icon}.svg?color=%23${color}`;
}

function getRewardVisualOptionByUrl(url: string) {
  return REWARD_VISUAL_OPTIONS.find((option) => option.url === url);
}

function isIconVisualUrl(url: string | null | undefined) {
  return Boolean(url?.startsWith('https://api.iconify.design/mdi:'));
}

function findRewardVisualForSuggestion(suggestion: RewardSuggestion) {
  const searchable = normalizeSuggestionLabel(`${suggestion.name} ${suggestion.description} ${suggestion.category}`);

  return REWARD_VISUAL_OPTIONS.find((option) =>
    [option.label, option.category, ...option.keywords].some((term) =>
      searchable.includes(normalizeSuggestionLabel(term))
    )
  );
}

function normalizeSuggestionLabel(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

interface FeatureTileProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function FeatureTile({ icon, label, value }: FeatureTileProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'flex',
        gap: 1.5,
        p: 1.5
      }}
    >
      <Box sx={{ color: 'secondary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontWeight: 800 }}>{label}</Typography>
        <Typography color="text.secondary" variant="body2">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

interface ChildRowProps {
  child: {
    id: string;
    displayName: string;
    avatarKey: string | null;
    level: number;
    xp: number;
    coins: number;
    pinEnabled: boolean;
  };
  maxXp: number;
  onOpen: () => void;
}

function ChildRow({ child, maxXp, onOpen }: ChildRowProps) {
  const progress = Math.min((child.xp / maxXp) * 100, 100);

  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', md: '56px minmax(180px, 0.7fr) minmax(0, 1fr) auto auto auto' },
        p: 1.5
      }}
    >
      <AvatarBadge avatarKey={child.avatarKey} name={child.displayName} size="small" />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {child.displayName}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Level {child.level}
        </Typography>
      </Box>
      <Stack spacing={0.75} sx={{ justifyContent: 'center' }}>
        <LinearProgress value={progress} variant="determinate" />
        <Typography color="text.secondary" variant="body2">
          {child.xp} XP
        </Typography>
      </Stack>
      <Chip color={child.pinEnabled ? 'success' : 'default'} label={child.pinEnabled ? 'PIN' : 'Keine PIN'} variant="outlined" />
      <Chip icon={<PaidRoundedIcon />} label={child.coins} variant="outlined" />
      <Button onClick={onOpen} size="small" variant="outlined">
        Profil
      </Button>
    </Box>
  );
}

interface QuestTemplateRowProps {
  quest: QuestTemplate;
}

function QuestTemplateRow({ quest }: QuestTemplateRowProps) {
  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) auto auto auto' },
        p: 1.5
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 900 }} noWrap>
            {quest.title}
          </Typography>
          {!quest.isActive ? <Chip color="default" label="Inaktiv" size="small" /> : null}
        </Stack>
        {quest.description ? (
          <Typography color="text.secondary" noWrap variant="body2">
            {quest.description}
          </Typography>
        ) : null}
      </Box>
      <Chip label={quest.type === 'ONE_TIME' ? 'Einmalig' : frequencyLabel(quest.frequency)} variant="outlined" />
      <Chip color={quest.isAssignable ? 'success' : 'default'} label={quest.isAssignable ? 'Zuweisbar' : 'Nicht zuweisbar'} variant="outlined" />
      <Chip color={quest.isSelfService ? 'success' : 'default'} label={quest.isSelfService ? 'Spontan' : 'Planbar'} variant="outlined" />
      <Chip icon={<EmojiEventsRoundedIcon />} label={`${quest.xpReward} XP`} variant="outlined" />
      <Chip icon={<PaidRoundedIcon />} label={quest.coinReward} variant="outlined" />
    </Box>
  );
}

interface QuestAssignmentRowProps {
  assignment: QuestAssignment;
  canManage: boolean;
  completionSaving: boolean;
  onApprove: (assignmentId: string, completionId: string) => void;
  onComplete: (assignmentId: string) => void;
  onReject: (assignmentId: string, completionId: string) => void;
}

function QuestAssignmentRow({
  assignment,
  canManage,
  completionSaving,
  onApprove,
  onComplete,
  onReject
}: QuestAssignmentRowProps) {
  const latestCompletion = assignment.completions?.[0] ?? null;
  const hasBlockingCompletion =
    latestCompletion?.status === 'SUBMITTED' ||
    (assignment.quest.type === 'ONE_TIME' && latestCompletion?.status === 'APPROVED');
  const completionButtonLabel = latestCompletion?.status === 'REJECTED' ? 'Erneut einreichen' : 'Erledigt einreichen';
  const canReview = canManage && latestCompletion?.status === 'SUBMITTED';
  const statusLabel = latestCompletion ? completionStatusLabel(latestCompletion.status) : 'Bereit';
  const statusColor = latestCompletion ? completionStatusColor(latestCompletion.status) : 'default';

  return (
    <Box
      sx={{
        alignContent: 'space-between',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        minHeight: 190,
        p: 1.5
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {assignment.quest.title}
            </Typography>
            {assignment.quest.description ? (
              <Typography color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }} variant="body2">
                {assignment.quest.description}
              </Typography>
            ) : null}
          </Box>
          <Chip
            color={statusColor}
            label={statusLabel}
            size="small"
            variant={latestCompletion?.status === 'SUBMITTED' ? 'filled' : 'outlined'}
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label={assignment.quest.type === 'ONE_TIME' ? 'Einmalig' : frequencyLabel(assignment.quest.frequency)} size="small" variant="outlined" />
          <Chip label={assignment.dueAt ? formatDateLabel(assignment.dueAt) : 'Ohne Datum'} size="small" variant="outlined" />
          <Chip icon={<EmojiEventsRoundedIcon />} label={`${assignment.quest.xpReward} XP`} size="small" variant="outlined" />
          <Chip icon={<PaidRoundedIcon />} label={`${assignment.quest.coinReward}`} size="small" variant="outlined" />
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={0.75}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap', justifyContent: 'space-between' }}
      >
        <Button
          disabled={completionSaving || hasBlockingCompletion}
          onClick={() => onComplete(assignment.id)}
          size="small"
          startIcon={<TaskAltRoundedIcon />}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant={hasBlockingCompletion ? 'outlined' : 'contained'}
        >
          {hasBlockingCompletion ? statusLabel : completionButtonLabel}
        </Button>
      {canReview && latestCompletion ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            color="success"
            disabled={completionSaving}
            onClick={() => onApprove(assignment.id, latestCompletion.id)}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            variant="contained"
          >
            Bestätigen
          </Button>
          <Button
            color="error"
            disabled={completionSaving}
            onClick={() => onReject(assignment.id, latestCompletion.id)}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            variant="outlined"
          >
            Ablehnen
          </Button>
        </Stack>
      ) : null}
      </Stack>
    </Box>
  );
}

interface RewardRowProps {
  reward: Reward;
}

function RewardRow({ reward }: RewardRowProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: { xs: '1fr', sm: '72px minmax(0, 1fr)', md: '72px minmax(220px, 1fr) auto auto auto auto' },
        p: 1.5
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          aspectRatio: '1 / 1',
          bgcolor: 'background.paper',
          borderRadius: 2,
          color: 'secondary.main',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          width: { xs: 56, sm: 72 }
        }}
      >
        {reward.imageUrl ? (
          <Box
            alt=""
            component="img"
            src={reward.imageUrl}
            sx={{
              height: '100%',
              objectFit: isIconVisualUrl(reward.imageUrl) ? 'contain' : 'cover',
              p: isIconVisualUrl(reward.imageUrl) ? 1.35 : 0,
              width: '100%'
            }}
          />
        ) : (
          <StorefrontRoundedIcon />
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 900 }} noWrap>
            {reward.name}
          </Typography>
          {!reward.isActive ? <Chip color="default" label="Inaktiv" size="small" /> : null}
        </Stack>
        {reward.description ? (
          <Typography color="text.secondary" noWrap variant="body2">
            {reward.description}
          </Typography>
        ) : null}
      </Box>
      <Chip icon={<PaidRoundedIcon />} label={reward.price} variant="outlined" />
      <Chip label={reward.category || 'Allgemein'} variant="outlined" />
      <Chip label={reward.requiresApproval ? 'Mit Bestätigung' : 'Sofort'} variant="outlined" />
      <Chip label={reward.maxRedemptions ? `Max. ${reward.maxRedemptions}` : 'Unbegrenzt'} variant="outlined" />
    </Box>
  );
}

interface RewardShopRowProps {
  child: ChildProfile;
  redeeming: boolean;
  reward: Reward;
  onRedeem: (rewardId: string) => void;
}

function RewardShopRow({ child, redeeming, reward, onRedeem }: RewardShopRowProps) {
  const canAfford = child.coins >= reward.price;
  const actionLabel = reward.requiresApproval ? 'Beantragen' : 'Einlösen';
  const missingCoins = Math.max(reward.price - child.coins, 0);

  return (
    <Box
      sx={{
        alignContent: 'space-between',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: { xs: 1, sm: 1.25 },
        gridTemplateColumns: { xs: '56px minmax(0, 1fr)', sm: '72px minmax(0, 1fr)' },
        minHeight: { xs: 'auto', sm: 190 },
        p: { xs: 1.25, sm: 1.5 }
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          aspectRatio: '1 / 1',
          bgcolor: 'background.paper',
          borderRadius: 2,
          color: 'secondary.main',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          width: { xs: 56, sm: 72 }
        }}
      >
        {reward.imageUrl ? (
          <Box
            alt=""
            component="img"
            src={reward.imageUrl}
            sx={{
              height: '100%',
              objectFit: isIconVisualUrl(reward.imageUrl) ? 'contain' : 'cover',
              p: isIconVisualUrl(reward.imageUrl) ? 1.35 : 0,
              width: '100%'
            }}
          />
        ) : (
          <StorefrontRoundedIcon />
        )}
      </Box>
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900 }} noWrap>
            {reward.name}
          </Typography>
          {reward.description ? (
            <Typography color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }} variant="body2">
              {reward.description}
            </Typography>
          ) : null}
        </Box>
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', minWidth: 0 }}>
          <Chip icon={<PaidRoundedIcon />} label={`${reward.price}`} size="small" variant="outlined" />
          <Chip color={canAfford ? 'success' : 'warning'} label={canAfford ? 'Bezahlbar' : `Noch ${missingCoins} Münzen`} size="small" variant={canAfford ? 'filled' : 'outlined'} />
          <Chip label={reward.requiresApproval ? 'Anfrage' : 'Sofort'} size="small" variant="outlined" />
        </Stack>
        <Button
          disabled={!canAfford || redeeming}
          onClick={() => onRedeem(reward.id)}
          size="small"
          startIcon={<StorefrontRoundedIcon />}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant={canAfford ? 'contained' : 'outlined'}
        >
          {canAfford ? actionLabel : 'Noch sparen'}
        </Button>
      </Stack>
    </Box>
  );
}

interface RewardRedemptionRowProps {
  canManage: boolean;
  redemption: RewardRedemption;
  saving: boolean;
  onApprove: (redemptionId: string) => void;
  onCancel: (redemptionId: string) => void;
  onMarkRedeemed: (redemptionId: string) => void;
  onReject: (redemptionId: string) => void;
}

function RewardRedemptionRow({
  canManage,
  redemption,
  saving,
  onApprove,
  onCancel,
  onMarkRedeemed,
  onReject
}: RewardRedemptionRowProps) {
  const canReview = canManage && redemption.status === 'REQUESTED';
  const canMarkRedeemed = canManage && redemption.status === 'APPROVED';
  const canCancel = canManage && (redemption.status === 'REQUESTED' || redemption.status === 'APPROVED');

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) auto auto auto auto' },
        p: 1.5
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {redemption.reward.name}
        </Typography>
        <Typography color="text.secondary" noWrap variant="body2">
          {redemption.childProfile.displayName} - {formatDateLabel(redemption.requestedAt)}
        </Typography>
      </Box>
      <Chip icon={<PaidRoundedIcon />} label={redemption.coinCost} variant="outlined" />
      <Chip
        color={rewardRedemptionStatusColor(redemption.status)}
        label={rewardRedemptionStatusLabel(redemption.status)}
        variant={redemption.status === 'REQUESTED' ? 'filled' : 'outlined'}
      />
      {canReview ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            color="success"
            disabled={saving}
            onClick={() => onApprove(redemption.id)}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            variant="contained"
          >
            Bestätigen
          </Button>
          <Button
            color="error"
            disabled={saving}
            onClick={() => onReject(redemption.id)}
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            variant="outlined"
          >
            Ablehnen
          </Button>
        </Stack>
      ) : null}
      {canMarkRedeemed ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button
            disabled={saving}
            onClick={() => onMarkRedeemed(redemption.id)}
            size="small"
            startIcon={<StorefrontRoundedIcon />}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
            variant="contained"
          >
            Ausgegeben
          </Button>
          {canCancel ? (
            <Button
              disabled={saving}
              onClick={() => onCancel(redemption.id)}
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
              variant="outlined"
            >
              Stornieren
            </Button>
          ) : null}
        </Stack>
      ) : null}
      {canReview && canCancel ? (
        <Button
          disabled={saving}
          onClick={() => onCancel(redemption.id)}
          size="small"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          variant="outlined"
        >
          Stornieren
        </Button>
      ) : null}
    </Box>
  );
}

function completionStatusLabel(status: QuestCompletionStatus): string {
  switch (status) {
    case 'SUBMITTED':
      return 'Eingereicht';
    case 'APPROVED':
      return 'Bestätigt';
    case 'REJECTED':
      return 'Abgelehnt';
    default:
      return 'Offen';
  }
}

function rewardRedemptionStatusLabel(status: RewardRedemptionStatus): string {
  switch (status) {
    case 'REQUESTED':
      return 'Angefragt';
    case 'APPROVED':
      return 'Freigegeben';
    case 'REJECTED':
      return 'Abgelehnt';
    case 'CANCELLED':
      return 'Storniert';
    case 'REDEEMED':
      return 'Eingelöst';
    default:
      return 'Unbekannt';
  }
}

function rewardRedemptionStatusColor(status: RewardRedemptionStatus): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'REQUESTED':
      return 'warning';
    case 'APPROVED':
    case 'REDEEMED':
      return 'success';
    case 'REJECTED':
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

function completionStatusColor(status: QuestCompletionStatus): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'SUBMITTED':
      return 'warning';
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
}

function frequencyLabel(frequency: QuestFrequency): string {
  switch (frequency) {
    case 'DAILY':
      return 'Täglich';
    case 'WEEKLY':
      return 'Wöchentlich';
    case 'CUSTOM':
      return 'Individuell';
    case 'NONE':
    default:
      return 'Kein Rhythmus';
  }
}

function formatDateLabel(value: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
}

interface SectionTitleProps {
  icon: ReactNode;
  title: string;
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Typography variant="h6">{title}</Typography>
    </Stack>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 900 }}>{value}</Typography>
    </Box>
  );
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT';
  token?: string;
  body?: unknown;
}

function resolveSelectedChildId(children: ChildProfile[], preferredChildId: string): string {
  if (preferredChildId && children.some((child) => child.id === preferredChildId)) {
    return preferredChildId;
  }

  return children[0]?.id ?? '';
}

function resolveSelectedChildLoginProfileId(
  profiles: ChildLoginProfile[],
  preferredProfileId: string
): string {
  if (preferredProfileId && profiles.some((profile) => profile.id === preferredProfileId)) {
    return preferredProfileId;
  }

  return profiles[0]?.id ?? '';
}

function resolveSelectedQuestId(quests: QuestTemplate[], preferredQuestId: string): string {
  const activeQuests = quests.filter((quest) => quest.isActive);

  if (preferredQuestId && activeQuests.some((quest) => quest.id === preferredQuestId)) {
    return preferredQuestId;
  }

  return activeQuests[0]?.id ?? '';
}

function resolveAvatarPreset(avatarKey: string | null | undefined, displayName: string): AvatarPreset {
  const preset = AVATAR_PRESETS.find((avatar) => avatar.key === avatarKey);

  if (preset) {
    return preset;
  }

  const fallback = AVATAR_PRESETS[Math.abs(hashString(displayName)) % AVATAR_PRESETS.length];
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return {
    ...fallback,
    initials: initials || fallback.initials
  };
}

function getNextAvatarUnlock(level: number) {
  return AVATAR_UNLOCKS.find((unlock) => unlock.level > level) ?? null;
}

function hashString(value: string) {
  return Array.from(value).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 0);
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unerwarteter Fehler';
}

export default App;

