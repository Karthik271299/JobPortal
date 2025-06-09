import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, Alert } from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { error } = useAuth();
  
  const userTypes = [
    { 
      type: 'jobseeker', 
      title: 'Job Seeker', 
      description: 'Looking for your next career opportunity', 
      icon: <Person fontSize="large" />, 
      path: '/register/jobseeker',
      color: 'primary.main'
    },
    { 
      type: 'employer', 
      title: 'Employer', 
      description: 'Hiring talented professionals', 
      icon: <Business fontSize="large" />, 
      path: '/register/employer',
      color: 'secondary.main'
    }
  ];

  const handleRoleSelection = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Join Our Platform
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 6 }}>
          Choose your role to get started
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
        
        <Box display="flex" gap={4} justifyContent="center" flexWrap="wrap">
          {userTypes.map(({ type, title, description, icon, path, color }) => (
            <Paper
              key={type}
              sx={{
                p: 4,
                minWidth: 250,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: color,
                  boxShadow: 4
                }
              }}
              onClick={() => handleRoleSelection(path)}
            >
              <Box sx={{ color, mb: 3 }}>{icon}</Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {description}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                sx={{ bgcolor: color, '&:hover': { bgcolor: color } }}
              >
                Continue as {title}
              </Button>
            </Paper>
          ))}
        </Box>
        
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography color="text.secondary">
            Already have an account?{' '}
            <Button 
              variant="text" 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none' }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;