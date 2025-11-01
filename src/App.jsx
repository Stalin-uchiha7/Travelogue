import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertiesList from './pages/PropertiesList';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import Profile from './pages/Profile';
import ManageSampleData from './pages/ManageSampleData';
import Favorites from './pages/Favorites';
import About from './pages/About';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c27b0', // Purple for navbar
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#dc004e', // Red accent
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const ComingSoonPage = ({ title, description }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ px: 3, textAlign: 'center' }}>
        <Box
          sx={{
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            p: 6
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#212121' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575', mb: 4 }}>
            {description}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#c62828', mb: 2 }}>
            Coming Soon!
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575' }}>
            This feature is under development and will be available soon.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const AppContent = () => {
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const showSidebar = !['/login', '/register'].includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(true);
    } else {
      handleSidebarToggle();
    }
  };

  const drawerWidth = 280;
  const collapsedDrawerWidth = 80;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {showSidebar && (
        <>
          <Navbar 
            onMenuClick={handleMenuClick}
            sidebarOpen={sidebarOpen}
          />
          <Sidebar 
            open={sidebarOpen}
            onClose={handleMobileSidebarClose}
            onToggle={handleSidebarToggle}
            mobileOpen={mobileSidebarOpen}
          />
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: showSidebar ? {
            xs: '100%',
            md: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)`
          } : '100%',
          minHeight: '100vh',
          transition: 'width 0.3s ease',
          pt: showSidebar ? '64px' : 0
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PropertiesList />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/manage-sample-data" element={<ManageSampleData />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<ComingSoonPage title="My Bookings" description="View and manage your bookings here." />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<ComingSoonPage title="Settings" description="Manage your account settings and preferences." />} />
          <Route path="/help" element={<ComingSoonPage title="Help & Support" description="Get help and contact support." />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SearchProvider>
          <Router>
            <AppContent />
          </Router>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
