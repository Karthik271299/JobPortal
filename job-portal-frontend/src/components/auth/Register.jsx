import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Avatar,
  IconButton,
  InputAdornment,
  Container,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Visibility,
  VisibilityOff,
  PhotoCamera,
  PersonAdd,
  CloudUpload
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { registerUser } from '../../services/authService';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.1)',
    zIndex: 1
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255,255,255,0.95)',
  position: 'relative',
  zIndex: 2,
  overflow: 'visible'
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,1)',
    }
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.3s ease'
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #667eea',
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(102, 126, 234, 0.05)',
  '&:hover': {
    borderColor: '#764ba2',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

const ProfilePreview = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: '4px solid #667eea',
  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
}));

const roleOptions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Java Developer',
  'React Developer',
  'Node.js Developer',
  'Python Developer',
  'DevOps Engineer',
  'Data Scientist',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
  'Mobile Developer',
  'Other'
];

const Register = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: null,
      phone: '',
      experience: 'fresher',
      role: '',
      password: '',
      confirmPassword: '',
      profilePicture: null
    }
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const handleFileUpload = (event, onChange) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10KB - 2MB)
      if (file.size < 10240) {
        toast.error('File size must be at least 10KB');
        return;
      }
      if (file.size > 2097152) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      onChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setProfilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...registerData } = data;
      
      // Format date of birth
      if (registerData.dateOfBirth) {
        registerData.dateOfBirth = dayjs(registerData.dateOfBirth).format('YYYY-MM-DD');
      }

      const response = await registerUser(registerData);
      if (response?.success) {
        toast.success('Registered successfully! Please login.');
        navigate('/login');
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledContainer maxWidth={false}>
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <PersonAdd sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Create Your Account
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Join our community and start your journey
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                {/* First Name & Last Name */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="First Name"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* Date of Birth */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    rules={{ required: 'Date of birth is required' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date of Birth"
                        maxDate={dayjs().subtract(16, 'year')}
                        minDate={dayjs().subtract(100, 'year')}
                        renderInput={(params) => (
                          <StyledTextField
                            {...params}
                            fullWidth
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Phone number must be 10 digits',
                      },
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        type="tel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                {/* Profile Picture Upload */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea', fontWeight: 600 }}>
                    Profile Picture
                  </Typography>
                  <Controller
                    name="profilePicture"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <UploadBox>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="profile-picture-upload"
                          type="file"
                          onChange={(e) => handleFileUpload(e, onChange)}
                        />
                        <label htmlFor="profile-picture-upload">
                          {profilePreview ? (
                            <ProfilePreview src={profilePreview} />
                          ) : (
                            <Box>
                              <CloudUpload sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Click to upload profile picture
                              </Typography>
                              <Chip 
                                label="10KB - 2MB" 
                                size="small" 
                                sx={{ mt: 1, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                              />
                            </Box>
                          )}
                        </label>
                      </UploadBox>
                    )}
                  />
                </Grid>

                {/* Experience Level */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#667eea', fontWeight: 600 }}>
                    Experience Level
                  </Typography>
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <FormControl>
                        <RadioGroup {...field} row>
                          <FormControlLabel
                            value="fresher"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#667eea' } }} />}
                            label={<Typography variant="body1" fontWeight={500}>Fresher</Typography>}
                          />
                          <FormControlLabel
                            value="experienced"
                            control={<Radio sx={{ '&.Mui-checked': { color: '#667eea' } }} />}
                            label={<Typography variant="body1" fontWeight={500}>Experienced</Typography>}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Role Selection */}
                <Grid item xs={12}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Please select your role' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.role}>
                        <InputLabel>Select Your Role</InputLabel>
                        <Select
                          {...field}
                          label="Select Your Role"
                          sx={{
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,1)',
                            }
                          }}
                        >
                          {roleOptions.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.role.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Password & Confirm Password */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: 'Please confirm your password',
                      validate: (val) => val === watch('password') || 'Passwords do not match',
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box textAlign="center" mt={4}>
                    <StyledButton
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      sx={{ minWidth: 250 }}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Register'}
                    </StyledButton>
                  </Box>
                </Grid>

                {/* Login Link */}
                <Grid item xs={12}>
                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Button
                        variant="text"
                        onClick={() => navigate('/login')}
                        sx={{ 
                          color: '#667eea', 
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        Login here
                      </Button>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    </LocalizationProvider>
  );
};

export default Register;