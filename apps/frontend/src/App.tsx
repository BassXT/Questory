import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
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
  FormControlLabel,
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

type AuthMode = 'login' | 'register';
type QuestType = 'ONE_TIME' | 'RECURRING';
type QuestFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'CUSTOM';

interface AuthUser {
  id: string;
  familyId: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'PARENT' | 'CHILD';
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

interface DashboardChild {
  id: string;
  displayName: string;
  avatarKey: string | null;
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
  level: number;
  xp: number;
  coins: number;
  createdAt: string;
  updatedAt: string;
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
  };
}

interface AuthFormState {
  familyName: string;
  displayName: string;
  email: string;
  password: string;
}

interface ChildFormState {
  displayName: string;
  avatarKey: string;
}

interface QuestFormState {
  title: string;
  description: string;
  type: QuestType;
  frequency: QuestFrequency;
  xpReward: string;
  coinReward: string;
  requiresApproval: boolean;
  isActive: boolean;
}

interface QuestAssignmentFormState {
  childProfileId: string;
  questId: string;
  dueAt: string;
}

const initialAuthForm: AuthFormState = {
  familyName: '',
  displayName: '',
  email: '',
  password: ''
};

const initialChildForm: ChildFormState = {
  displayName: '',
  avatarKey: ''
};

const initialQuestForm: QuestFormState = {
  title: '',
  description: '',
  type: 'ONE_TIME',
  frequency: 'NONE',
  xpReward: '25',
  coinReward: '5',
  requiresApproval: true,
  isActive: true
};

const initialQuestAssignmentForm: QuestAssignmentFormState = {
  childProfileId: '',
  questId: '',
  dueAt: ''
};

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [form, setForm] = useState<AuthFormState>(initialAuthForm);
  const [childForm, setChildForm] = useState<ChildFormState>(initialChildForm);
  const [questForm, setQuestForm] = useState<QuestFormState>(initialQuestForm);
  const [questAssignmentForm, setQuestAssignmentForm] = useState<QuestAssignmentFormState>(
    initialQuestAssignmentForm
  );
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [quests, setQuests] = useState<QuestTemplate[]>([]);
  const [questAssignments, setQuestAssignments] = useState<QuestAssignment[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [childSaving, setChildSaving] = useState(false);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [questSaving, setQuestSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setDashboard(null);
      setChildren([]);
      setQuests([]);
      setQuestAssignments([]);
      setQuestAssignmentForm(initialQuestAssignmentForm);
      return;
    }

    void loadSession(token);
  }, [token]);

  async function loadSession(activeToken: string) {
    try {
      setDashboardLoading(true);
      const [currentUser, dashboardData, childData, questData] = await Promise.all([
        apiRequest<AuthUser>('/auth/me', { token: activeToken }),
        apiRequest<DashboardResponse>('/dashboard', { token: activeToken }),
        apiRequest<ChildProfile[]>('/children', { token: activeToken }),
        apiRequest<QuestTemplate[]>('/quests', { token: activeToken })
      ]);
      setUser(currentUser);
      setDashboard(dashboardData);
      setChildren(childData);
      setQuests(questData);
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

  async function refreshDashboard(preferredChildId = questAssignmentForm.childProfileId) {
    if (!token) {
      return;
    }

    setDashboardLoading(true);
    setError(null);

    try {
      const [dashboardData, childData, questData] = await Promise.all([
        apiRequest<DashboardResponse>('/dashboard', { token }),
        apiRequest<ChildProfile[]>('/children', { token }),
        apiRequest<QuestTemplate[]>('/quests', { token })
      ]);
      setDashboard(dashboardData);
      setChildren(childData);
      setQuests(questData);
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
      return;
    }

    setAssignmentLoading(true);

    try {
      const assignments = await apiRequest<QuestAssignment[]>(
        `/children/${childProfileId}/quest-assignments`,
        { token: activeToken }
      );
      setQuestAssignments(assignments);
    } finally {
      setAssignmentLoading(false);
    }
  }

  async function changeAssignmentChild(childProfileId: string) {
    if (!token) {
      return;
    }

    setQuestAssignmentForm((currentForm) => ({ ...currentForm, childProfileId }));
    setAssignmentLoading(true);
    setError(null);

    try {
      const assignments = await apiRequest<QuestAssignment[]>(
        `/children/${childProfileId}/quest-assignments`,
        { token }
      );
      setQuestAssignments(assignments);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setAssignmentLoading(false);
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

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setDashboard(null);
    setChildren([]);
    setChildForm(initialChildForm);
    setQuests([]);
    setQuestForm(initialQuestForm);
    setQuestAssignments([]);
    setQuestAssignmentForm(initialQuestAssignmentForm);
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
              childSaving={childSaving}
              children={children}
              dashboard={dashboard}
              assignmentForm={questAssignmentForm}
              assignmentLoading={assignmentLoading}
              assignmentSaving={assignmentSaving}
              assignments={questAssignments}
              loading={dashboardLoading}
              questForm={questForm}
              questSaving={questSaving}
              quests={quests}
              user={user}
              onChildFormChange={setChildForm}
              onChildSubmit={submitChild}
              onAssignmentChildChange={changeAssignmentChild}
              onAssignmentFormChange={setQuestAssignmentForm}
              onAssignmentSubmit={submitQuestAssignment}
              onQuestFormChange={setQuestForm}
              onQuestSubmit={submitQuest}
            />
          ) : (
            <AuthView
              authMode={authMode}
              form={form}
              loading={authLoading}
              onAuthModeChange={setAuthMode}
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
  form: AuthFormState;
  loading: boolean;
  onAuthModeChange: (mode: AuthMode) => void;
  onFormChange: (form: AuthFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AuthView({
  authMode,
  form,
  loading,
  onAuthModeChange,
  onFormChange,
  onSubmit
}: AuthViewProps) {
  const isRegister = authMode === 'register';

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
            <Tab
              icon={<PersonAddRoundedIcon />}
              iconPosition="start"
              label="Registrieren"
              value="register"
            />
          </Tabs>

          {isRegister ? (
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
          <Button disabled={loading} size="large" startIcon={<LoginRoundedIcon />} type="submit" variant="contained">
            {isRegister ? 'Familie erstellen' : 'Einloggen'}
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
  childSaving: boolean;
  children: ChildProfile[];
  dashboard: DashboardResponse | null;
  loading: boolean;
  questForm: QuestFormState;
  questSaving: boolean;
  quests: QuestTemplate[];
  user: AuthUser | null;
  onAssignmentChildChange: (childProfileId: string) => void;
  onAssignmentFormChange: (form: QuestAssignmentFormState) => void;
  onAssignmentSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChildFormChange: (form: ChildFormState) => void;
  onChildSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuestFormChange: (form: QuestFormState) => void;
  onQuestSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function DashboardView({
  assignmentForm,
  assignmentLoading,
  assignmentSaving,
  assignments,
  childForm,
  childSaving,
  children,
  dashboard,
  loading,
  questForm,
  questSaving,
  quests,
  user,
  onAssignmentChildChange,
  onAssignmentFormChange,
  onAssignmentSubmit,
  onChildFormChange,
  onChildSubmit,
  onQuestFormChange,
  onQuestSubmit
}: DashboardViewProps) {
  const childRows = children;
  const xpMax = useMemo(() => Math.max(...childRows.map((child) => child.xp), 1), [childRows]);
  const canManageChildren = user?.role === 'ADMIN' || user?.role === 'PARENT';

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
            <SummaryRow label="Coins ausgegeben" value={dashboard.rewards.coinsSpent} />
          </Stack>
        </Paper>
      </Box>

      <QuestTemplatesPanel
        canManage={canManageChildren}
        form={questForm}
        quests={quests}
        saving={questSaving}
        onFormChange={onQuestFormChange}
        onSubmit={onQuestSubmit}
      />

      <QuestAssignmentsPanel
        assignments={assignments}
        canManage={canManageChildren}
        children={children}
        form={assignmentForm}
        loading={assignmentLoading}
        quests={quests}
        saving={assignmentSaving}
        onChildChange={onAssignmentChildChange}
        onFormChange={onAssignmentFormChange}
        onSubmit={onAssignmentSubmit}
      />
    </Stack>
  );
}

interface QuestAssignmentsPanelProps {
  assignments: QuestAssignment[];
  canManage: boolean;
  children: ChildProfile[];
  form: QuestAssignmentFormState;
  loading: boolean;
  quests: QuestTemplate[];
  saving: boolean;
  onChildChange: (childProfileId: string) => void;
  onFormChange: (form: QuestAssignmentFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function QuestAssignmentsPanel({
  assignments,
  canManage,
  children,
  form,
  loading,
  quests,
  saving,
  onChildChange,
  onFormChange,
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
            assignments.map((assignment) => <QuestAssignmentRow assignment={assignment} key={assignment.id} />)
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
  onFormChange: (form: QuestFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function QuestTemplatesPanel({
  canManage,
  form,
  quests,
  saving,
  onFormChange,
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
  child: DashboardChild;
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
        gridTemplateColumns: { xs: '1fr', md: 'minmax(180px, 0.7fr) minmax(0, 1fr) auto' },
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
      <Chip icon={<EmojiEventsRoundedIcon />} label={`${quest.xpReward} XP`} variant="outlined" />
      <Chip icon={<PaidRoundedIcon />} label={quest.coinReward} variant="outlined" />
    </Box>
  );
}

interface QuestAssignmentRowProps {
  assignment: QuestAssignment;
}

function QuestAssignmentRow({ assignment }: QuestAssignmentRowProps) {
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
      <Chip icon={<PaidRoundedIcon />} label={assignment.quest.coinReward} variant="outlined" />
    </Box>
  );
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
