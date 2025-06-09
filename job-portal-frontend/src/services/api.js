const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
    ...options
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API call failed: ${response.status}`);
  }
  
  return await response.json();
};

export const apiService = {

  get: async (endpoint) => {
    return apiCall(endpoint, { method: 'GET' });
  },

  post: async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put: async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  patch: async (endpoint, data) => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  delete: async (endpoint) => {
    return apiCall(endpoint, { method: 'DELETE' });
  },

};