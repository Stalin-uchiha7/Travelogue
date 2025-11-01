import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Card,
  CardContent,
  Rating,
  Grid,
  CircularProgress
} from '@mui/material';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const AddProperty = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [stars, setStars] = useState(0);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      return setError('Property name is required');
    }
    if (!location.trim()) {
      return setError('Location is required');
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return setError('Please enter a valid price');
    }

    setLoading(true);

    try {
      // Parse images from comma-separated string to array
      const imagesArray = images
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      await addDoc(collection(db, 'properties'), {
        name: name.trim(),
        location: location.trim(),
        stars: stars || 0,
        price: parseFloat(price),
        description: description.trim() || '',
        images: imagesArray.length > 0 ? imagesArray : [],
        createdAt: new Date()
      });

      // Navigate back to properties list
      navigate('/');
    } catch (err) {
      setError('Failed to add property: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!currentUser || !isAdmin) {
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
            Access denied. Only administrators can add properties. Please <a href="/login" style={{ textDecoration: 'none', color: '#c62828', fontWeight: 600 }}>login</a> with an admin account.
          </Alert>
        </Container>
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
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 800, 
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '-0.5px'
        }}
      >
        ✨ Add New Property
      </Typography>

      <Card sx={{ backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Property Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Luxury Beach Villa"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Goa, India"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography component="legend" gutterBottom>
                  Star Rating
                </Typography>
                <Rating
                  value={stars}
                  onChange={(event, newValue) => {
                    setStars(newValue || 0);
                  }}
                  size="large"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Price per Night (₹)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 5000"
                  inputProps={{ min: 0, step: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property, amenities, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Image URLs"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="Enter image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)"
                  helperText="Enter multiple image URLs separated by commas"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Adding...
                      </>
                    ) : (
                      'Add Property'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      </Container>
    </Box>
  );
};

export default AddProperty;

