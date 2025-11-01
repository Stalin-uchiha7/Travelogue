import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAmenity();
    }
  };

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
        amenities: amenities.length > 0 ? amenities : [],
        createdAt: serverTimestamp()
      });

      setSuccess('Property added successfully!');
      // Clear form
      setName('');
      setLocation('');
      setStars(0);
      setPrice('');
      setDescription('');
      setImages('');
      setAmenities([]);
      
      // Navigate back after 1.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 1500);
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
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              color: '#212121',
              mb: 1
            }}
          >
            Add New Property
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below to add a new property to the platform
          </Typography>
        </Box>

        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                {success}
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
                  placeholder="Describe the property, amenities, nearby attractions, etc."
                  helperText="Provide a detailed description of the property"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#212121' }}>
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => handleRemoveAmenity(amenity)}
                      deleteIcon={<DeleteIcon />}
                      sx={{
                        backgroundColor: 'rgba(198, 40, 40, 0.1)',
                        color: '#c62828',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          color: '#c62828'
                        }
                      }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Amenity"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., WiFi, Pool, Parking, Breakfast"
                    helperText="Press Enter or click Add to include an amenity"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddAmenity}
                    sx={{ minWidth: 100, height: '40px' }}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
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
                  helperText="Enter multiple image URLs separated by commas. Use high-quality images for best results."
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2, pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    disabled={loading}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      minWidth: 150,
                      px: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      backgroundColor: '#c62828',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#b71c1c'
                      }
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Adding...
                      </Box>
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

