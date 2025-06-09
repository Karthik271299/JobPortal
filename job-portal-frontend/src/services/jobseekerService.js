import { apiService } from "./api";

const jobseekerService = {
  
  getAllActiveJobs: async () => {
    try {
      const response = await apiService.get("/jobs/all");
      return response;
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      throw error;
    }
  },

  searchJobs: async (filters) => {
    try {
      const params = new URLSearchParams();

      if (filters.jobTitle) params.append("jobTitle", filters.jobTitle);
      if (filters.location) params.append("location", filters.location);
      if (filters.skills) params.append("skills", filters.skills);

      const response = await apiService.get(
        `/jobs/search?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  applyToJob: async (jobId) => {
    try {
      const response = await apiService.post(`/jobseeker/jobs/${jobId}/apply`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for job"
      );
    }
  },

  getMyApplications: async () => {
    try {
      const response = await apiService.get("/jobseeker/applications");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch applied jobs"
      );
    }
  },

  checkIfApplied: async (jobId) => {
    try {
      const applications = await this.getMyApplications();
      return applications.some((app) => app.jobId === jobId);
    } catch (error) {
      return false;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiService.get("/jobseeker/profile");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiService.put("/jobseeker/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};

export default jobseekerService;
