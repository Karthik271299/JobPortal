  import React, { useState } from "react";
  import {
    Container,
    Typography,
    Grid,
    Card,
    TextField,
    Button,
    Box,
    Chip,
    Alert,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
  } from "@mui/material";
  import { Add } from "@mui/icons-material";
  import CandidateSearch from "./CandidateSearch";
  import PastJobs from "./PastJobs";
  import employerService from "../../services/employerService";

  const EmployerDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [jobDialog, setJobDialog] = useState(false);
    const [newJob, setNewJob] = useState({
      jobTitle: "",
      jobDescription: "",
      requiredSkills: [],
      minExperience: "",
      maxExperience: "",
      minSalary: "",
      maxSalary: "",
      location: "",
    });
    const [skillInput, setSkillInput] = useState("");
    const [message, setMessage] = useState("");

    const handleUploadJob = async () => {
      try {
        await employerService.uploadJob(newJob);
        setMessage("Job uploaded successfully!");
        setJobDialog(false);
        setNewJob({
          jobTitle: "",
          jobDescription: "",
          requiredSkills: [],
          minExperience: "",
          maxExperience: "",
          minSalary: "",
          maxSalary: "",
          location: "",
        });
      } catch (err) {
        setMessage("Failed to upload job");
      }
    };

    const addSkill = () => {
      if (
        skillInput.trim() &&
        !newJob.requiredSkills.includes(skillInput.trim())
      ) {
        setNewJob({
          ...newJob,
          requiredSkills: [...newJob.requiredSkills, skillInput.trim()],
        });
        setSkillInput("");
      }
    };

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Employer Dashboard
        </Typography>

        {message && (
          <Alert
            severity={message.includes("success") ? "success" : "error"}
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 4 }}
        >
          <Tab label="Search Candidates" />
          <Tab label="Upload Job" />
          <Tab label="Past Jobs" />
        </Tabs>

        {tabValue === 0 && <CandidateSearch />}

        {tabValue === 1 && (
          <Card sx={{ p: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Upload New Job</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setJobDialog(true)}
              >
                Add Job
              </Button>
            </Box>
            <Typography color="text.secondary">
              Click "Add Job" to post a new job opening
            </Typography>
          </Card>
        )}

        {tabValue === 2 && <PastJobs/>}

        {/* Job Upload Dialog */}
        <Dialog
          open={jobDialog}
          onClose={() => setJobDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Upload New Job</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  required
                  value={newJob.jobTitle}
                  onChange={(e) =>
                    setNewJob({ ...newJob, jobTitle: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Experience (years)"
                  type="number"
                  value={newJob.minExperience}
                  onChange={(e) =>
                    setNewJob({ ...newJob, minExperience: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Experience (years)"
                  type="number"
                  value={newJob.maxExperience}
                  onChange={(e) =>
                    setNewJob({ ...newJob, maxExperience: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Salary (₹)"
                  type="number"
                  value={newJob.minSalary}
                  onChange={(e) =>
                    setNewJob({ ...newJob, minSalary: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Salary (₹)"
                  type="number"
                  value={newJob.maxSalary}
                  onChange={(e) =>
                    setNewJob({ ...newJob, maxSalary: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newJob.location}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Required Skills (press Enter to add)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Box sx={{ mt: 2 }}>
                  {newJob.requiredSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() =>
                        setNewJob({
                          ...newJob,
                          requiredSkills: newJob.requiredSkills.filter(
                            (s) => s !== skill
                          ),
                        })
                      }
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Job Description"
                  required
                  value={newJob.jobDescription}
                  onChange={(e) =>
                    setNewJob({ ...newJob, jobDescription: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button onClick={() => setJobDialog(false)}>Cancel</Button>
                  <Button variant="contained" onClick={handleUploadJob}>
                    Upload Job
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Container>
    );
  };

  export default EmployerDashboard;
