import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress
} from "@mui/material";
import {
  Search,
  Work,
  LocationOn,
  MonetizationOn,
  CalendarToday,
  Business,
  Visibility,
  Send,
  Check
} from "@mui/icons-material";
import jobseekerService from "../../services/jobseekerService";
import Loading from "../common/Loading";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [searchFilters, setSearchFilters] = useState({
    jobTitle: "",
    location: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    fetchAllJobs();
    fetchAppliedJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobseekerService.getAllActiveJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const applications = await jobseekerService.getMyApplications();
      const appliedJobIds = new Set(applications.map((app) => app.jobId));
      setAppliedJobs(appliedJobIds);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const searchJobs = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError(null);
      const data = await jobseekerService.searchJobs(searchFilters);
      const jobsArray = Array.isArray(data) ? data : [];
      setJobs(jobsArray);
      if (jobsArray.length === 0) {
        setMessage("No jobs found matching your criteria");
      }
    } catch (err) {
      console.error("Error searching jobs:", err);
      setError("Failed to search jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      await jobseekerService.applyToJob(jobId);
      setAppliedJobs((prev) => new Set([...prev, jobId]));
      setMessage("Application submitted successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to apply for job");
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      jobTitle: "",
      location: "",
      skills: "",
    });
    fetchAllJobs();
  };

  const getExperienceRange = (minExp, maxExp) => {
    if (minExp && maxExp) return `${minExp}-${maxExp} years`;
    if (minExp) return `${minExp}+ years`;
    if (maxExp) return `Up to ${maxExp} years`;
    return "Any experience";
  };

  const getSalaryRange = (minSalary, maxSalary) => {
    if (minSalary && maxSalary)
      return `₹${minSalary / 100000}-${maxSalary / 100000} LPA`;
    if (minSalary) return `₹${minSalary / 100000}+ LPA`;
    return "Salary not specified";
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postedDate = new Date(date);
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  if (loading && jobs.length === 0) {
    return <Loading message="Loading jobs..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Find Your Dream Job
      </Typography>

      {/* Search Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Job Title"
              placeholder="e.g., Software Developer"
              value={searchFilters.jobTitle}
              onChange={(e) => handleFilterChange("jobTitle", e.target.value)}
              InputProps={{
                startAdornment: (
                  <Work sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              placeholder="e.g., Bangalore"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              InputProps={{
                startAdornment: (
                  <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Skills"
              placeholder="React, Node.js, Python"
              value={searchFilters.skills}
              onChange={(e) => handleFilterChange("skills", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Search />}
              onClick={searchJobs}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              sx={{ height: 40 }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {(message || error) && (
        <Alert
          severity={message?.includes("success") ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => {
            setMessage("");
            setError(null);
          }}
        >
          {error || message}
        </Alert>
      )}

      {/* Jobs Grid */}
      <Grid container spacing={2}>
        {jobs.map((job) => {
          const isApplied = appliedJobs.has(job.id);
          const isApplying = applyingJobId === job.id;

          return (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {job.jobTitle}
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Business
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {job.companyName || job.employerName || "Company"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                      <MonetizationOn
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {getSalaryRange(job.minSalary, job.maxSalary)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                      <LocationOn
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {job.location || "Location not specified"}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <CalendarToday
                        sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        {job.postedAt
                          ? getTimeAgo(job.postedAt)
                          : "Recently posted"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Experience:{" "}
                      {getExperienceRange(job.minExperience, job.maxExperience)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {(job.requiredSkills || [])
                        .slice(0, 3)
                        .map((skill, index) => (
                          <Chip
                            key={`${skill}-${index}`}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ))}
                      {(job.requiredSkills || []).length > 3 && (
                        <Chip
                          label={`+${(job.requiredSkills || []).length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} sx={{ mt: "auto" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => {
                        setSelectedJob(job);
                        setDialogOpen(true);
                      }}
                      sx={{ flex: 1 }}
                    >
                      View
                    </Button>

                    {isApplied ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Check />}
                        disabled
                        sx={{ flex: 1, bgcolor: "success.main" }}
                      >
                        Applied
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Send />}
                        onClick={() => handleApplyJob(job.id)}
                        disabled={isApplying}
                        sx={{ flex: 1 }}
                      >
                        {isApplying ? <CircularProgress size={16} /> : "Apply"}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {jobs.length === 0 && !loading && (
        <Box textAlign="center" sx={{ py: 6 }}>
          <Work sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}

      {/* Job Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedJob && (
          <>
            <DialogTitle>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedJob.jobTitle}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {selectedJob.companyName || selectedJob.employerName}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <MonetizationOn sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>
                      {getSalaryRange(
                        selectedJob.minSalary,
                        selectedJob.maxSalary
                      )}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{selectedJob.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <Work sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>
                      {getExperienceRange(
                        selectedJob.minExperience,
                        selectedJob.maxExperience
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Required Skills:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(selectedJob.requiredSkills || []).map((skill, index) => (
                      <Chip
                        key={`${skill}-${index}`}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {(!selectedJob.requiredSkills ||
                      selectedJob.requiredSkills.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No specific skills mentioned
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Job Description:
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {selectedJob.jobDescription}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default JobSearch;
