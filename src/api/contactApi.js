import axios from './axios';

const ContactApi = {
  // Get contact information (public)
  getContactInfo: async () => {
    try {
      const response = await axios.get('/contact');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contact information'
      };
    }
  },

  // Update contact information (admin only)
  updateContactInfo: async (contactData) => {
    try {
      const response = await axios.put('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact info:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update contact information'
      };
    }
  },

  // Get contact history (admin only)
  getContactHistory: async () => {
    try {
      const response = await axios.get('/contact/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact history:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contact history'
      };
    }
  },

  // Get contact statistics (admin only)
  getContactStats: async () => {
    try {
      const response = await axios.get('/contact/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch contact statistics'
      };
    }
  }
};

export default ContactApi;