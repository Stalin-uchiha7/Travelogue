import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { dummyProperties } from '../utils/addDummyData';

const ManageSampleData = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [selectedProperties, setSelectedProperties] = useState({});
  const [existingProperties, setExistingProperties] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/');
      return;
    }

    // Check which properties already exist
    const checkExistingProperties = async () => {
      try {
        console.log('Checking existing properties in Firestore...');
        const existingPropertiesSnapshot = await getDocs(collection(db, 'properties'));
        console.log('Found', existingPropertiesSnapshot.docs.length, 'existing properties');
        
        const existingNames = new Set(
          existingPropertiesSnapshot.docs.map(doc => doc.data().name)
        );
        setExistingProperties(existingNames);
        
        // Pre-select properties that don't exist
        const initialSelection = {};
        dummyProperties.forEach((prop, index) => {
          if (!existingNames.has(prop.name)) {
            initialSelection[index] = true;
          }
        });
        setSelectedProperties(initialSelection);
        console.log('Available properties to add:', Object.keys(initialSelection).length);
      } catch (err) {
        console.error('Error checking existing properties:', err);
        let errorMessage = 'Failed to check existing properties: ' + err.message;
        
        if (err.code === 'permission-denied') {
          errorMessage = 'Permission denied! Make sure you are logged in. Error: ' + err.message;
        } else if (err.code === 'unavailable') {
          errorMessage = 'Firebase is unavailable. Please check your internet connection and Firebase configuration.';
        } else if (err.code === 'unauthenticated') {
          errorMessage = 'You must be logged in. Please log in and try again.';
        }
        
        setError(errorMessage);
        alert(errorMessage); // Show alert for visibility
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingProperties();
  }, [currentUser, isAdmin, navigate]);

  const handleToggleProperty = (index) => {
    setSelectedProperties(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = {};
    dummyProperties.forEach((prop, index) => {
      if (!existingProperties.has(prop.name)) {
        allSelected[index] = true;
      }
    });
    setSelectedProperties(allSelected);
  };

  const handleDeselectAll = () => {
    setSelectedProperties({});
  };

  const handleAddSelected = async () => {
    const selectedIndices = Object.keys(selectedProperties).filter(
      key => selectedProperties[key]
    ).map(Number);

    if (selectedIndices.length === 0) {
      setError('Please select at least one property to add.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const propertiesToAdd = selectedIndices.map(index => dummyProperties[index]);
      let addedCount = 0;
      let skippedCount = 0;

      for (const property of propertiesToAdd) {
        // Double-check it doesn't already exist
        if (existingProperties.has(property.name)) {
          skippedCount++;
          continue;
        }

        await addDoc(collection(db, 'properties'), {
          ...property,
          createdAt: serverTimestamp()
        });
        addedCount++;
      }

      if (addedCount > 0) {
        setSuccess(`Successfully added ${addedCount} property/properties!`);
        // Update existing properties set
        propertiesToAdd.forEach(prop => {
          if (!existingProperties.has(prop.name)) {
            setExistingProperties(prev => new Set([...prev, prop.name]));
          }
        });
        // Clear selections
        setSelectedProperties({});
        // Refresh the page after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('All selected properties already exist in the database.');
      }

      if (skippedCount > 0 && addedCount > 0) {
        setError(prev => prev ? `${prev} Skipped ${skippedCount} that already exist.` : `Skipped ${skippedCount} property/properties that already exist.`);
      }
    } catch (err) {
      console.error('Error adding properties:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to add properties: ' + err.message;
      
      if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied! Make sure you are logged in and have admin access. Error: ' + err.message;
      } else if (err.code === 'unavailable') {
        errorMessage = 'Firebase is unavailable. Please check your internet connection and Firebase configuration.';
      } else if (err.code === 'unauthenticated') {
        errorMessage = 'You must be logged in to add properties. Please log in and try again.';
      } else if (err.message.includes('collection')) {
        errorMessage = 'Firestore collection error. Make sure Firestore database is created in Firebase Console. Error: ' + err.message;
      }
      
      setError(errorMessage);
      alert(errorMessage); // Also show alert for visibility
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
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

  const selectedCount = Object.values(selectedProperties).filter(Boolean).length;
  const availableCount = dummyProperties.filter(
    prop => !existingProperties.has(prop.name)
  ).length;

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
          <Button
            onClick={() => navigate('/')}
            sx={{
              mb: 3,
              color: '#c62828',
              fontWeight: 600
            }}
          >
            ← Back to Properties
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#212121', mb: 2 }}>
            Manage Sample Data
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Select which sample properties you want to add to the database. Properties that already exist are disabled.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleSelectAll}
              disabled={availableCount === 0 || loading}
            >
              Select All Available ({availableCount})
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeselectAll}
              disabled={selectedCount === 0 || loading}
            >
              Deselect All
            </Button>
            <Button
              variant="contained"
              onClick={async () => {
                // Auto-select all available and add them
                handleSelectAll();
                // Wait a bit for state to update, then add
                setTimeout(async () => {
                  const allSelected = {};
                  dummyProperties.forEach((prop, index) => {
                    if (!existingProperties.has(prop.name)) {
                      allSelected[index] = true;
                    }
                  });
                  setSelectedProperties(allSelected);
                  
                  // Trigger add after state update
                  setTimeout(() => {
                    handleAddSelected();
                  }, 100);
                }, 50);
              }}
              disabled={availableCount === 0 || loading}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
            >
              Add All Available ({availableCount})
            </Button>
            <Chip
              label={`${selectedCount} selected`}
              color="primary"
              sx={{ alignSelf: 'center' }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
        </Box>

        <Grid container spacing={3}>
          {dummyProperties.map((property, index) => {
            const exists = existingProperties.has(property.name);
            const isSelected = selectedProperties[index] || false;

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: exists ? 0.6 : 1,
                    border: isSelected ? '2px solid #c62828' : '1px solid #e0e0e0',
                    cursor: exists ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      boxShadow: exists ? 2 : 4
                    }
                  }}
                  onClick={() => !exists && handleToggleProperty(index)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Checkbox
                        checked={isSelected}
                        disabled={exists}
                        onChange={() => handleToggleProperty(index)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ p: 0, pr: 1 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {property.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          📍 {property.location}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          {property.amenities?.slice(0, 3).map((amenity, idx) => (
                            <Chip
                              key={idx}
                              label={amenity}
                              size="small"
                              sx={{
                                height: '20px',
                                fontSize: '0.65rem',
                                backgroundColor: 'rgba(198, 40, 40, 0.1)',
                                color: '#c62828'
                              }}
                            />
                          ))}
                          {property.amenities?.length > 3 && (
                            <Chip
                              label={`+${property.amenities.length - 3}`}
                              size="small"
                              sx={{ height: '20px', fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          ⭐ {property.stars} stars • ₹{property.price.toLocaleString()}/night
                        </Typography>
                        {exists && (
                          <Chip
                            label="Already Exists"
                            size="small"
                            color="default"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddSelected}
            disabled={loading || selectedCount === 0}
            sx={{
              backgroundColor: '#c62828',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Adding...
              </>
            ) : (
              `Add Selected Properties (${selectedCount})`
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            disabled={loading}
            sx={{ px: 4, py: 1.5 }}
          >
            Cancel
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ManageSampleData;

