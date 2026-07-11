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
  LinearProgress,
  Paper,
  Stack,
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

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [form, setForm] = useState<AuthFormState>(initialAuthForm);
  const [childForm, setChildForm] = useState<ChildFormState>(initialChildForm);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [childSaving, setChildSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setDashboard(null);
      setChildren([]);
      return;
    }

    void loadSession(token);
  }, [token]);

  async function loadSession(activeToken: string) {
    try {
      setDashboardLoading(true);
      const [currentUser, dashboardData, childData] = await Promise.all([
        apiRequest<AuthUser>('/auth/me', { token: activeToken }),
        apiRequest<DashboardResponse>('/dashboard', { token: activeToken }),
        apiRequest<ChildProfile[]>('/children', { token: activeToken })
      ]);
      setUser(currentUser);
      setDashboard(dashboardData);
      setChildren(childData);
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

  async function refreshDashboard() {
    if (!token) {
      return;
    }

    setDashboardLoading(true);
    setError(null);

    try {
      const [dashboardData, childData] = await Promise.all([
        apiRequest<DashboardResponse>('/dashboard', { token }),
        apiRequest<ChildProfile[]>('/children', { token })
      ]);
      setDashboard(dashboardData);
      setChildren(childData);
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setDashboardLoading(false);
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
      await apiRequest<ChildProfile>('/children', {
        method: 'POST',
        token,
        body: {
          displayName: childForm.displayName,
          avatarKey: childForm.avatarKey || undefined
        }
      });
      setChildForm(initialChildForm);
      await refreshDashboard();
    } catch (requestError) {
      setError(toErrorMessage(requestError));
    } finally {
      setChildSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setDashboard(null);
    setChildren([]);
    setChildForm(initialChildForm);
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
              loading={dashboardLoading}
              user={user}
              onChildFormChange={setChildForm}
              onChildSubmit={submitChild}
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
  childForm: ChildFormState;
  childSaving: boolean;
  children: ChildProfile[];
  dashboard: DashboardResponse | null;
  loading: boolean;
  user: AuthUser | null;
  onChildFormChange: (form: ChildFormState) => void;
  onChildSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function DashboardView({
  childForm,
  childSaving,
  children,
  dashboard,
  loading,
  user,
  onChildFormChange,
  onChildSubmit
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
    </Stack>
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
