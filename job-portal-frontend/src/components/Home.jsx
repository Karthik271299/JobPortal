import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import { Search, Business, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Search />, title: 'Find Jobs', desc: 'Search and apply to thousands of jobs' },
    { icon: <Business />, title: 'Hire Talent', desc: 'Connect with skilled professionals' },
    { icon: <TrendingUp />, title: 'Grow Career', desc: 'Advance your professional journey' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, background: 'linear-gradient(45deg, #2563eb, #dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Dream Job Awaits
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Connect talented job seekers with top employers. Find your perfect match today.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/select-user-type')}
          sx={{ px: 4, py: 2, fontSize: '1.1rem', borderRadius: 8 }}
        >
          Get Started
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ textAlign: 'center', p: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>{React.cloneElement(feature.icon, { fontSize: 'large' })}</Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{feature.title}</Typography>
              <Typography color="text.secondary">{feature.desc}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;