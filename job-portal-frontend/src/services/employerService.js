import { apiService } from "./api";

const employerService = {
  searchCandidates: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.skills) params.append("skills", filters.skills);
      if (filters.jobRole) params.append("jobRole", filters.jobRole);

      const response = await apiService.get(
        `/employer/candidates/search?${params.toString()}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to search candidates");
    }
  },

  uploadJob: async (jobData) => {
    try {
      const response = await apiService.post("/employer/jobs", jobData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to create job posting");
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const response = await apiService.put(`/employer/jobs/${jobId}`, jobData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update job");
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await apiService.delete(`/employer/jobs/${jobId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to delete job");
    }
  },

  getPastJobs: async (page = 1, limit = 10) => {
    try {
      const response = await apiService.get(
        `/employer/jobs?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch jobs");
    }
  },

  // Profile Management
  getProfile: async () => {
    try {
      const response = await apiService.get("/employer/profile");
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch profile");
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiService.put("/employer/profile", profileData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Failed to update profile");
    }
  },
};

export default employerService;
