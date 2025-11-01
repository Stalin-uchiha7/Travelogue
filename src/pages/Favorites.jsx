import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CircularProgress,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Favorites = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // Fetch user's favorites from Firestore
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', currentUser.uid)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        
        // Get all favorite property IDs
        const favoriteIds = favoritesSnapshot.docs.map(doc => ({
          favoriteId: doc.id,
          propertyId: doc.data().propertyId
        }));

        // Fetch property details for each favorite
        const propertyPromises = favoriteIds.map(async ({ favoriteId, propertyId }) => {
          try {
            const propertyDocRef = doc(db, 'properties', propertyId);
            const propertySnapshot = await getDoc(propertyDocRef);
            
            if (propertySnapshot.exists()) {
              const propertyData = propertySnapshot.data();
              return {
                ...propertyData,
                id: propertyId,
                favoriteId: favoriteId
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching property ${propertyId}:`, err);
            return null;
          }
        });

        const properties = await Promise.all(propertyPromises);
        const validProperties = properties.filter(p => p !== null);
        
        setFavoriteProperties(validProperties);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      // Remove from local state
      setFavoriteProperties(prev => prev.filter(p => p.favoriteId !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite: ' + err.message);
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
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="info">
            Please{' '}
            <a href="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              login
            </a>{' '}
            to view your favorites.
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#212121', mb: 2 }}>
            My Favorites
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {favoriteProperties.length === 0 
              ? "You haven't saved any favorites yet."
              : `You have ${favoriteProperties.length} favorite property/properties.`
            }
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {favoriteProperties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FavoriteIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: '#757575' }}>
              No favorites yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start exploring properties and add them to your favorites!
            </Typography>
            <button
              onClick={() => navigate('/')}
              style={{
                backgroundColor: '#c62828',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Explore Properties
            </button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {favoriteProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <Card
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(198, 40, 40, 0.15)',
                    },
                  }}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(property.favoriteId);
                      }}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)',
                        },
                      }}
                    >
                      <FavoriteIcon sx={{ color: '#c62828' }} />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      height: '200px',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {property.images && property.images[0] ? (
                      <CardMedia
                        component="img"
                        image={property.images[0]}
                        alt={property.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e0e0e0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999'
                        }}
                      >
                        <Typography variant="caption">No Image</Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: '1.1rem',
                        color: '#212121',
                        lineHeight: 1.3
                      }}
                    >
                      {property.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ color: '#c62828', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#616161', fontSize: '0.875rem' }}>
                        {property.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Rating value={property.stars || 0} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: '#757575' }}>
                        {property.stars || 0}.0
                      </Typography>
                    </Box>

                    {property.amenities && property.amenities.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <Chip
                            key={idx}
                            label={amenity}
                            size="small"
                            sx={{
                              height: '20px',
                              fontSize: '0.65rem',
                              backgroundColor: 'rgba(198, 40, 40, 0.1)',
                              color: '#c62828',
                              fontWeight: 500
                            }}
                          />
                        ))}
                        {property.amenities.length > 3 && (
                          <Chip
                            label={`+${property.amenities.length - 3}`}
                            size="small"
                            sx={{ height: '20px', fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#c62828',
                          fontWeight: 700,
                          fontSize: '1.25rem'
                        }}
                      >
                        ₹{property.price?.toLocaleString() || 'N/A'}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color: '#757575',
                            ml: 0.5,
                            fontSize: '0.75rem'
                          }}
                        >
                          /night
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Favorites;

