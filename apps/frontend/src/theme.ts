import { createTheme } from '@mui/material/styles';

export const questoryTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f59e0b'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    text: {
      primary: '#172033',
      secondary: '#586174'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '4rem',
      lineHeight: 1,
      fontWeight: 900
    },
    h5: {
      letterSpacing: 0
    },
    h6: {
      fontWeight: 800
    },
    button: {
      fontWeight: 800,
      textTransform: 'none'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          maxWidth: '100%',
          overflowX: 'hidden'
        },
        '*': {
          boxSizing: 'border-box'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minWidth: 0
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          maxWidth: '100%'
        },
        label: {
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 12,
          maxWidth: 'calc(100% - 24px)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(23, 32, 51, 0.1)',
          borderRadius: 8
        }
      }
    }
  }
});
