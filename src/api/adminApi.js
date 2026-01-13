import axios from './axios';

// Admin API endpoints
const ADMIN_ENDPOINTS = {
  LOGIN: '/admin/login',
  VERIFY_TOKEN: '/admin/verify-token',
  LOGOUT: '/admin/logout',
  CHANGE_PASSWORD: '/admin/change-password',
  PROFILE: '/admin/profile'
};

class AdminApi {
  // Login admin
  static async login(credentials) {
    try {
      const response = await axios.post(ADMIN_ENDPOINTS.LOGIN, credentials);
      
      if (response.data.success) {
        // Store token in localStorage
        const { token, admin } = response.data.data;
        localStorage.setItem('shrine_admin_token', token);
        localStorage.setItem('shrine_admin_user', JSON.stringify(admin));
        
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  // Verify token
  static async verifyToken() {
    try {
      const token = localStorage.getItem('shrine_admin_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(ADMIN_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
    
        localStorage.setItem('shrine_admin_user', JSON.stringify(response.data.data.admin));
      }

      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem('shrine_admin_token');
      
      if (token) {
        await axios.post(ADMIN_ENDPOINTS.LOGOUT, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {

      this.clearAuthData();
    }
  }


  static async changePassword(passwordData) {
    try {
      const token = localStorage.getItem('shrine_admin_token');
      const response = await axios.post(ADMIN_ENDPOINTS.CHANGE_PASSWORD, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleError(error);
    }
  }


  static async getProfile() {
    try {
      const token = localStorage.getItem('shrine_admin_token');
      const response = await axios.get(ADMIN_ENDPOINTS.PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw this.handleError(error);
    }
  }


  static isAuthenticated() {
    const token = localStorage.getItem('shrine_admin_token');
    const user = localStorage.getItem('shrine_admin_user');
    return !!(token && user);
  }


  static getCurrentAdmin() {
    try {
      const user = localStorage.getItem('shrine_admin_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing admin user data:', error);
      return null;
    }
  }


  static getToken() {
    return localStorage.getItem('shrine_admin_token');
  }


  static clearAuthData() {
    localStorage.removeItem('shrine_admin_token');
    localStorage.removeItem('shrine_admin_user');
    delete axios.defaults.headers.common['Authorization'];
  }


  static initializeAuth() {
    const token = localStorage.getItem('shrine_admin_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  static handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth data
        this.clearAuthData();
      }
      
      return {
        message: data.message || 'An error occurred',
        status,
        success: false
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        success: false
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        success: false
      };
    }
  }
}

// Initialize auth on module load
AdminApi.initializeAuth();

export default AdminApi;