import { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Explore as ExploreIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  BookOnline as BookingsIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlag } from '../contexts/FeatureFlagContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const Sidebar = ({ open, onClose, onToggle, mobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser, isAdmin } = useAuth();
  const { hideAdvancedFeatures } = useFeatureFlag();

  const handleDrawerToggle = () => {
    if (isMobile) {
      onClose();
    } else {
      onToggle();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      text: 'Properties',
      icon: <ExploreIcon />,
      onClick: () => {
        navigate('/');
        if (isMobile) onClose();
      },
      path: '/',
      show: true
    },
    {
      text: 'My Profile',
      icon: <PersonIcon />,
      onClick: () => {
        navigate('/profile');
        if (isMobile) onClose();
      },
      path: '/profile',
      show: currentUser
    },
    {
      text: 'My Bookings',
      icon: <BookingsIcon />,
      onClick: () => {
        navigate('/bookings');
        if (isMobile) onClose();
      },
      path: '/bookings',
      show: currentUser && !hideAdvancedFeatures
    },
    {
      text: 'Favorites',
      icon: <FavoriteIcon />,
      onClick: () => {
        navigate('/favorites');
        if (isMobile) onClose();
      },
      path: '/favorites',
      show: currentUser && !hideAdvancedFeatures
    },
    {
      text: 'Add Property',
      icon: <AdminIcon />,
      onClick: () => {
        navigate('/add-property');
        if (isMobile) onClose();
      },
      path: '/add-property',
      show: currentUser && isAdmin && !hideAdvancedFeatures
    },
    {
      text: 'Manage Sample Data',
      icon: <CloudUploadIcon />,
      onClick: () => {
        navigate('/manage-sample-data');
        if (isMobile) onClose();
      },
      path: '/manage-sample-data',
      show: currentUser && isAdmin && !hideAdvancedFeatures
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      onClick: () => {
        navigate('/settings');
        if (isMobile) onClose();
      },
      path: '/settings',
      show: currentUser && !hideAdvancedFeatures
    },
    {
      text: 'Help & Support',
      icon: <HelpIcon />,
      onClick: () => {
        navigate('/help');
        if (isMobile) onClose();
      },
      path: '/help',
      show: !hideAdvancedFeatures
    },
    {
      text: 'About',
      icon: <InfoIcon />,
      onClick: () => {
        navigate('/about');
        if (isMobile) onClose();
      },
      path: '/about',
      show: true
    },
    {
      text: 'Login',
      icon: <LoginIcon />,
      onClick: () => {
        navigate('/login');
        if (isMobile) onClose();
      },
      path: '/login',
      show: !currentUser
    },
    {
      text: 'Register',
      icon: <PersonAddIcon />,
      onClick: () => {
        navigate('/register');
        if (isMobile) onClose();
      },
      path: '/register',
      show: !currentUser
    }
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        background: '#c62828',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}
    >
      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        {menuItems
          .filter(item => item.show)
          .map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/' && location.pathname.startsWith('/property/'));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={item.onClick}
                  title={!open ? item.text : ''}
                  sx={{
                    mx: 0.5,
                    borderRadius: '12px',
                    py: 1.5,
                    justifyContent: open ? 'flex-start' : 'center',
                    backgroundColor: isActive 
                      ? 'rgba(255,255,255,0.25)' 
                      : 'rgba(255,255,255,0.05)',
                    border: isActive 
                      ? '2px solid rgba(255,255,255,0.4)' 
                      : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: open ? 'translateX(4px)' : 'scale(1.1)',
                      borderColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'rgba(255,255,255,0.85)',
                      minWidth: open ? 44 : 0,
                      justifyContent: 'center'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.95rem',
                          letterSpacing: '0.3px',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>

      {currentUser && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mx: 2, my: 1 }} />
          <List sx={{ px: 1, pb: 2 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                title={!open ? 'Logout' : ''}
                sx={{
                  mx: 0.5,
                  borderRadius: '12px',
                  py: 1.5,
                  justifyContent: open ? 'flex-start' : 'center',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: open ? 'translateX(4px)' : 'scale(1.1)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'white',
                    minWidth: open ? 44 : 0,
                    justifyContent: 'center'
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Logout"
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: { 
            md: open ? drawerWidth : collapsedDrawerWidth 
          },
          flexShrink: 0,
          transition: 'width 0.3s ease'
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? (mobileOpen !== undefined ? mobileOpen : false) : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isMobile ? drawerWidth : (open ? drawerWidth : collapsedDrawerWidth),
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              pt: isMobile ? 0 : '64px' // Account for navbar on desktop
            }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;

