import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { auth, db } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must contain at least six letters.');
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: email.split('@')[0], // Use email prefix as default name
        email: email,
        role: 'customer'
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #d32f2f 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h3"
            align="center"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3rem' },
            }}
          >
            Travelogue
          </Typography>
          
          <Typography
            component="h2"
            variant="h5"
            align="center"
            sx={{ color: 'white', mb: 4 }}
          >
            Register
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                backgroundColor: 'white',
                color: '#d43736',
                '& .MuiAlert-icon': {
                  color: '#d43736'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              placeholder="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                },
              }}
            />
            <TextField
              required
              fullWidth
              name="password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: '#d43736',
                fontSize: '0.75rem',
                alignSelf: 'flex-start',
                ml: 1,
              }}
            >
              Password must contain at least six letters.
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: 'white',
                color: '#d43736',
                borderRadius: '8px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: '#d43736',
                  fontSize: '16px',
                }}
              >
                Click To Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;

