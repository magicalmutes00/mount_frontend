import axios from './axios';

// Public API calls
export const livestreamApi = {
  // Get active livestream
  getActive: async () => {
    try {
      const response = await axios.get('/livestream/active');
      return response.data;
    } catch (error) {
      console.error('Error getting active livestream:', error);
      throw error;
    }
  },

  // Get upcoming livestreams
  getUpcoming: async () => {
    try {
      const response = await axios.get('/livestream/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error getting upcoming livestreams:', error);
      throw error;
    }
  },

  // Get recent livestreams
  getRecent: async (limit = 5) => {
    try {
      const response = await axios.get(`/livestream/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recent livestreams:', error);
      throw error;
    }
  },

  // Get livestream by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/livestream/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting livestream:', error);
      throw error;
    }
  }
};

// Admin API calls
export const livestreamAdminApi = {
  // Get all livestreams
  getAll: async () => {
    try {
      const response = await axios.get('/livestream/admin/all');
      return response.data;
    } catch (error) {
      console.error('Error getting all livestreams:', error);
      throw error;
    }
  },

  // Create new livestream
  create: async (livestreamData) => {
    try {
      const response = await axios.post('/livestream/admin/create', livestreamData);
      return response.data;
    } catch (error) {
      console.error('Error creating livestream:', error);
      throw error;
    }
  },

  // Update livestream
  update: async (id, updateData) => {
    try {
      const response = await axios.put(`/livestream/admin/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating livestream:', error);
      throw error;
    }
  },

  // Start livestream
  start: async (id) => {
    try {
      const response = await axios.post(`/livestream/admin/${id}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting livestream:', error);
      throw error;
    }
  },

  // End livestream
  end: async (id) => {
    try {
      const response = await axios.post(`/livestream/admin/${id}/end`);
      return response.data;
    } catch (error) {
      console.error('Error ending livestream:', error);
      throw error;
    }
  },

  // Update viewer count
  updateViewerCount: async (id, count) => {
    try {
      const response = await axios.post(`/livestream/admin/${id}/viewers`, { count });
      return response.data;
    } catch (error) {
      console.error('Error updating viewer count:', error);
      throw error;
    }
  },

  // Delete livestream
  delete: async (id) => {
    try {
      const response = await axios.delete(`/livestream/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting livestream:', error);
      throw error;
    }
  }
};