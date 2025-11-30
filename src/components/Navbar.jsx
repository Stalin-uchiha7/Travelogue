import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isPropertiesPage = location.pathname === '/';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#c62828',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: { xs: 1, sm: 0 },
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            mr: { xs: 1, sm: 4 }
          }}
          onClick={() => navigate('/')}
        >
          Travelogue
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isPropertiesPage && (
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 400 },
              maxWidth: { xs: 'calc(100vw - 120px)', sm: 400 },
              mr: { xs: 1, sm: 2 },
              backgroundColor: 'rgba(255,255,255,0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              },
              transition: 'background-color 0.3s'
            }}
            elevation={0}
          >
            <IconButton sx={{ p: '10px', color: 'white' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ 
                ml: 1, 
                flex: 1, 
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.7)',
                  opacity: 1
                }
              }}
              placeholder="Search properties, locations..."
              inputProps={{ 'aria-label': 'search properties' }}
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>
        )}

        {currentUser && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAdmin && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    mr: 1
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                    Admin
                  </Typography>
                </Box>
              )}
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </>
        )}

        {!currentUser && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Login
              </Typography>
            </IconButton>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: '12px',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <Avatar sx={{ bgcolor: '#c62828' }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentUser?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser?.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 2, fontSize: '1.25rem', color: '#757575' }} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <SettingsIcon sx={{ mr: 2, fontSize: '1.25rem', color: '#757575' }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: '#c62828' }}>
            <LogoutIcon sx={{ mr: 2, fontSize: '1.25rem' }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
