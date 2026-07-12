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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
const TOKEN_STORAGE_KEY = 'questory.accessToken';

type AuthMode = 'login' | 'register' | 'child';
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
  avatarKey: string;
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
  avatarKey: ''
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
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setDashboard(null);
      setChildStats(null);
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
      setShopRewards([]);
      return;
    }

    setAssignmentLoading(true);
    setChildStatsLoading(true);
    setShopLoading(true);

    try {
      const [assignments, childShopRewards, stats] = await Promise.all([
        apiRequest<QuestAssignment[]>(`/children/${childProfileId}/quest-assignments`, {
          token: activeToken
        }),
        apiRequest<Reward[]>(`/children/${childProfileId}/shop`, {
          token: activeToken
        }),
        apiRequest<ChildStatsResponse>(`/children/${childProfileId}/stats`, {
          token: activeToken
        })
      ]);
      setQuestAssignments(assignments);
      setShopRewards(childShopRewards);
      setChildStats(stats);
    } finally {
      setAssignmentLoading(false);
      setChildStatsLoading(false);
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
    setShopLoading(true);
    setError(null);

    try {
      const [assignments, childShopRewards, stats] = await Promise.all([
        apiRequest<QuestAssignment[]>(`/children/${childProfileId}/quest-assignments`, {
          token
        }),
        apiRequest<Reward[]>(`/children/${childProfileId}/shop`, {
          token
        }),
        apiRequest<ChildStatsResponse>(`/children/${childProfileId}/stats`, {
          token
        })
      ]);
      setQuestAssignments(assignments);
      setShopRewards(childShopRewards);
      setChildStats(stats);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAssignmentLoading(false);
      setChildStatsLoading(false);
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
          avatarKey: childForm.avatarKey || undefined
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
    setRewardForm({
      name: suggestion.name,
      description: suggestion.description,
      imageUrl: '',
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

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setDashboard(null);
    setChildStats(null);
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
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
          alignItems: 'center',
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between'
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
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
            value={authMode}
            variant="fullWidth"
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
              XP, Muenzen, Belohnungen und Familienfortschritt.
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
            <FeatureTile icon={<PaidRoundedIcon />} label="Muenzen" value="Shop" />
            <FeatureTile icon={<EmojiEventsRoundedIcon />} label="Level" value="Fortschritt" />
            <FeatureTile icon={<StorefrontRoundedIcon />} label="Rewards" value="Einloesen" />
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
        <MetricCard icon={<PaidRoundedIcon />} label="Muenzen" value={dashboard.totals.coins} />
        <MetricCard icon={<StorefrontRoundedIcon />} label="Offene Rewards" value={dashboard.rewards.requested} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.5fr) minmax(360px, 0.5fr)' }
        }}
      >
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

            {canManageChildren ? (
              <Stack spacing={1.25}>
                <Box
                  component="form"
                  onSubmit={onChildSubmit}
                  sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    display: 'grid',
                    gap: 1.25,
                    gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 1fr) minmax(160px, 0.8fr) auto' },
                    p: 1.5
                  }}
                >
                  <TextField
                    autoComplete="off"
                    label="Kindername"
                    onChange={(event) =>
                      onChildFormChange({ ...childForm, displayName: event.target.value })
                    }
                    required
                    size="small"
                    value={childForm.displayName}
                  />
                  <TextField
                    autoComplete="off"
                    label="Avatar-Key"
                    onChange={(event) => onChildFormChange({ ...childForm, avatarKey: event.target.value })}
                    size="small"
                    value={childForm.avatarKey}
                  />
                  <Button
                    disabled={childSaving}
                    startIcon={<PersonAddRoundedIcon />}
                    sx={{ minHeight: 40 }}
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
                      onChange={(event) =>
                        onChildPinFormChange({ ...childPinForm, childProfileId: event.target.value })
                      }
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
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Chip
                        color={selectedPinChild?.pinEnabled ? 'success' : 'default'}
                        label={selectedPinChild?.pinEnabled ? 'PIN aktiv' : 'PIN aus'}
                        variant="outlined"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
                childRows.map((child) => <ChildRow child={child} key={child.id} maxXp={xpMax} />)
              ) : (
                <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
                  <Typography color="text.secondary">Noch keine Kinderprofile</Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack spacing={2}>
            <SectionTitle icon={<ShieldRoundedIcon />} title="Familienlage" />
            <SummaryRow label="Eltern/Admins" value={dashboard.totals.parents} />
            <SummaryRow label="Kinderkonten" value={dashboard.totals.childUsers} />
            <Divider />
            <SummaryRow label="Quest-Abschluesse" value={dashboard.quests.totalCompletions} />
            <SummaryRow label="Bestaetigt" value={dashboard.quests.approved} />
            <SummaryRow label="Eingereicht" value={dashboard.quests.submitted} />
            <Divider />
            <SummaryRow label="Rewards aktiv" value={dashboard.totals.activeRewards} />
            <SummaryRow label="Rewards eingeloest" value={dashboard.rewards.redeemed} />
            <SummaryRow label="Coins gebunden" value={dashboard.rewards.coinsSpent} />
          </Stack>
        </Paper>
      </Box>

      <ChildStatsPanel loading={childStatsLoading} stats={childStats} />

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

      <QuestAssignmentsPanel
        assignments={assignments}
        canManage={canManageChildren}
        children={children}
        completionSavingId={completionSavingId}
        form={assignmentForm}
        loading={assignmentLoading}
        quests={quests}
        saving={assignmentSaving}
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

      <RewardShopPanel
        children={children}
        redeemingRewardId={redeemingRewardId}
        selectedChildId={assignmentForm.childProfileId}
        shopLoading={shopLoading}
        shopRewards={shopRewards}
        onRedeem={onRewardRedeem}
      />

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
    </Stack>
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
          <SectionTitle icon={<ShieldRoundedIcon />} title="Einloeseanfragen" />
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
              <Typography color="text.secondary">Noch keine Einloeseanfragen</Typography>
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
}

function ChildStatsPanel({ loading, stats }: ChildStatsPanelProps) {
  const nextLevelXp = Math.max(stats?.progression.nextLevelXp ?? 1, 1);
  const xpProgress = stats ? Math.min((stats.progression.xp / nextLevelXp) * 100, 100) : 0;

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
          <SectionTitle icon={<EmojiEventsRoundedIcon />} title="Kinderstatistik" />
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
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(260px, 0.9fr) minmax(0, 1.1fr)' }
            }}
          >
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 900 }}>Level {stats.progression.level}</Typography>
                  <Chip icon={<PaidRoundedIcon />} label={stats.progression.coins} variant="outlined" />
                </Stack>
                <LinearProgress value={xpProgress} variant="determinate" />
                <Typography color="text.secondary" variant="body2">
                  {stats.progression.xp} XP - noch {stats.progression.xpToNextLevel} XP bis Level {stats.progression.level + 1}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 1,
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }
              }}
            >
              <StatTile label="Zuweisungen" value={stats.quests.assigned} />
              <StatTile label="Bestaetigt" value={stats.quests.approved} />
              <StatTile label="Eingereicht" value={stats.quests.submitted} />
              <StatTile label="XP vergeben" value={stats.quests.xpGranted} />
              <StatTile label="Rewards offen" value={stats.rewards.requested} />
              <StatTile label="Coins gebunden" value={stats.rewards.coinsSpent} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5 }}>
            <Typography color="text.secondary">Noch kein Kind fuer Statistiken ausgewaehlt</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
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

interface RewardShopPanelProps {
  children: ChildProfile[];
  redeemingRewardId: string | null;
  selectedChildId: string;
  shopLoading: boolean;
  shopRewards: Reward[];
  onRedeem: (rewardId: string) => void;
}

function RewardShopPanel({
  children,
  redeemingRewardId,
  selectedChildId,
  shopLoading,
  shopRewards,
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
              label={selectedChild ? `${selectedChild.coins} Muenzen` : 'Kein Kind'}
              variant="outlined"
            />
          </Stack>
        </Box>

        {shopLoading ? <LinearProgress /> : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
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
                {selectedChild ? 'Noch keine aktiven Belohnungen im Shop' : 'Noch kein Kind fuer den Shop ausgewaehlt'}
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
              getMeta={(suggestion) => `${suggestion.price} Muenzen`}
              suggestions={suggestions}
              title="Shop-Bibliothek"
              onSelect={onSuggestionSelect}
            />
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
              <TextField
                autoComplete="off"
                label="Bild-URL"
                onChange={(event) => onFormChange({ ...form, imageUrl: event.target.value })}
                size="small"
                sx={{ gridColumn: { md: 'span 2' } }}
                value={form.imageUrl}
              />
              <TextField
                label="Max. Einloesungen"
                onChange={(event) => onFormChange({ ...form, maxRedemptions: event.target.value })}
                size="small"
                slotProps={{ htmlInput: { min: 1, max: 10000 } }}
                type="number"
                value={form.maxRedemptions}
              />
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.requiresApproval}
                      onChange={(event) => onFormChange({ ...form, requiresApproval: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Bestaetigung"
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
                sx={{ minHeight: 40 }}
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
  onApprove,
  onChildChange,
  onComplete,
  onFormChange,
  onReject,
  onSubmit
}: QuestAssignmentsPanelProps) {
  const activeQuests = quests.filter((quest) => quest.isActive);
  const canAssign = canManage && children.length > 0 && activeQuests.length > 0;

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
          <Chip icon={<TaskAltRoundedIcon />} label={`${assignments.length} zugewiesen`} variant="outlined" />
        </Box>

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
              sx={{ minHeight: 40 }}
              type="submit"
              variant="contained"
            >
              Zuweisen
            </Button>
          </Box>
        ) : null}

        {loading ? <LinearProgress /> : null}

        <Box sx={{ display: 'grid', gap: 1.5 }}>
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
                {children.length === 0 ? 'Noch kein Kind fuer Zuweisungen' : 'Noch keine Quest-Zuweisungen'}
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
                `${suggestion.type === 'ONE_TIME' ? 'Einmalig' : 'Wiederkehrend'} | ${suggestion.xpReward} XP | ${suggestion.coinReward} Muenzen`
              }
              suggestions={suggestions}
              title="Quest-Bibliothek"
              onSelect={onSuggestionSelect}
            />
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
                <MenuItem value="DAILY">Taeglich</MenuItem>
                <MenuItem value="WEEKLY">Woechentlich</MenuItem>
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
                label="Muenzen"
                onChange={(event) => onFormChange({ ...form, coinReward: event.target.value })}
                required
                size="small"
                slotProps={{ htmlInput: { min: 0, max: 10000 } }}
                type="number"
                value={form.coinReward}
              />
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.requiresApproval}
                      onChange={(event) => onFormChange({ ...form, requiresApproval: event.target.checked })}
                      size="small"
                    />
                  }
                  label="Bestaetigung"
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
                sx={{ minHeight: 40 }}
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
                {selectedChild ? 'Noch keine spontanen Quests aktiv' : 'Noch kein Kind fuer spontane Quests ausgewaehlt'}
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
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) auto auto auto auto auto' },
        p: 1.5
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {quest.title}
        </Typography>
        {quest.description ? (
          <Typography color="text.secondary" variant="body2">
            {quest.description}
          </Typography>
        ) : null}
      </Box>
      <Chip label={`${quest.xpReward} XP`} variant="outlined" />
      <Chip icon={<PaidRoundedIcon />} label={quest.coinReward} variant="outlined" />
      <Button
        disabled={saving}
        onClick={() => onComplete(quest.id)}
        size="small"
        startIcon={<TaskAltRoundedIcon />}
        variant="contained"
      >
        Erledigt
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
            <Chip label={`${availableSuggestions.length} offen`} size="small" variant="outlined" />
          </Stack>
          <Tooltip title="Schliessen">
            <IconButton aria-label="Schliessen" onClick={closeDialog} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 1.5, pt: 1 }}>
          <TextField
            autoComplete="off"
            label="Suchen"
            onChange={(event) => setQuery(event.target.value)}
            size="small"
            value={query}
          />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
                    minHeight: 112,
                    p: 1.25,
                    textAlign: 'left'
                  }}
                  variant="outlined"
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
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
}

function ChildRow({ child, maxXp }: ChildRowProps) {
  const progress = Math.min((child.xp / maxXp) * 100, 100);

  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 0.7fr) minmax(0, 1fr) auto auto' },
        p: 1.5
      }}
    >
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

  return (
    <Box
      sx={{
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 1fr) auto auto auto auto auto' },
        p: 1.5
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {assignment.quest.title}
        </Typography>
        {assignment.quest.description ? (
          <Typography color="text.secondary" noWrap variant="body2">
            {assignment.quest.description}
          </Typography>
        ) : null}
      </Box>
      <Chip label={assignment.quest.type === 'ONE_TIME' ? 'Einmalig' : frequencyLabel(assignment.quest.frequency)} variant="outlined" />
      <Chip label={assignment.dueAt ? formatDateLabel(assignment.dueAt) : 'Ohne Datum'} variant="outlined" />
      {latestCompletion ? (
        <Chip
          color={completionStatusColor(latestCompletion.status)}
          label={completionStatusLabel(latestCompletion.status)}
          variant={latestCompletion.status === 'SUBMITTED' ? 'filled' : 'outlined'}
        />
      ) : (
        <Chip label="Offen" variant="outlined" />
      )}
      <Chip icon={<PaidRoundedIcon />} label={assignment.quest.coinReward} variant="outlined" />
      <Button
        disabled={completionSaving || hasBlockingCompletion}
        onClick={() => onComplete(assignment.id)}
        size="small"
        startIcon={<TaskAltRoundedIcon />}
        variant={hasBlockingCompletion ? 'outlined' : 'contained'}
      >
        {hasBlockingCompletion ? completionStatusLabel(latestCompletion.status) : completionButtonLabel}
      </Button>
      {canReview && latestCompletion ? (
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
          <Button
            color="success"
            disabled={completionSaving}
            onClick={() => onApprove(assignment.id, latestCompletion.id)}
            size="small"
            variant="contained"
          >
            Bestaetigen
          </Button>
          <Button
            color="error"
            disabled={completionSaving}
            onClick={() => onReject(assignment.id, latestCompletion.id)}
            size="small"
            variant="outlined"
          >
            Ablehnen
          </Button>
        </Stack>
      ) : null}
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
          width: 72
        }}
      >
        {reward.imageUrl ? (
          <Box
            alt=""
            component="img"
            src={reward.imageUrl}
            sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
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
      <Chip label={reward.requiresApproval ? 'Mit Bestaetigung' : 'Sofort'} variant="outlined" />
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
  const actionLabel = reward.requiresApproval ? 'Beantragen' : 'Einloesen';

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'action.hover',
        borderRadius: 2,
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: { xs: '1fr', sm: '72px minmax(0, 1fr)', md: '72px minmax(220px, 1fr) auto auto auto' },
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
          width: 72
        }}
      >
        {reward.imageUrl ? (
          <Box
            alt=""
            component="img"
            src={reward.imageUrl}
            sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
          />
        ) : (
          <StorefrontRoundedIcon />
        )}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900 }} noWrap>
          {reward.name}
        </Typography>
        {reward.description ? (
          <Typography color="text.secondary" noWrap variant="body2">
            {reward.description}
          </Typography>
        ) : null}
      </Box>
      <Chip icon={<PaidRoundedIcon />} label={reward.price} variant="outlined" />
      <Chip label={reward.requiresApproval ? 'Anfrage' : 'Sofort'} variant="outlined" />
      <Button
        disabled={!canAfford || redeeming}
        onClick={() => onRedeem(reward.id)}
        size="small"
        startIcon={<StorefrontRoundedIcon />}
        variant={canAfford ? 'contained' : 'outlined'}
      >
        {canAfford ? actionLabel : 'Zu teuer'}
      </Button>
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
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
          <Button
            color="success"
            disabled={saving}
            onClick={() => onApprove(redemption.id)}
            size="small"
            variant="contained"
          >
            Bestaetigen
          </Button>
          <Button
            color="error"
            disabled={saving}
            onClick={() => onReject(redemption.id)}
            size="small"
            variant="outlined"
          >
            Ablehnen
          </Button>
        </Stack>
      ) : null}
      {canMarkRedeemed ? (
        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
          <Button
            disabled={saving}
            onClick={() => onMarkRedeemed(redemption.id)}
            size="small"
            startIcon={<StorefrontRoundedIcon />}
            variant="contained"
          >
            Ausgegeben
          </Button>
          {canCancel ? (
            <Button
              disabled={saving}
              onClick={() => onCancel(redemption.id)}
              size="small"
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
      return 'Bestaetigt';
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
      return 'Eingeloest';
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
      return 'Taeglich';
    case 'WEEKLY':
      return 'Woechentlich';
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
  method?: 'GET' | 'POST';
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
