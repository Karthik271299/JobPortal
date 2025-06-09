import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  Alert,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Work from '@mui/icons-material/Work';
import CalendarToday from '@mui/icons-material/CalendarToday';
import Business from '@mui/icons-material/Business';
import CheckCircle from '@mui/icons-material/CheckCircle';
import HourglassEmpty from '@mui/icons-material/HourglassEmpty';
import Cancel from '@mui/icons-material/Cancel';
import Star from '@mui/icons-material/Star';

import jobseekerService from "../../services/jobseekerService";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const data = await jobseekerService.getMyApplications();
      setAppliedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage("Failed to fetch applied jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      APPLIED: {
        color: "info",
        icon: <HourglassEmpty />,
        text: "Application Submitted",
      },
      REVIEWED: { color: "warning", icon: <Star />, text: "Under Review" },
      SHORTLISTED: {
        color: "success",
        icon: <CheckCircle />,
        text: "Shortlisted",
      },
      REJECTED: { color: "error", icon: <Cancel />, text: "Not Selected" },
    };
    return configs[status] || configs.APPLIED;
  };

  const getTimeAgo = (date) => {
    const diffDays = Math.ceil(
      (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
    );
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const getApplicationStats = () => {
    const statuses = ["APPLIED", "REVIEWED", "SHORTLISTED", "REJECTED"];
    return statuses.map((status) => {
      const count = appliedJobs.filter((job) => job.status === status).length;
      const percentage = appliedJobs.length
        ? ((count / appliedJobs.length) * 100).toFixed(1)
        : 0;
      const config = getStatusConfig(status);
      return { status, count, percentage, ...config };
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your applications...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          My Applications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {appliedJobs.length} applications
        </Typography>
      </Box>

      {message && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      {appliedJobs.length === 0 ? (
        <Box textAlign="center" sx={{ py: 6 }}>
          <Work sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No job applications yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start applying to jobs that match your skills
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {appliedJobs.map((job) => {
              const statusConfig = getStatusConfig(job.status);
              return (
                <Grid item xs={12} key={job.id}>
                  <Card
                    sx={{
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                mr: 2,
                                width: 40,
                                height: 40,
                              }}
                            >
                              <Work />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {job.jobTitle}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box display="flex" alignItems="center">
                                  <Business
                                    sx={{
                                      fontSize: 16,
                                      mr: 0.5,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {job.companyName}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <CalendarToday
                                    sx={{
                                      fontSize: 14,
                                      mr: 0.5,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Applied {getTimeAgo(job.appliedAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box
                            display="flex"
                            justifyContent={{
                              xs: "flex-start",
                              md: "flex-end",
                            }}
                            alignItems="center"
                          >
                            <Chip
                              icon={statusConfig.icon}
                              label={statusConfig.text}
                              color={statusConfig.color}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Application Statistics */}
          <Card sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Application Statistics
            </Typography>
            <Grid container spacing={2}>
              {getApplicationStats().map(
                ({ status, count, percentage, color, text }) => (
                  <Grid item xs={6} md={3} key={status}>
                    <Box textAlign="center">
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: `${color}.main` }}
                      >
                        {count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({percentage}%)
                      </Typography>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AppliedJobs;
