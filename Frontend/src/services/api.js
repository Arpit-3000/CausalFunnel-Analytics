import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods
export const analyticsAPI = {
  // Get analytics stats
  getStats: () => api.get('/stats'),
  
  // Get all sessions
  getSessions: () => api.get('/sessions'),
  
  // Get session by ID
  getSessionById: (sessionId) => api.get(`/sessions/${sessionId}`),
  
  // Get heatmap data
  getHeatmap: (pageUrl) => api.get('/heatmap', { params: { pageUrl } }),
  
  // Get available page URLs
  getPageUrls: () => api.get('/pages'),
  
  // Create event (for testing)
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Analytics charts
  getEventsTrend: (days = 7) => api.get('/analytics/events-trend', { params: { days } }),
  getEventDistribution: () => api.get('/analytics/event-distribution'),
  getSessionTrend: (days = 7) => api.get('/analytics/session-trend', { params: { days } }),
};

export default api;
