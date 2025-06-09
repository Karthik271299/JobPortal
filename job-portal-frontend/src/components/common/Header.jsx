import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  Chip,
  Stack
} from '@mui/material';
import { 
  Work, 
  Login, 
  PersonAdd, 
  Email, 
  Phone, 
  Business, 
  School, 
  LinkedIn,
  Work as WorkIcon,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import  employerService  from '../../services/employerService';
import  jobSeekerService  from '../../services/jobseekerService';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  const isHovering = Boolean(anchorEl);

  const handleMouseEnter = async (event) => {
    if (!user || profileData) {
      setAnchorEl(event.currentTarget);
      return;
    }
    setLoading(true);
    try {
      let profile;
      if (user.role === 'EMPLOYER') {
        profile = await employerService.getProfile();
      }
      if(user.role === 'JOBSEEKER'){
        profile = await jobSeekerService.getProfile();
      }
      setProfileData({ ...profile, role: user.role });
      setAnchorEl(event.currentTarget);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const renderProfileField = (icon, label, value) => {
    return (
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2">{value || 'Not provided'}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Work sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            JobSeeker
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {!user ? (
          <Box display="flex" gap={2}>
            <Button startIcon={<Login />} onClick={() => navigate('/login')}>Login</Button>
            <Button variant="contained" startIcon={<PersonAdd />} onClick={() => navigate('/select-user-type')}>
              Register
            </Button>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{ position: 'relative' }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  cursor: 'pointer', 
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Welcome, {user.firstName || user.email}
              </Typography>

              {/* Profile Hover Card */}
              {isHovering && (
                <Card
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    mt: 1,
                    width: 320,
                    zIndex: 1300,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : profileData ? (
                      <>
                        {/* Header Section */}
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            {getInitials(profileData.firstName, profileData.lastName)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {profileData.firstName} {profileData.lastName}
                            </Typography>
                            <Chip 
                              label={profileData.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Profile Fields */}
                        <Stack spacing={1}>
                          {renderProfileField(
                            <Email color="action" fontSize="small" />, 
                            'Email', 
                            profileData.email
                          )}
                          
                          {renderProfileField(
                            <Phone color="action" fontSize="small" />, 
                            'Mobile', 
                            profileData.mobileNumber
                          )}

                          {profileData.role === 'EMPLOYER' ? (
                            <>
                              {renderProfileField(
                                <WorkIcon color="action" fontSize="small" />, 
                                'Designation', 
                                profileData.designation
                              )}
                              {renderProfileField(
                                <Business color="action" fontSize="small" />, 
                                'Company', 
                                profileData.companyName
                              )}
                            </>
                          ) : (
                            <>
                              {renderProfileField(
                                <CalendarToday color="action" fontSize="small" />, 
                                'Date of Birth', 
                                formatDate(profileData.dateOfBirth)
                              )}
                              {renderProfileField(
                                <School color="action" fontSize="small" />, 
                                'Degree', 
                                profileData.degree
                              )}
                              {renderProfileField(
                                <LinkedIn color="action" fontSize="small" />, 
                                'LinkedIn', 
                                profileData.linkedinId
                              )}
                            </>
                          )}
                        </Stack>
                      </>
                    ) : (
                      <Typography>Failed to load profile</Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
            <Button onClick={logout} color="secondary">Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;