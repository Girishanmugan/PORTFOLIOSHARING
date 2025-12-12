import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Box, Snackbar, Alert } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyPortfolios from './pages/MyPortfolios';
import CreatePortfolio from './pages/CreatePortfolio';
import EditPortfolio from './pages/EditPortfolio';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    },
    success: {
      main: '#10b981'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px'
    },
    h5: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem'
        },
        contained: {
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#6366f1'
            }
          }
        }
      }
    }
  }
});

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    setSnackbar({ open: true, message: `Welcome back, ${userData.name}!`, type: 'success' });
    setTimeout(() => setCurrentPage('home'), 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setSnackbar({ open: true, message: 'Logged out successfully', type: 'info' });
    setCurrentPage('home');
  };

  const showMessage = (message, type = 'success') => {
    setSnackbar({ open: true, message, type });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <AppBar position="static" elevation={1} className="appbar">
          <Toolbar className="toolbar">
            <div
              className="brand"
              onClick={() => setCurrentPage('home')}
            >
              <CollectionsIcon fontSize="large" className="brand-icon" />
              <span className="brand-name">PortfolioShare</span>
            </div>
            <div className="nav-actions">
              <Button 
                color="inherit" 
                onClick={() => setCurrentPage('home')}
                startIcon={<HomeIcon />}
                className="nav-btn"
              >
                Home
              </Button>
              {isLoggedIn ? (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => setCurrentPage('my-portfolios')}
                    startIcon={<CollectionsIcon />}
                    className="nav-btn"
                  >
                    My Work
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => setCurrentPage('create')}
                    startIcon={<AddCircleIcon />}
                    className="nav-btn"
                  >
                    Create
                  </Button>
                  <div className="nav-user-name">{user?.name}</div>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    variant="outlined"
                    className="outline-nav-btn"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => setCurrentPage('login')}
                    startIcon={<LoginIcon />}
                    className="nav-btn"
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => setCurrentPage('register')}
                    startIcon={<AppRegistrationIcon />}
                    variant="outlined"
                    className="outline-nav-btn"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" className="main-container">
          {currentPage === 'home' && <Home isLoggedIn={isLoggedIn} />}
          {currentPage === 'login' && <Login onLogin={handleLogin} onMessage={showMessage} />}
          {currentPage === 'register' && <Register onRegister={handleLogin} onMessage={showMessage} />}
          {isLoggedIn && currentPage === 'my-portfolios' && (
            <MyPortfolios onEdit={(id) => { setEditingPortfolioId(id); setCurrentPage('edit'); }} onMessage={showMessage} />
          )}
          {isLoggedIn && currentPage === 'create' && (
            <CreatePortfolio onSuccess={() => { setCurrentPage('my-portfolios'); showMessage('Portfolio created successfully!'); }} onMessage={showMessage} onNavigate={setCurrentPage} />
          )}
          {isLoggedIn && currentPage === 'edit' && (
            <EditPortfolio
              portfolioId={editingPortfolioId}
              onSuccess={() => { setCurrentPage('my-portfolios'); showMessage('Portfolio updated successfully!'); setEditingPortfolioId(null); }}
              onMessage={showMessage}
              onNavigate={setCurrentPage}
            />
          )}
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type} className="snackbar-alert">
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;


