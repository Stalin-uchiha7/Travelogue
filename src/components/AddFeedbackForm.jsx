import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  TextField,
  Button,
  Rating,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const AddFeedbackForm = ({ propertyId }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      return setError('Please provide a rating');
    }

    if (!comment.trim()) {
      return setError('Please provide a comment');
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'feedbacks'), {
        userId: currentUser.uid,
        propertyId: propertyId,
        comment: comment.trim(),
        rating: rating,
        timestamp: serverTimestamp()
      });

      setComment('');
      setRating(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Review submitted successfully!
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          size="large"
        />
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Box>
  );
};

export default AddFeedbackForm;

