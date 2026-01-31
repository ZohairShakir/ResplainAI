const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      const errorMessage = error.error || error.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.message) {
      throw error;
    }
    // Network or other errors
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  getMe: async () => {
    return apiRequest('/auth/me');
  }
};

// Papers API
export const papersAPI = {
  process: async (filename, ageLevel) => {
    return apiRequest('/papers/process', {
      method: 'POST',
      body: JSON.stringify({ filename, ageLevel })
    });
  },
  
  getMyPapers: async () => {
    return apiRequest('/papers/my-papers');
  },
  
  getPaper: async (paperId) => {
    return apiRequest(`/papers/${paperId}`);
  },
  
  deletePaper: async (paperId) => {
    return apiRequest(`/papers/${paperId}`, {
      method: 'DELETE'
    });
  }
};

// Gallery API
export const galleryAPI = {
  getAll: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const query = params.toString();
    return apiRequest(`/gallery${query ? `?${query}` : ''}`);
  },
  
  postToGallery: async (paperId, category = 'Community') => {
    return apiRequest(`/gallery/${paperId}`, {
      method: 'POST',
      body: JSON.stringify({ category })
    });
  },
  
  removeFromGallery: async (paperId) => {
    return apiRequest(`/gallery/${paperId}`, {
      method: 'DELETE'
    });
  }
};

// Library API
export const libraryAPI = {
  getLibrary: async () => {
    return apiRequest('/library');
  }
};
