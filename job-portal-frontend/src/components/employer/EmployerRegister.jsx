import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Grid, Box, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobileNumber: '',
    designation: '', companyName: '', password: '', confirmPassword: ''
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData , 'employer');
      navigate('/employer/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };


   const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>Employer Registration</Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="First Name" required 
                value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Last Name" required 
                value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" required 
                value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Mobile Number" required 
                value={formData.mobileNumber} onChange={(e) => handleInputChange('mobileNumber', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Designation" required 
                value={formData.designation} onChange={(e) => handleInputChange('designation', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Company Name" required 
                value={formData.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Password" type="password" required 
                value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Confirm Password" type="password" required 
                value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Grid>
             <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button 
                variant="text" 
                onClick={() => navigate('/select-user-type')}
                sx={{ textTransform: 'none' }}
              >
                Back to Role Selection
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployerRegister;