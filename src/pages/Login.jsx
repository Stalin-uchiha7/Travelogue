import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
            Login
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
              autoComplete="current-password"
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
              {loading ? 'Signing In...' : 'Login'}
            </Button>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: '#d43736',
                  fontSize: '16px',
                }}
              >
                Click To Register
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;

