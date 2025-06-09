import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const userTypes = [
    { type: 'jobseeker', title: 'Job Seeker', desc: 'Looking for your next career opportunity', icon: <Person />, path: '/register/jobseeker' },
    { type: 'employer', title: 'Employer', desc: 'Hiring talented professionals', icon: <Business />, path: '/register/employer' }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Choose Your Role</Typography>
        <Typography color="text.secondary">Select how you want to use our platform</Typography>
      </Box>
      <Grid container spacing={4}>
        {userTypes.map(({ type, title, desc, icon, path }) => (
          <Grid item xs={12} md={6} key={type}>
            <Card sx={{ p: 4, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 4 } }}
                  onClick={() => navigate(path)}>
              <Box sx={{ color: 'primary.main', mb: 3 }}>{React.cloneElement(icon, { fontSize: 'large' })}</Box>
              <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>{desc}</Typography>
              <Button variant="contained" fullWidth>Continue as {title}</Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserTypeSelection;
