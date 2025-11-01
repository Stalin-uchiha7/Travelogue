import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, userRole } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setUserData({ id: userDoc.id, ...data });
          setFormData({
            name: data.name || currentUser.email?.split('@')[0] || '',
            email: data.email || currentUser.email || ''
          });
        } else {
          // If user document doesn't exist, create it with defaults
          setFormData({
            name: currentUser.email?.split('@')[0] || '',
            email: currentUser.email || ''
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data: ' + err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userData?.name || currentUser?.email?.split('@')[0] || '',
      email: userData?.email || currentUser?.email || ''
    });
  };

  const handleSave = async () => {
    if (!currentUser || !userData) return;

    setSaving(true);
    setError('');

    try {
      const userDocRef = doc(db, 'users', userData.id);
      await updateDoc(userDocRef, {
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      setUserData({ ...userData, ...formData });
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
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
        <Container maxWidth="sm" sx={{ px: 3 }}>
          <Alert 
            severity="warning"
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.98)'
            }}
          >
            Please <a href="/login" style={{ textDecoration: 'none', color: '#c62828', fontWeight: 600 }}>login</a> to view your profile.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#c62828', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#666', fontWeight: 500 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            mb: 4, 
            fontWeight: 800, 
            color: '#212121',
            letterSpacing: '-0.5px'
          }}
        >
          My Profile
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#c62828',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  mr: 3,
                  boxShadow: '0 4px 12px rgba(198, 40, 40, 0.3)'
                }}
              >
                {formData.name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
                  {formData.name || 'User'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon sx={{ fontSize: '1rem', mr: 1, color: '#757575' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formData.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {isAdmin && (
                    <Paper
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        bgcolor: '#fff3e0',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <AdminIcon sx={{ fontSize: '1rem', mr: 0.5, color: '#f57c00' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#f57c00' }}>
                        Admin
                      </Typography>
                    </Paper>
                  )}
                  {!isAdmin && (
                    <Paper
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        bgcolor: '#e3f2fd',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: '1rem', mr: 0.5, color: '#1976d2' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {userRole || 'Customer'}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
              {!editing && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{
                    backgroundColor: '#c62828',
                    '&:hover': {
                      backgroundColor: '#b71c1c'
                    },
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 3
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {editing ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={saving}
                      sx={{
                        borderRadius: '12px',
                        px: 3
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      sx={{
                        backgroundColor: '#c62828',
                        '&:hover': {
                          backgroundColor: '#b71c1c'
                        },
                        fontWeight: 600,
                        borderRadius: '12px',
                        px: 3
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 500, fontSize: '1.1rem' }}>
                    {formData.name || 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 500, fontSize: '1.1rem' }}>
                    {formData.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Account Type
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 500, fontSize: '1.1rem' }}>
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace', color: '#757575' }}>
                    {currentUser.uid.substring(0, 20)}...
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;

