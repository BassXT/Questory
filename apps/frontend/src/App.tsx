import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material';

const highlights = [
  {
    icon: <TaskAltRoundedIcon />,
    title: 'Quests',
    text: 'Aufgaben werden zu kleinen Missionen mit XP und Muenzen.'
  },
  {
    icon: <StorefrontRoundedIcon />,
    title: 'Shop',
    text: 'Belohnungen koennen gesammelt, beantragt und eingeloest werden.'
  },
  {
    icon: <ShieldRoundedIcon />,
    title: 'Familie',
    text: 'Eltern bestaetigen Fortschritt und behalten den Ueberblick.'
  }
];

function App() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={5}>
          <Box
            sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <AutoAwesomeRoundedIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Questory
              </Typography>
            </Box>
            <Chip label="MVP wird aufgebaut" color="secondary" variant="outlined" />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)' },
              gap: 4,
              alignItems: 'center'
            }}
          >
            <Box>
              <Stack spacing={3}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
                  Familienaufgaben als Abenteuer.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680 }}>
                  Questory ist eine self-hosted Familien-App fuer Quests, XP,
                  Muenzen, Level und Belohnungen. Diese erste Oberflaeche ist
                  der Startpunkt fuer das MVP.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large">
                    Dashboard vorbereiten
                  </Button>
                  <Button variant="outlined" size="large">
                    API Health pruefen
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Paper elevation={0} sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Typography variant="h6">MVP-Fortschritt</Typography>
                  <Stack spacing={1.5}>
                    <ProgressRow label="Projektbasis" value="fertig" />
                    <ProgressRow label="Docker-Scaffold" value="neu" />
                    <ProgressRow label="Fachlogik" value="naechster Schritt" />
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 2.5
            }}
          >
            {highlights.map((item) => (
              <Paper elevation={0} sx={{ height: '100%', p: 2.5 }} key={item.title}>
                <Stack spacing={1.5}>
                  <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

interface ProgressRowProps {
  label: string;
  value: string;
}

function ProgressRow({ label, value }: ProgressRowProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography color="text.secondary">{label}</Typography>
      <Chip label={value} size="small" />
    </Box>
  );
}

export default App;
