const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API call failed: ${response.status}`);
  }
  
  return await response.json();
};

const authenticatedApiCall = async (endpoint, token, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...options
  });
     
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API call failed: ${response.status}`);
  }
     
  return await response.json(); 
};

export const authService = {
  login: async (credentials) => {
    console.log("Credentials :",credentials);
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: async (userData, userType) => {
    const validTypes = ['employer', 'jobseeker'];
    if (!validTypes.includes(userType)) {
      throw new Error('Invalid user type. Must be "employer" or "jobseeker"');
    }

    return apiCall(`/auth/register/${userType}`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  validateToken: async (token) => {
    return authenticatedApiCall('/auth/validate', token);
  }
};