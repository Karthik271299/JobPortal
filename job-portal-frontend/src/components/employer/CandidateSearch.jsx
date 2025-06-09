import React, { useState } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, TextField, 
  Button, Box, Chip, Alert, Avatar, Divider, Dialog, DialogTitle, 
  DialogContent, IconButton, Fade
} from '@mui/material';
import { 
  Search, Person, Email, LinkedIn, School, Work, 
  AttachMoney, CalendarToday, Close 
} from '@mui/icons-material';
import Loading from '../common/Loading';
import employerService from '../../services/employerService'; 

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    jobRole: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const searchCandidates = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      const filters = {};
      if (searchFilters.skills.trim()) {
        filters.skills = searchFilters.skills.trim();
      }
      if (searchFilters.jobRole.trim()) {
        filters.jobRole = searchFilters.jobRole.trim();
      }
      const data = await employerService.searchCandidates(filters);
      
      setCandidates(data);
      if (data.length === 0) {
        setMessage('No candidates found matching your criteria');
      }
    } catch (err) {
      setMessage('Failed to search candidates. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      skills: '',
      jobRole: ''
    });
    setCandidates([]);
    setMessage('');
  };

  const handleViewProfile = async (candidateId) => {
    try {
      setProfileLoading(true);
      setProfileDialogOpen(true);
      
      const data = await employerService.searchCandidates({ candidateId });
      const candidateData = data.find(c => c.id === candidateId) || data[0];
      
      setSelectedCandidate(candidateData);
    } catch (err) {
      console.error('Failed to fetch candidate profile:', err);
      setMessage('Failed to load candidate profile');
      setProfileDialogOpen(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCloseProfile = () => {
    setProfileDialogOpen(false);
    setSelectedCandidate(null);
  };

  const formatSalary = (salary) => {
    return salary ? `₹${salary.toLocaleString()} LPA` : 'Not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && candidates.length === 0) {
    return <Loading message="Searching candidates..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Search Candidates
      </Typography>
      
      {/* Search Filters */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Search Filters</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth
              size="small"
              label="Skills (comma separated)" 
              placeholder="React, Node.js, Python, Java"
              value={searchFilters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              helperText="Enter skills separated by commas"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField 
              fullWidth
              size="small"
              label="Desired Job Role" 
              placeholder="Software Developer, Data Analyst"
              value={searchFilters.jobRole}
              onChange={(e) => handleFilterChange('jobRole', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1.5}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<Search />} 
              onClick={searchCandidates}
              disabled={loading}
              sx={{ height: '40px' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
          <Grid item xs={12} md={1.5}>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={clearFilters}
              sx={{ height: '40px' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {message && (
        <Alert severity={candidates.length === 0 ? 'info' : 'error'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Candidates Grid */}
      <Grid container spacing={3}>
        {candidates.map(candidate => (
          <Grid item xs={12} md={6} lg={4} key={candidate.id}>
            <Card sx={{ 
              height: '100%', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 50, height: 50 }}>
                    {candidate.firstName?.charAt(0) || 'C'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Candidate'}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                      {candidate.desiredJobRole || 'Job Seeker'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2, flex: 1 }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{candidate.email}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {candidate.degree} • {candidate.passedOutYear}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {formatDate(candidate.dateOfBirth)}
                    </Typography>
                  </Box>

                  {candidate.linkedinId && (
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <LinkedIn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {candidate.linkedinId}
                      </Typography>
                    </Box>
                  )}

                  {candidate.skills && candidate.skills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Skills:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {candidate.skills.slice(0, 3).map(skill => (
                          <Chip 
                            key={skill} 
                            label={skill} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {candidate.skills.length > 3 && (
                          <Chip 
                            label={`+${candidate.skills.length - 3} more`} 
                            size="small" 
                            variant="outlined"
                            color="default"
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => handleViewProfile(candidate.id)}
                  sx={{ mt: 'auto' }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {candidates.length === 0 && !loading && !message && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Person sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Search for candidates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use skills or job role to find the perfect candidates for your requirements
          </Typography>
        </Box>
      )}

      {/* Profile Detail Dialog - No changes needed here */}
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfile}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Candidate Profile
          </Typography>
          <IconButton onClick={handleCloseProfile} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {profileLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Loading message="Loading profile..." />
            </Box>
          ) : selectedCandidate ? (
            <Card sx={{ p: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 3, 
                  width: 80, 
                  height: 80,
                  fontSize: '2rem'
                }}>
                  {selectedCandidate.firstName?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    {`${selectedCandidate.firstName || ''} ${selectedCandidate.lastName || ''}`.trim()}
                  </Typography>
                  <Chip 
                    label="Job Seeker" 
                    color="secondary" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 500 }}>
                    {selectedCandidate.desiredJobRole}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Email sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">{selectedCandidate.email}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Date of Birth:</strong> {formatDate(selectedCandidate.dateOfBirth)}
                    </Typography>
                  </Box>

                  {selectedCandidate.linkedinId && (
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <LinkedIn sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                      <Typography variant="body1">{selectedCandidate.linkedinId}</Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Education & Career
                  </Typography>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <School sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Degree:</strong> {selectedCandidate.degree}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Passed Out:</strong> {selectedCandidate.passedOutYear}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Work sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Desired Role:</strong> {selectedCandidate.desiredJobRole}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Salary Expectations
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <AttachMoney sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Current Salary:</strong> {formatSalary(selectedCandidate.currentSalary)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <AttachMoney sx={{ fontSize: 20, mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Expected Salary:</strong> {formatSalary(selectedCandidate.expectedSalary)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Skills & Technologies
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedCandidate.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Card>
          ) : null}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CandidateSearch;