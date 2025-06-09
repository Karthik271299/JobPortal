import api from "./api";

// Fetch current user profile
export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

// Update user profile (personal info, address, professional info)
export const updateProfile = async (profileData) => {
  // profileData = { firstName, lastName, email, phone, ... }
  const response = await api.put("/profile", profileData);
  return response.data;
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profileImage", imageFile);

  const response = await api.post("/profile/image-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Add a new skill to profile
export const addSkill = async (skillData) => {
  // skillData = { name, proficiency, years }
  const response = await api.post("/profile/skills", skillData);
  return response.data;
};

// Update a skill by ID
export const updateSkill = async (skillId, skillData) => {
  const response = await api.put(`/profile/skills/${skillId}`, skillData);
  return response.data;
};

// Delete a skill by ID
export const deleteSkill = async (skillId) => {
  const response = await api.delete(`/profile/skills/${skillId}`);
  return response.data;
};

// Add education entry
export const addEducation = async (educationData) => {
  const response = await api.post("/profile/education", educationData);
  return response.data;
};

// Update education entry by ID
export const updateEducation = async (educationId, educationData) => {
  const response = await api.put(`/profile/education/${educationId}`, educationData);
  return response.data;
};

// Delete education entry by ID
export const deleteEducation = async (educationId) => {
  const response = await api.delete(`/profile/education/${educationId}`);
  return response.data;
};

// Add work experience entry
export const addExperience = async (experienceData) => {
  const response = await api.post("/profile/experience", experienceData);
  return response.data;
};

// Update work experience entry by ID
export const updateExperience = async (experienceId, experienceData) => {
  const response = await api.put(`/profile/experience/${experienceId}`, experienceData);
  return response.data;
};

// Delete work experience entry by ID
export const deleteExperience = async (experienceId) => {
  const response = await api.delete(`/profile/experience/${experienceId}`);
  return response.data;
};
