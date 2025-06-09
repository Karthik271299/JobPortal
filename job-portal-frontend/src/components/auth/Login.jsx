import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Response",response);
      console.log("About to navigate to:", response.role === 'JOBSEEKER' ? '/jobseeker/dashboard' : '/employer/dashboard');
      navigate(response.role === 'JOBSEEKER' ? '/jobseeker/dashboard' : '/employer/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 6 }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>Welcome Back</Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            fullWidth label="Email" type="email" required sx={{ mb: 3 }}
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <TextField 
            fullWidth label="Password" type="password" required sx={{ mb: 4 }}
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;