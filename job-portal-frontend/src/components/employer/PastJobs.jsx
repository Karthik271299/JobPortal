import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Chip,
  Fab,
  Skeleton,
  Paper,
  Divider,
} from "@mui/material";
import {
  Work,
  LocationOn,
  MonetizationOn,
  CalendarToday,
  Edit,
  Delete,
  MoreVert,
  Add,
  Save,
  Cancel,
  Group,
  TrendingUp,
} from "@mui/icons-material";
import employerService from "../../services/employerService";

const PastJobs = ({ onJobsFetch }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editJob, setEditJob] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [jobDetailsDialog, setJobDetailsDialog] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (onJobsFetch) onJobsFetch(fetchJobs);
  }, [onJobsFetch]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await employerService.getPastJobs();
      setJobs(data);
    } catch (error) {
      setMessage("Failed to fetch jobs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const openEditDialog = () => {
    setEditJob({ ...selectedJob });
    setEditDialog(true);
    handleMenuClose();
  };

  const closeEditDialog = () => {
    setEditDialog(false);
    setEditJob({});
    setSkillInput("");
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        jobTitle: editJob.jobTitle,
        jobDescription: editJob.jobDescription,
        requiredSkills: editJob.requiredSkills || [],
        minExperience: parseInt(editJob.minExperience) || 0,
        maxExperience: parseInt(editJob.maxExperience) || 0,
        minSalary: parseFloat(editJob.minSalary) || 0,
        maxSalary: parseFloat(editJob.maxSalary) || 0,
        location: editJob.location,
      };

      const updatedJob = await employerService.updateJob(
        editJob.id,
        updateData
      );
      setJobs(jobs.map((job) => (job.id === editJob.id ? updatedJob : job)));
      setMessage("Job updated successfully!");
      closeEditDialog();
    } catch (error) {
      setMessage("Failed to update job: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await employerService.deleteJob(selectedJob.id);
      setJobs(
        jobs.map((job) =>
          job.id === selectedJob.id ? { ...job, status: "CLOSED" } : job
        )
      );
      setMessage("Job closed successfully!");
      handleMenuClose();
    } catch (error) {
      setMessage("Failed to close job: " + error.message);
    }
  };

  const toggleJobStatus = async () => {
    try {
      const newStatus = selectedJob.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const updateData = {
        ...selectedJob,
        status: newStatus,
      };

      const updatedJob = await employerService.updateJob(
        selectedJob.id,
        updateData
      );
      setJobs(
        jobs.map((job) => (job.id === selectedJob.id ? updatedJob : job))
      );
      setMessage(`Job ${newStatus.toLowerCase()} successfully!`);
      handleMenuClose();
    } catch (error) {
      setMessage("Failed to update job status: " + error.message);
    }
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !editJob.requiredSkills?.includes(skillInput.trim())
    ) {
      setEditJob({
        ...editJob,
        requiredSkills: [...(editJob.requiredSkills || []), skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditJob({
      ...editJob,
      requiredSkills: editJob.requiredSkills?.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const formatSalaryRange = (minSalary, maxSalary) => {
    return `₹${minSalary} - ₹${maxSalary} LPA`;
  };

  const formatExperienceRange = (minExp, maxExp) => {
    return `${minExp} - ${maxExp} years`;
  };

  const openJobDetailsDialog = (job) => {
    setSelectedJobDetails(job);
    setJobDetailsDialog(true);
  };

  const closeJobDetailsDialog = () => {
    setJobDetailsDialog(false);
    setSelectedJobDetails(null);
  };

  const JobCard = ({ job }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
        border:
          job.status === "ACTIVE"
            ? "2px solid #4caf50"
            : job.status === "CLOSED"
            ? "2px solid #f44336"
            : job.status === "DRAFT"
            ? "2px solid #2196f3"
            : "2px solid #ff9800",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Work sx={{ mr: 1, color: "primary.main", fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {job.jobTitle}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={
                job.status === "ACTIVE"
                  ? "Active"
                  : job.status === "CLOSED"
                  ? "Closed"
                  : job.status === "DRAFT"
                  ? "Draft"
                  : job.status === "INACTIVE"
                  ? "Inactive"
                  : job.status || "Unknown"
              }
              color={
                job.status === "ACTIVE"
                  ? "success"
                  : job.status === "CLOSED"
                  ? "error"
                  : job.status === "DRAFT"
                  ? "info"
                  : "warning"
              } 
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <IconButton onClick={(e) => handleMenuOpen(e, job)} size="small">
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <MonetizationOn sx={{ fontSize: 20, mr: 1, color: "success.main" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatSalaryRange(job.minSalary, job.maxSalary)}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn sx={{ fontSize: 20, mr: 1, color: "info.main" }} />
          <Typography variant="body2">{job.location}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <TrendingUp sx={{ fontSize: 20, mr: 1, color: "warning.main" }} />
          <Typography variant="body2">
            Experience:{" "}
            {formatExperienceRange(job.minExperience, job.maxExperience)}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <CalendarToday
            sx={{ fontSize: 20, mr: 1, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            Posted: {new Date(job.postedAt).toLocaleDateString()}
          </Typography>
        </Box>

        {job.companyName && (
          <Box mb={2}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              {job.companyName}
            </Typography>
          </Box>
        )}

        <Box mb={2}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Skills Required:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {(Array.isArray(job.requiredSkills)
              ? job.requiredSkills
              : Array.from(job.requiredSkills || [])
            )
              .slice(0, 3)
              .map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                />
              ))}
            {(job.requiredSkills?.length || job.requiredSkills?.size || 0) >
              3 && (
              <Chip
                label={`+${
                  (job.requiredSkills?.length ||
                    job.requiredSkills?.size ||
                    0) - 3
                } more`}
                size="small"
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {job.jobDescription}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Group />}
          sx={{ borderRadius: 2 }}
          onClick={() => openJobDetailsDialog(job)}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              My Posted Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track your job postings
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography
              variant="h6"
              color="primary.main"
              sx={{ fontWeight: 600 }}
            >
              {jobs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Jobs
            </Typography>
          </Box>
        </Box>
      </Paper>

      {message && (
        <Alert
          severity={message.includes("success") ? "success" : "error"}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {jobs.length === 0 ? (
        <Paper
          elevation={2}
          sx={{ textAlign: "center", py: 8, borderRadius: 3 }}
        >
          <Work sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No jobs posted yet
          </Typography>
          <Button variant="contained" size="large" sx={{ borderRadius: 2 }}>
            Post Your First Job
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedJob?.status !== "CLOSED" && (
          <MenuItem onClick={toggleJobStatus}>
            {selectedJob?.status === "ACTIVE"
              ? "Deactivate Job"
              : "Activate Job"}
          </MenuItem>
        )}
        {selectedJob?.status !== "CLOSED" && (
          <MenuItem onClick={openEditDialog}>
            <Edit sx={{ mr: 1, fontSize: 20 }} />
            Edit Job
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1, fontSize: 20 }} />
          {selectedJob?.status === "CLOSED" ? "Already Closed" : "Close Job"}
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={closeEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Job Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={editJob.jobTitle || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobTitle: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={editJob.location || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, location: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Experience (years)"
                type="number"
                value={editJob.minExperience || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, minExperience: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Experience (years)"
                type="number"
                value={editJob.maxExperience || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, maxExperience: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Salary (LPA)"
                type="number"
                value={editJob.minSalary || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, minSalary: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Salary (LPA)"
                type="number"
                value={editJob.maxSalary || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, maxSalary: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Skills (press Enter)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
              />
              <Box sx={{ mt: 2 }}>
                {Array.from(editJob.requiredSkills || []).map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={editJob.jobDescription || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobDescription: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Button onClick={closeEditDialog} startIcon={<Cancel />}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  startIcon={<Save />}
                >
                  Update Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => (window.location.href = "/employer/upload-job")}
      >
        <Add />
      </Fab>

      <Dialog
        open={jobDetailsDialog}
        onClose={closeJobDetailsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Job Details
            </Typography>
            <IconButton onClick={closeJobDetailsDialog} size="small">
              <Cancel />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedJobDetails && (
            <Box>
              {/* Job Header */}
              <Card
                sx={{
                  mb: 3,
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center">
                      <Work
                        sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
                      />
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {selectedJobDetails.jobTitle}
                        </Typography>
                        {selectedJobDetails.companyName && (
                          <Typography
                            variant="subtitle1"
                            color="primary.main"
                            sx={{ fontWeight: 500 }}
                          >
                            {selectedJobDetails.companyName}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Chip
                      label={
                        selectedJobDetails.status === "ACTIVE"
                          ? "Active"
                          : selectedJobDetails.status === "CLOSED"
                          ? "Closed"
                          : selectedJobDetails.status === "DRAFT"
                          ? "Draft"
                          : "Inactive"
                      }
                      color={
                        selectedJobDetails.status === "ACTIVE"
                          ? "success"
                          : selectedJobDetails.status === "CLOSED"
                          ? "error"
                          : selectedJobDetails.status === "DRAFT"
                          ? "info"
                          : "warning"
                      }
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        px: 2,
                        py: 1,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Job Information Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <MonetizationOn
                        sx={{ mr: 2, color: "success.main", fontSize: 24 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Salary Range
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      color="success.main"
                      sx={{ fontWeight: 600 }}
                    >
                      {formatSalaryRange(
                        selectedJobDetails.minSalary,
                        selectedJobDetails.maxSalary
                      )}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <TrendingUp
                        sx={{ mr: 2, color: "warning.main", fontSize: 24 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Experience Required
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      color="warning.main"
                      sx={{ fontWeight: 600 }}
                    >
                      {formatExperienceRange(
                        selectedJobDetails.minExperience,
                        selectedJobDetails.maxExperience
                      )}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LocationOn
                        sx={{ mr: 2, color: "info.main", fontSize: 24 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedJobDetails.location}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarToday
                        sx={{ mr: 2, color: "text.secondary", fontSize: 24 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Posted Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(selectedJobDetails.postedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Skills Section */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Required Skills
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {Array.from(selectedJobDetails.requiredSkills || []).map(
                        (skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        )
                      )}
                      {(!selectedJobDetails.requiredSkills ||
                        selectedJobDetails.requiredSkills.length === 0) && (
                        <Typography variant="body2" color="text.secondary">
                          No specific skills mentioned
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                {/* Job Description */}
                <Grid item xs={12}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Job Description
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    >
                      {selectedJobDetails.jobDescription ||
                        "No description provided."}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    closeJobDetailsDialog();
                    openEditDialog();
                    setSelectedJob(selectedJobDetails);
                  }}
                  startIcon={<Edit />}
                  disabled={selectedJobDetails.status === "CLOSED"}
                >
                  Edit Job
                </Button>
                <Button
                  variant="contained"
                  onClick={closeJobDetailsDialog}
                  sx={{ borderRadius: 2 }}
                >
                  Close Details
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PastJobs;
