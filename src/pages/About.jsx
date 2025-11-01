import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import {
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <ExploreIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: 'Explore Properties',
      description: 'Discover amazing travel destinations and properties around the world with our extensive collection.'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: 'Save Favorites',
      description: 'Bookmark your favorite properties and access them anytime from your personalized favorites list.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: 'Secure & Safe',
      description: 'Your data is protected with industry-standard security measures and encrypted connections.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: 'Fast & Reliable',
      description: 'Experience lightning-fast searches and smooth navigation with our optimized platform.'
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: 'Verified Properties',
      description: 'All properties are verified to ensure you get accurate information and reliable bookings.'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 50, color: '#c62828' }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is always ready to help you with any questions or concerns.'
    }
  ];

  const teamMembers = [
    {
      name: 'Travelogue Team',
      role: 'Development Team',
      description: 'Passionate developers building the future of travel booking.'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#212121',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            About Travelogue
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#757575',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Your trusted companion for discovering and booking amazing travel properties worldwide.
            We're on a mission to make travel planning seamless, enjoyable, and accessible to everyone.
          </Typography>
        </Box>

        {/* Mission Section */}
        <Card
          sx={{
            mb: 6,
            backgroundColor: 'rgba(255,255,255,0.98)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#212121',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#616161',
                lineHeight: 1.8,
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: '900px',
                mx: 'auto'
              }}
            >
              At Travelogue, we believe that travel should be accessible, enjoyable, and stress-free.
              Our platform connects travelers with incredible properties, providing detailed information,
              authentic reviews, and a seamless booking experience. We're committed to helping you find
              the perfect place to stay, whether you're planning a weekend getaway or a month-long adventure.
            </Typography>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#212121',
              mb: 3,
              mt: 0,
              pt: 0,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              lineHeight: 1.2
            }}
          >
            Why Choose Travelogue?
          </Typography>
          <Grid 
            container 
            spacing={{ xs: 3, sm: 4 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, sm: 4 },
              alignItems: 'stretch'
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  borderRadius: '16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(198, 40, 40, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ 
                  p: { xs: 2.5, sm: 3 }, 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  flexGrow: 1,
                  justifyContent: 'flex-start',
                  height: '100%'
                }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#212121',
                      mb: 1.5,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      textAlign: 'center'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#757575',
                      lineHeight: 1.6,
                      textAlign: 'center',
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#212121',
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Our Team
          </Typography>
          <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    borderRadius: '16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    p: { xs: 2.5, sm: 3 },
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#c62828',
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#212121',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      textAlign: 'center'
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: '#c62828',
                      mb: 2,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#757575',
                      lineHeight: 1.6,
                      textAlign: 'center'
                    }}
                  >
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Card
          sx={{
            backgroundColor: 'rgba(198, 40, 40, 0.05)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#212121',
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                textAlign: 'center'
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#616161',
                lineHeight: 1.8,
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '0.9375rem', sm: '1rem' }
              }}
            >
              Have questions or feedback? We'd love to hear from you!
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#757575',
                textAlign: 'center'
              }}
            >
              Visit our{' '}
              <a
                href="/help"
                style={{
                  color: '#c62828',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Help & Support
              </a>
              {' '}page for assistance.
            </Typography>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Grid container spacing={{ xs: 2, sm: 4 }} justifyContent="center">
            <Grid item xs={6} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#c62828',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                40+
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
                Properties
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#c62828',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                100%
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
                Verified
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#c62828',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                24/7
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
                Support
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#c62828',
                  mb: 1,
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                ∞
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
                Destinations
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;

