import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot, deleteDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Rating,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlag } from '../contexts/FeatureFlagContext';
import { toggleFavorite, getFavoriteId } from '../utils/favorites';

// Generate a consistent color for each user based on their ID
const getUserColor = (userId) => {
  // Array of attractive colors
  const colors = [
    '#c62828', // Red
    '#1976d2', // Blue
    '#388e3c', // Green
    '#f57c00', // Orange
    '#7b1fa2', // Purple
    '#0288d1', // Light Blue
    '#c2185b', // Pink
    '#00796b', // Teal
    '#5d4037', // Brown
    '#455a64', // Blue Grey
    '#e64a19', // Deep Orange
    '#512da8', // Deep Purple
    '#d32f2f', // Dark Red
    '#303f9f', // Indigo
    '#0097a7', // Cyan
    '#689f38', // Light Green
    '#ffa000', // Amber
    '#e91e63', // Pink
  ];

  // Hash the user ID to get a consistent index
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get positive index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { hideAdvancedFeatures } = useFeatureFlag();
  const [property, setProperty] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [favoriteId, setFavoriteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyDoc = doc(db, 'properties', id);
        const propertySnapshot = await getDoc(propertyDoc);
        
        if (!propertySnapshot.exists()) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        setProperty({
          id: propertySnapshot.id,
          ...propertySnapshot.data()
        });

        // Load favorite status if user is logged in and advanced features are enabled
        if (currentUser && !hideAdvancedFeatures) {
          const favId = await getFavoriteId(currentUser.uid, id);
          setFavoriteId(favId);
        } else {
          setFavoriteId(null);
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch property: ' + err.message);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, currentUser, hideAdvancedFeatures]);

  useEffect(() => {
    if (!id) return;

    // Set up real-time listener for feedbacks
    const feedbacksQuery = query(
      collection(db, 'feedbacks'),
      where('propertyId', '==', id)
    );

    const unsubscribe = onSnapshot(
      feedbacksQuery,
      (snapshot) => {
        const feedbacksList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by timestamp (newest first)
        feedbacksList.sort((a, b) => {
          if (a.timestamp && b.timestamp) {
            const aTime = a.timestamp.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
            const bTime = b.timestamp.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
            return bTime - aTime;
          }
          return 0;
        });
        setFeedbacks(feedbacksList);
      },
      (err) => {
        console.error('Error fetching feedbacks:', err);
      }
    );

    return () => unsubscribe();
  }, [id]);

  // Fetch user information for all reviewers
  useEffect(() => {
    const fetchUsers = async () => {
      if (feedbacks.length === 0) return;
      
      const userIds = [...new Set(feedbacks.map(f => f.userId))];
      const usersData = {};
      
      for (const userId of userIds) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('uid', '==', userId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            usersData[userId] = {
              name: userData.name || userData.email?.split('@')[0] || 'User',
              email: userData.email || 'Unknown'
            };
          } else {
            // Fallback if user document doesn't exist
            usersData[userId] = {
              name: 'User',
              email: 'Unknown'
            };
          }
        } catch (err) {
          console.error(`Error fetching user ${userId}:`, err);
          usersData[userId] = {
            name: 'User',
            email: 'Unknown'
          };
        }
      }
      
      setUserMap(usersData);
    };

    fetchUsers();
  }, [feedbacks]);

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
          Loading property details...
        </Typography>
      </Box>
    );
  }

  if (error || !property) {
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
              mb: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {error || 'Property not found'}
          </Alert>
          <Button 
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#c62828',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#b71c1c',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(198, 40, 40, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Properties
          </Button>
        </Container>
      </Box>
    );
  }

  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length
    : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Button 
          onClick={() => navigate('/')} 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: '#c62828',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'translateX(-4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          ← Back to Properties
        </Button>

      <Card sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#212121', flex: 1 }}>
              {property.name}
            </Typography>
            {currentUser && !hideAdvancedFeatures && (
              <IconButton
                onClick={async () => {
                  // Trigger animation
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 600);

                  const wasFavorited = favoriteId;
                  const result = await toggleFavorite(currentUser.uid, property.id);
                  if (result.success) {
                    const favId = await getFavoriteId(currentUser.uid, property.id);
                    setFavoriteId(favId);
                    // Show notification
                    if (favId) {
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
                  ml: 2,
                  backgroundColor: favoriteId ? 'rgba(198, 40, 40, 0.1)' : 'rgba(0,0,0,0.05)',
                  '&:hover': {
                    backgroundColor: favoriteId ? 'rgba(198, 40, 40, 0.2)' : 'rgba(0,0,0,0.1)',
                  },
                }}
              >
                {favoriteId ? (
                  <FavoriteIcon
                    sx={{
                      color: '#c62828',
                      animation: isAnimating
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
                      animation: isAnimating
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
            )}
          </Box>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            📍 {property.location}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={property.stars || 0} readOnly />
            <Typography variant="body1" sx={{ ml: 1 }}>
              ({property.stars || 0} stars)
            </Typography>
          </Box>

          {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: '#212121' }}>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {property.amenities.map((amenity, idx) => (
                  <Chip
                    key={idx}
                    label={amenity}
                    sx={{
                      backgroundColor: 'rgba(198, 40, 40, 0.1)',
                      color: '#c62828',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      height: '32px'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {property.images && property.images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <img
                src={property.images[0]}
                alt={property.name}
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </Box>
          )}

          <Typography variant="h5" color="primary" gutterBottom>
            ₹{property.price?.toLocaleString() || 'N/A'} / night
          </Typography>

          {property.description && (
            <Typography variant="body1" paragraph>
              {property.description}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#212121', mb: 3 }}>
            Reviews ({feedbacks.length})
          </Typography>
          {feedbacks.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                Average Rating:
              </Typography>
              <Rating value={averageRating} readOnly precision={0.1} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                ({averageRating.toFixed(1)})
              </Typography>
            </Box>
          )}

          {feedbacks.length === 0 ? (
            <Alert severity="info">No reviews yet. Be the first to review!</Alert>
          ) : (
            <Grid container spacing={2}>
              {feedbacks.map((feedback) => {
                const userInfo = userMap[feedback.userId] || { name: 'User', email: 'Unknown' };
                return (
                  <Grid item xs={12} key={feedback.id}>
                    <Paper sx={{ 
                      p: 3, 
                      position: 'relative',
                      minHeight: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: getUserColor(feedback.userId),
                            mr: 2,
                            fontSize: '1rem',
                            fontWeight: 600
                          }}
                        >
                          {userInfo.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
                                {userInfo.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {userInfo.email}
                              </Typography>
                            </Box>
                            {currentUser && feedback.userId === currentUser.uid && (
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingReview(feedback.id);
                                    setEditComment(feedback.comment);
                                    setEditRating(feedback.rating || 0);
                                    setShowConfirmEdit(false);
                                  }}
                                  sx={{ color: '#c62828', mr: 0.5 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDeletingReviewId(feedback.id);
                                    setShowConfirmDelete(true);
                                  }}
                                  sx={{ color: '#d32f2f' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Rating value={feedback.rating || 0} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5 }}>
                          {feedback.timestamp
                            ? new Date(
                                feedback.timestamp.toMillis 
                                  ? feedback.timestamp.toMillis() 
                                  : feedback.timestamp
                              ).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : 'Date unknown'}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ flexGrow: 1, color: '#424242', lineHeight: 1.6 }}>
                        {feedback.comment}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {currentUser && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => setShowAddReview(true)}
            sx={{
              backgroundColor: '#c62828',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            Add Your Review
          </Button>
        </Box>
      )}

      <Dialog 
        open={editingReview !== null && !showConfirmEdit} 
        onClose={() => {
          setEditingReview(null);
          setEditComment('');
          setEditRating(0);
          setShowConfirmEdit(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Rating</Typography>
            <Rating
              value={editRating}
              onChange={(event, newValue) => {
                setEditRating(newValue);
              }}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditingReview(null);
            setEditComment('');
            setEditRating(0);
          }}>
            Cancel
          </Button>
          <Button
            onClick={() => setShowConfirmEdit(true)}
            variant="contained"
            sx={{ backgroundColor: '#c62828' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Review Modal */}
      <Dialog 
        open={showAddReview} 
        onClose={() => {
          setShowAddReview(false);
          setNewReviewRating(0);
          setNewReviewComment('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Your Review</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 1 }}>
            <Typography component="legend" sx={{ mb: 1 }}>Rating</Typography>
            <Rating
              value={newReviewRating}
              onChange={(event, newValue) => {
                setNewReviewRating(newValue || 0);
              }}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddReview(false);
            setNewReviewRating(0);
            setNewReviewComment('');
            setError('');
          }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!newReviewRating) {
                setError('Please provide a rating');
                return;
              }
              if (!newReviewComment.trim()) {
                setError('Please provide a comment');
                return;
              }
              setReviewLoading(true);
              setError('');
              try {
                await addDoc(collection(db, 'feedbacks'), {
                  userId: currentUser.uid,
                  propertyId: id,
                  comment: newReviewComment.trim(),
                  rating: newReviewRating,
                  timestamp: serverTimestamp()
                });
                setShowAddReview(false);
                setNewReviewRating(0);
                setNewReviewComment('');
              } catch (err) {
                setError('Failed to submit review: ' + err.message);
              } finally {
                setReviewLoading(false);
              }
            }}
            variant="contained"
            disabled={reviewLoading}
            sx={{ backgroundColor: '#c62828' }}
          >
            {reviewLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Edit Dialog */}
      <Dialog 
        open={showConfirmEdit} 
        onClose={() => setShowConfirmEdit(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update your review? This will replace your existing review.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmEdit(false)}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!editRating || !editComment.trim()) {
                setError('Please provide both rating and comment');
                setShowConfirmEdit(false);
                return;
              }
              try {
                await updateDoc(doc(db, 'feedbacks', editingReview), {
                  rating: editRating,
                  comment: editComment.trim()
                });
                setEditingReview(null);
                setEditComment('');
                setEditRating(0);
                setShowConfirmEdit(false);
                setError('');
              } catch (err) {
                setError('Failed to update review: ' + err.message);
                setShowConfirmEdit(false);
              }
            }}
            variant="contained"
            sx={{ backgroundColor: '#c62828' }}
          >
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog 
        open={showConfirmDelete} 
        onClose={() => {
          setShowConfirmDelete(false);
          setDeletingReviewId(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowConfirmDelete(false);
            setDeletingReviewId(null);
          }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (deletingReviewId) {
                try {
                  await deleteDoc(doc(db, 'feedbacks', deletingReviewId));
                  setShowConfirmDelete(false);
                  setDeletingReviewId(null);
                  setError('');
                } catch (err) {
                  setError('Failed to delete review: ' + err.message);
                  setShowConfirmDelete(false);
                  setDeletingReviewId(null);
                }
              }
            }}
            variant="contained"
            sx={{ backgroundColor: '#d32f2f' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {!currentUser && (
        <Alert severity="info">
          Please{' '}
          <a href="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            login
          </a>{' '}
          to add a review.
        </Alert>
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

export default PropertyDetails;

