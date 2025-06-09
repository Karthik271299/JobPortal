import React, { useState } from 'react';
import { Container, Typography, Alert, Tab, Tabs } from '@mui/material';
import JobSearch from './JobSearch';
import AppliedJobs from './AppliedJobs';

const JobseekerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState('');


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Job Seeker Dashboard</Typography>
      {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 3 }}>{message}</Alert>}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 4 }}>
        <Tab label="Search Jobs" />
        <Tab label="Applied Jobs" />
      </Tabs>

      {tabValue === 0 && <JobSearch/>}

      {tabValue === 1 && <AppliedJobs/>}
    </Container>
  );
};

export default JobseekerDashboard;