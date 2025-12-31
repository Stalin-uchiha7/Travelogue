import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useSearch } from '../contexts/SearchContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartIcon from '@mui/icons-material/TableChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlag } from '../contexts/FeatureFlagContext';
import { toggleFavorite, getFavoriteId } from '../utils/favorites';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minStars: 0,
    minPrice: 0,
    maxPrice: 50000
  });
  const { searchQuery } = useSearch();
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { hideAdvancedFeatures } = useFeatureFlag();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [favoriteStatus, setFavoriteStatus] = useState({}); // { propertyId: favoriteId | null }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [animatingFavorites, setAnimatingFavorites] = useState({}); // { propertyId: true/false }

  // Get unique locations for filter
  const locations = [...new Set(properties.map(p => p.location))].sort();
  const maxPrice = Math.max(...properties.map(p => p.price || 0), 10000);

  // Fetch properties from Firebase Firestore database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties from Firebase Firestore...');
        // Fetch all properties from 'properties' collection in Firestore
        const propertiesCollection = collection(db, 'properties');
        const propertiesSnapshot = await getDocs(propertiesCollection);
        
        // Map Firestore documents to property objects
        const propertiesList = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`Successfully fetched ${propertiesList.length} properties from database`);
        setProperties(propertiesList);
        setFilteredProperties(propertiesList);
        setImageErrors({}); // Reset image errors when properties reload
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties from Firebase:', err);
        setError('Failed to fetch properties from database: ' + err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Load favorite status for all properties (only if advanced features are enabled)
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!currentUser || properties.length === 0 || hideAdvancedFeatures) {
        setFavoriteStatus({});
        return;
      }

      const statusMap = {};
      await Promise.all(
        properties.map(async (property) => {
          const favoriteId = await getFavoriteId(currentUser.uid, property.id);
          statusMap[property.id] = favoriteId;
        })
      );
      setFavoriteStatus(statusMap);
    };

    loadFavoriteStatus();
  }, [currentUser, properties, hideAdvancedFeatures]);

  useEffect(() => {
    let filtered = properties;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.name?.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query)
      );
    }

    // Apply tab filter
    if (tabValue === 1) {
      // Top Rated - filter by 4+ stars
      filtered = filtered.filter(property => (property.stars || 0) >= 4);
    }

    // Apply custom filters
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minStars > 0) {
      filtered = filtered.filter(property => (property.stars || 0) >= filters.minStars);
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter(property => (property.price || 0) >= filters.minPrice);
    }

    if (filters.maxPrice < maxPrice) {
      filtered = filtered.filter(property => (property.price || 0) <= filters.maxPrice);
    }

    setFilteredProperties(filtered);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [tabValue, properties, filters, maxPrice, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };


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
          Loading amazing destinations...
        </Typography>
      </Box>
    );
  }

  if (error && properties.length === 0) {
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
            severity="error"
            sx={{
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {error}
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
        pb: 4
      }}
    >
      <Box 
        sx={{ 
          background: '#ffffff',
          mb: 3, 
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ pt: 3, px: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#c62828',
                  letterSpacing: '-0.5px'
                }}
              >
                Discover Amazing Places
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    color: showFilters ? '#c62828' : '#666',
                    border: `1px solid ${showFilters ? '#c62828' : '#e0e0e0'}`,
                    '&:hover': {
                      backgroundColor: showFilters ? 'rgba(198, 40, 40, 0.1)' : 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <FilterListIcon />
                </IconButton>
                <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                  <IconButton
                    onClick={() => setViewMode('card')}
                    sx={{
                      borderRadius: 0,
                      backgroundColor: viewMode === 'card' ? '#c62828' : 'transparent',
                      color: viewMode === 'card' ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: viewMode === 'card' ? '#b71c1c' : 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('table')}
                    sx={{
                      borderRadius: 0,
                      backgroundColor: viewMode === 'table' ? '#c62828' : 'transparent',
                      color: viewMode === 'table' ? 'white' : '#666',
                      '&:hover': {
                        backgroundColor: viewMode === 'table' ? '#b71c1c' : 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <TableChartIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#666',
                  px: 3,
                  py: 2,
                  minHeight: 56,
                  '&.Mui-selected': {
                    color: '#c62828',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#c62828',
                  height: 4,
                  borderRadius: '2px 2px 0 0',
                },
              }}
            >
              <Tab label="All Packages" />
              <Tab label="⭐ Top Rated" />
            </Tabs>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, minHeight: 'calc(100vh - 200px)' }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {error}
          </Alert>
        )}

        {showFilters && (
          <Card sx={{ mb: 3, p: 3, borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
                Filters
              </Typography>
              <IconButton size="small" onClick={() => setShowFilters(false)}>
                <ClearIcon />
              </IconButton>
            </Box>
            <Grid container spacing={3} sx={{ width: '100%', margin: 0, alignItems: 'flex-start' }}>
              <Grid item xs={12} sm={6} md={5}>
                <FormControl sx={{ width: '400px', minWidth: '400px' }}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filters.location}
                    label="Location"
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected === '') {
                        return <span style={{ color: '#757575', paddingLeft: '4px' }}>All Locations</span>;
                      }
                      return <span style={{ paddingLeft: '4px' }}>{selected}</span>;
                    }}
                    sx={{ 
                      fontSize: '1rem',
                      width: '400px',
                      minWidth: '400px',
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        py: 1.75,
                        pl: 2.5,
                        pr: 3,
                        overflow: 'visible',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '14px 14px 14px 14px !important',
                        paddingLeft: '14px !important',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>All Locations</MenuItem>
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl sx={{ width: '200px', minWidth: '200px' }}>
                  <InputLabel>Min Stars</InputLabel>
                  <Select
                    value={filters.minStars}
                    label="Min Stars"
                    onChange={(e) => setFilters({ ...filters, minStars: Number(e.target.value) })}
                    renderValue={(selected) => {
                      if (selected === 0) {
                        return <span style={{ paddingLeft: '4px' }}>Any</span>;
                      }
                      return <span style={{ paddingLeft: '4px' }}>{`${selected}+ Stars`}</span>;
                    }}
                    sx={{ 
                      fontSize: '1rem',
                      width: '200px',
                      minWidth: '200px',
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '1rem',
                        py: 1.75,
                        pl: 2.5,
                        pr: 3,
                        overflow: 'visible',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '14px 14px 14px 14px !important',
                        paddingLeft: '14px !important',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '2px'
                      }
                    }}
                  >
                    <MenuItem value={0} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>Any</MenuItem>
                    <MenuItem value={3} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>3+ Stars</MenuItem>
                    <MenuItem value={4} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>4+ Stars</MenuItem>
                    <MenuItem value={5} sx={{ fontSize: '1rem', py: 1.5, px: 2 }}>5 Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '56px',
                  justifyContent: 'flex-start',
                }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#757575', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.43 }}>
                    Price Range: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
                  </Typography>
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onChange={(e, newValue) => {
                      setFilters({
                        ...filters,
                        minPrice: newValue[0],
                        maxPrice: newValue[1]
                      });
                    }}
                    min={0}
                    max={Math.max(maxPrice, 50000)}
                    step={500}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                    sx={{ 
                      color: '#c62828',
                      mt: 0,
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: '#c62828',
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            {(filters.location || filters.minStars > 0 || filters.minPrice > 0 || filters.maxPrice < maxPrice) && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button
                  size="small"
                  onClick={() => setFilters({
                    location: '',
                    minStars: 0,
                    minPrice: 0,
                    maxPrice: maxPrice
                  })}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 2,
                    py: 0.5
                  }}
                >
                  Clear All Filters
                </Button>
                {filters.location && (
                  <Chip
                    label={`Location: ${filters.location}`}
                    onDelete={() => setFilters({ ...filters, location: '' })}
                    size="small"
                    sx={{ borderRadius: '8px' }}
                  />
                )}
                {filters.minStars > 0 && (
                  <Chip
                    label={`Min ${filters.minStars} Stars`}
                    onDelete={() => setFilters({ ...filters, minStars: 0 })}
                    size="small"
                    sx={{ borderRadius: '8px' }}
                  />
                )}
              </Box>
            )}
          </Card>
        )}
        
        {isAdmin && filteredProperties.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.95)',
              '& .MuiAlert-icon': {
                color: '#c62828'
              }
            }}
            action={
              <Button 
                variant="contained"
                size="medium" 
                onClick={() => navigate('/manage-sample-data')}
                sx={{
                  backgroundColor: '#c62828',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#b71c1c'
                  }
                }}
              >
                Manage Sample Data
              </Button>
            }
          >
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              Get Started
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No properties found. Click to add 20 sample travel destinations.
            </Typography>
          </Alert>
        )}
        
        {filteredProperties.length === 0 ? (
          !isAdmin && (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 8,
                px: 3
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2,
                  color: '#212121',
                  fontWeight: 600
                }}
              >
                No properties found
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#757575'
                }}
              >
                Check back later for new travel destinations.
              </Typography>
            </Box>
          )
        ) : viewMode === 'card' ? (
          <Grid 
            container 
            spacing={2}
            wrap="wrap"
            sx={{
              width: '100%',
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {paginatedProperties.map((property) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={4}
                key={property.id}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  minWidth: 0,
                  flexBasis: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(33.333% - 16px)' },
                  maxWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(33.333% - 16px)' },
                  flexDirection: 'column',
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    minWidth: 0, // Prevents card from overflowing
                    maxWidth: '100%',
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
                    boxSizing: 'border-box',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(198, 40, 40, 0.15)',
                    },
                  }}
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  {currentUser && !hideAdvancedFeatures && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                      <IconButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          // Trigger animation
                          setAnimatingFavorites(prev => ({ ...prev, [property.id]: true }));
                          setTimeout(() => {
                            setAnimatingFavorites(prev => ({ ...prev, [property.id]: false }));
                          }, 600);

                          const wasFavorited = favoriteStatus[property.id];
                          const result = await toggleFavorite(currentUser.uid, property.id);
                          if (result.success) {
                            // Update local state
                            const favoriteId = await getFavoriteId(currentUser.uid, property.id);
                            setFavoriteStatus(prev => ({
                              ...prev,
                              [property.id]: favoriteId
                            }));
                            // Show notification
                            if (favoriteId) {
                              setSnackbar({
                                open: true,
                                message: 'Added to favorites! ❤️',
                                severity: 'success'
                              });
                            } else {
                              setSnackbar({
                                open: true,
                                message: 'Removed from favorites',
                                severity: 'info'
                              });
                            }
                          } else {
                            setSnackbar({
                              open: true,
                              message: result.message || 'Failed to update favorite',
                              severity: 'error'
                            });
                          }
                        }}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,1)',
                          },
                        }}
                      >
                        {favoriteStatus[property.id] ? (
                          <FavoriteIcon
                            sx={{
                              color: '#c62828',
                              animation: animatingFavorites[property.id]
                                ? 'heartBeat 0.6s ease-in-out'
                                : 'none',
                              '@keyframes heartBeat': {
                                '0%': {
                                  transform: 'scale(1)',
                                },
                                '14%': {
                                  transform: 'scale(1.3)',
                                },
                                '28%': {
                                  transform: 'scale(1)',
                                },
                                '42%': {
                                  transform: 'scale(1.3)',
                                },
                                '70%': {
                                  transform: 'scale(1)',
                                },
                              },
                            }}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            sx={{
                              color: '#757575',
                              animation: animatingFavorites[property.id]
                                ? 'heartPulse 0.6s ease-in-out'
                                : 'none',
                              '@keyframes heartPulse': {
                                '0%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                                '50%': {
                                  transform: 'scale(1.5)',
                                  opacity: 0.7,
                                },
                                '100%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        )}
                      </IconButton>
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: '100%',
                      minWidth: 0,
                      maxWidth: '100%',
                      height: '160px',
                      minHeight: '160px',
                      maxHeight: '160px',
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    {property.images && property.images[0] && !imageErrors[property.id] ? (
                      <CardMedia
                        component="img"
                        image={property.images[0]}
                        alt={property.name}
                        onError={() => {
                          setImageErrors(prev => ({ ...prev, [property.id]: true }));
                        }}
                        onLoad={(e) => {
                          // Ensure image fills the container properly
                          e.target.style.objectFit = 'cover';
                          e.target.style.width = '100%';
                          e.target.style.height = '100%';
                          e.target.style.maxWidth = '100%';
                          e.target.style.maxHeight = '100%';
                        }}
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          minWidth: 0,
                          maxWidth: '100%',
                          minHeight: '160px',
                          maxHeight: '160px',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          transition: 'transform 0.5s ease',
                          flexShrink: 0,
                          display: 'block',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          minWidth: 0,
                          maxWidth: '100%',
                          height: '100%',
                          minHeight: '160px',
                          maxHeight: '160px',
                          backgroundColor: '#e0e0e0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#999',
                          fontSize: '0.875rem',
                          flexShrink: 0,
                          boxSizing: 'border-box',
                        }}
                      >
                        <Box
                          component="svg"
                          sx={{
                            width: 48,
                            height: 48,
                            mb: 1,
                            opacity: 0.5,
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                          No Image
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <CardContent 
                    sx={{ 
                      flexGrow: 1, 
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '180px',
                      minWidth: 0,
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="subtitle1" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 1,
                          fontSize: '1rem',
                          color: '#212121',
                          lineHeight: 1.3,
                          height: '2.6em',
                          minHeight: '2.6em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {property.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: '24px', height: '24px' }}>
                        <Rating 
                          value={property.stars || 0} 
                          readOnly 
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#ffb300',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: '#e0e0e0',
                            },
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            ml: 0.5,
                            color: '#757575',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        >
                          {property.stars || 0}.0
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, minHeight: '24px', height: '24px' }}>
                        <LocationOnIcon 
                          sx={{ 
                            color: '#c62828', 
                            fontSize: '1rem', 
                            mr: 0.5,
                            flexShrink: 0,
                          }} 
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#616161',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                          }}
                        >
                          {property.location || 'Location not specified'}
                        </Typography>
                      </Box>

                      {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5, mt: 0.5, minHeight: '24px' }}>
                          {property.amenities.slice(0, 3).map((amenity, idx) => (
                            <Chip
                              key={idx}
                              label={amenity}
                              size="small"
                              sx={{
                                height: '22px',
                                fontSize: '0.7rem',
                                backgroundColor: 'rgba(198, 40, 40, 0.1)',
                                color: '#c62828',
                                fontWeight: 500,
                                '& .MuiChip-label': {
                                  px: 1,
                                  py: 0
                                }
                              }}
                            />
                          ))}
                          {property.amenities.length > 3 && (
                            <Chip
                              label={`+${property.amenities.length - 3}`}
                              size="small"
                              sx={{
                                height: '22px',
                                fontSize: '0.7rem',
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                color: '#666',
                                fontWeight: 500,
                                '& .MuiChip-label': {
                                  px: 1,
                                  py: 0
                                }
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      mt: 'auto',
                      pt: 1.5,
                      borderTop: '1px solid #f0f0f0',
                      flexShrink: 0,
                    }}>
                      <Box sx={{ width: '100%' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#757575',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                            lineHeight: 1.2,
                          }}
                        >
                          From
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#c62828',
                            fontWeight: 800,
                            fontSize: '1.25rem',
                            lineHeight: 1.2
                          }}
                        >
                          ₹{property.price?.toLocaleString() || 'N/A'}
                          <Typography 
                            component="span" 
                            variant="caption" 
                            sx={{ 
                              color: '#757575',
                              fontWeight: 400,
                              fontSize: '0.75rem',
                              ml: 0.5
                            }}
                          >
                            /night
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#212121' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProperties.map((property) => (
                  <TableRow
                    key={property.id}
                    onClick={() => navigate(`/property/${property.id}`)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(198, 40, 40, 0.05)',
                      },
                    }}
                  >
                    <TableCell>
                      {property.images && property.images[0] ? (
                        <Box
                          component="img"
                          src={property.images[0]}
                          alt={property.name}
                          sx={{
                            width: 80,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 80,
                            height: 60,
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '0.75rem',
                          }}
                        >
                          No Image
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                        {property.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ color: '#c62828', fontSize: '1rem', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: '#616161' }}>
                          {property.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={property.stars || 0}
                          readOnly
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#ffb300',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: '#e0e0e0',
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: '#757575' }}>
                          {property.stars || 0}.0
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#c62828',
                          fontWeight: 700,
                        }}
                      >
                        ₹{property.price?.toLocaleString() || 'N/A'}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color: '#757575',
                            ml: 0.5,
                          }}
                        >
                          /night
                        </Typography>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#757575',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          maxWidth: 300,
                        }}
                      >
                        {property.description || 'No description'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination Controls */}
        {filteredProperties.length > 0 && (
          <Box sx={{ 
            mt: 4, 
            mb: 4, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={itemsPerPage}
                  label="Per Page"
                  onChange={handleItemsPerPageChange}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  fontWeight: 600
                },
                '& .Mui-selected': {
                  backgroundColor: '#c62828 !important',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#b71c1c !important'
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Snackbar for favorite notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              minWidth: '300px',
              fontSize: '1.1rem',
              padding: '16px 24px',
            }
          }}
        >
          <MuiAlert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              fontSize: '1.1rem',
              padding: '12px 20px',
              minWidth: '300px',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              },
              '& .MuiAlert-message': {
                fontSize: '1.1rem',
                fontWeight: 500
              }
            }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PropertiesList;

