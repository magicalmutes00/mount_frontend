import axios from './axios';

// Management API endpoints
const MANAGEMENT_ENDPOINTS = {
  // Public endpoints
  GET_ACTIVE: '/management/active',
  GET_FEATURED: '/management/featured',
  
  // Admin endpoints
  GET_ALL: '/management/admin/all',
  GET_STATS: '/management/admin/stats',
  GET_BY_ID: (id) => `/management/admin/${id}`,
  CREATE: '/management/admin',
  UPDATE: (id) => `/management/admin/${id}`,
  DELETE: (id) => `/management/admin/${id}`,
  TOGGLE_ACTIVE: (id) => `/management/admin/${id}/toggle-active`,
  UPDATE_DISPLAY_ORDER: (id) => `/management/admin/${id}/display-order`
};

class ManagementApi {
  // Public methods

  // Get all active management team members
  static async getAllActive() {
    try {
      const response = await axios.get(MANAGEMENT_ENDPOINTS.GET_ACTIVE);
      return response.data;
    } catch (error) {
      console.error('Error getting active management team members:', error);
      throw this.handleError(error);
    }
  }

  // Get featured management team members
  static async getFeatured(limit = 4) {
    try {
      const response = await axios.get(MANAGEMENT_ENDPOINTS.GET_FEATURED, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting featured management team members:', error);
      throw this.handleError(error);
    }
  }

  // Admin methods

  // Get all management team members (admin)
  static async getAll() {
    try {
      const response = await axios.get(MANAGEMENT_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error getting all management team members:', error);
      throw this.handleError(error);
    }
  }

  // Get management team statistics
  static async getStats() {
    try {
      const response = await axios.get(MANAGEMENT_ENDPOINTS.GET_STATS);
      return response.data;
    } catch (error) {
      console.error('Error getting management team statistics:', error);
      throw this.handleError(error);
    }
  }

  // Get management team member by ID
  static async getById(id) {
    try {
      const response = await axios.get(MANAGEMENT_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error getting management team member by ID:', error);
      throw this.handleError(error);
    }
  }

  // Create new management team member
  static async create(memberData) {
    try {
      // Validate required fields
      if (!memberData.name || !memberData.position) {
        throw new Error('Name and position are required');
      }

      const response = await axios.post(MANAGEMENT_ENDPOINTS.CREATE, memberData);
      return response.data;
    } catch (error) {
      console.error('Error creating management team member:', error);
      throw this.handleError(error);
    }
  }

  // Update management team member
  static async update(id, memberData) {
    try {
      // Validate required fields
      if (!memberData.name || !memberData.position) {
        throw new Error('Name and position are required');
      }

      const response = await axios.put(MANAGEMENT_ENDPOINTS.UPDATE(id), memberData);
      return response.data;
    } catch (error) {
      console.error('Error updating management team member:', error);
      throw this.handleError(error);
    }
  }

  // Delete management team member
  static async delete(id) {
    try {
      const response = await axios.delete(MANAGEMENT_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting management team member:', error);
      throw this.handleError(error);
    }
  }

  // Toggle active status
  static async toggleActive(id) {
    try {
      const response = await axios.patch(MANAGEMENT_ENDPOINTS.TOGGLE_ACTIVE(id));
      return response.data;
    } catch (error) {
      console.error('Error toggling management team member active status:', error);
      throw this.handleError(error);
    }
  }

  // Update display order
  static async updateDisplayOrder(id, displayOrder) {
    try {
      const response = await axios.patch(MANAGEMENT_ENDPOINTS.UPDATE_DISPLAY_ORDER(id), {
        display_order: displayOrder
      });
      return response.data;
    } catch (error) {
      console.error('Error updating management team member display order:', error);
      throw this.handleError(error);
    }
  }

  // Helper methods

  // Convert file to base64
  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Validate image file
  static validateImage(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    return true;
  }

  // Handle clipboard image paste
  static async handleClipboardPaste(event) {
    const items = event.clipboardData?.items;
    if (!items) return null;

    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          this.validateImage(file);
          return await this.fileToBase64(file);
        }
      }
    }
    return null;
  }

  // Error handling
  static handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Cache management (optional - for performance)
  static _cache = new Map();
  static _cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static async getCachedData(key, fetchFunction) {
    const cached = this._cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this._cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this._cache.set(key, {
        data,
        timestamp: now
      });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cache due to fetch error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  // Clear cache
  static clearCache() {
    this._cache.clear();
  }

  // Get cached active members
  static async getCachedActiveMembers() {
    return this.getCachedData('active_members', () => this.getAllActive());
  }

  // Get cached featured members
  static async getCachedFeaturedMembers(limit = 4) {
    return this.getCachedData(`featured_members_${limit}`, () => this.getFeatured(limit));
  }
}

export default ManagementApi;

// Named exports for convenience
export const {
  getAllActive,
  getFeatured,
  getAll,
  getStats,
  getById,
  create,
  update,
  delete: deleteManagementMember,
  toggleActive,
  updateDisplayOrder,
  fileToBase64,
  validateImage,
  handleClipboardPaste,
  getCachedActiveMembers,
  getCachedFeaturedMembers,
  clearCache
} = ManagementApi;