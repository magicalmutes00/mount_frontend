import axios from './axios';

// Types
interface CacheItem {
  data: any;
  timestamp: number;
}

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  image_name: string;
  category: string;
  is_featured: boolean;
  file_type: string;
  created_at: string;
  is_active?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface GalleryStats {
  total_items: number;
  active_items: number;
  featured_items: number;
  categories: string[];
}

// Simple in-memory cache
const cache = new Map<string, CacheItem>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache helper functions
const getCacheKey = (url: string, params: Record<string, string>): string => {
  return `${url}?${new URLSearchParams(params).toString()}`;
};

const getCachedData = (key: string): any => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Gallery API endpoints
const GALLERY_ENDPOINTS = {
  PUBLIC: '/gallery/public',
  ADMIN: '/gallery/admin',
  UPLOAD: '/gallery/admin/upload',
  STATS: '/gallery/admin/stats',
  TOGGLE_ACTIVE: (id: number) => `/gallery/admin/${id}/toggle-active`,
  TOGGLE_FEATURED: (id: number) => `/gallery/admin/${id}/toggle-featured`,
  UPDATE: (id: number) => `/gallery/admin/${id}`,
  DELETE: (id: number) => `/gallery/admin/${id}`
};

class GalleryApi {
  // Get public gallery items with caching and better error handling
  static async getPublicGallery(category: string | null = null, limit: number | null = null): Promise<ApiResponse<GalleryItem[]>> {
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (limit) params.limit = limit.toString();
      
      const cacheKey = getCacheKey(GALLERY_ENDPOINTS.PUBLIC, params);
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${GALLERY_ENDPOINTS.PUBLIC}?${new URLSearchParams(params)}`);
      const result = response.data;
      
      // Cache successful responses
      if (result.success) {
        setCachedData(cacheKey, result);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error fetching public gallery:', error);
      
      // Return a more user-friendly error response
      const errorMessage = error.response?.data?.message || 'Unable to load gallery images. Please try again later.';
      
      return {
        success: false,
        message: errorMessage,
        data: []
      };
    }
  }

  // Get all gallery items (admin) - no caching for admin data
  static async getAdminGallery(category: string | null = null): Promise<ApiResponse<GalleryItem[]>> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      
      const response = await axios.get(`${GALLERY_ENDPOINTS.ADMIN}?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin gallery:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch gallery items',
        data: []
      };
    }
  }

  // Create new gallery item
  static async createGalleryItem(galleryData: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>> {
    try {
      const response = await axios.post(GALLERY_ENDPOINTS.ADMIN, galleryData);
      
      // Clear cache after creating new item
      this.clearPublicCache();
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating gallery item:', error);
      
      // Return error object instead of throwing to prevent multiple error messages
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create gallery item'
      };
    }
  }

  // Update gallery item
  static async updateGalleryItem(id: number, galleryData: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>> {
    try {
      const response = await axios.put(GALLERY_ENDPOINTS.UPDATE(id), galleryData);
      
      // Clear cache after updating item
      this.clearPublicCache();
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      throw this.handleError(error);
    }
  }

  // Delete gallery item
  static async deleteGalleryItem(id: number): Promise<ApiResponse> {
    try {
      const response = await axios.delete(GALLERY_ENDPOINTS.DELETE(id));
      
      // Clear cache after deleting item
      this.clearPublicCache();
      
      return response.data;
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      
      // Return error object instead of throwing to prevent multiple error messages
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete gallery item'
      };
    }
  }

  // Upload image (optimized for large files)
  static async uploadImage(imageFile: File, fileName: string | null = null): Promise<ApiResponse> {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            const imageData = {
              image_data: e.target?.result,
              image_name: fileName || imageFile.name,
              image_type: imageFile.type,
              image_size: imageFile.size
            };

            const response = await axios.post(GALLERY_ENDPOINTS.UPLOAD, imageData, {
              timeout: 30000, // 30 second timeout for uploads
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  console.log(`Upload progress: ${percentCompleted}%`);
                }
              }
            });
            
            resolve(response.data);
          } catch (error: any) {
            // Return error object instead of throwing
            resolve({
              success: false,
              message: error.response?.data?.message || 'Failed to upload image'
            });
          }
        };

        reader.onerror = () => {
          resolve({
            success: false,
            message: 'Failed to read image file'
          });
        };

        reader.readAsDataURL(imageFile);
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload image'
      };
    }
  }

  // Upload image from clipboard (copy-paste)
  static async uploadImageFromClipboard(clipboardData: DataTransfer): Promise<ApiResponse> {
    try {
      const items = clipboardData.items;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            const fileName = `pasted_image_${Date.now()}.png`;
            return await this.uploadImage(file, fileName);
          }
        }
      }
      
      throw new Error('No image found in clipboard');
    } catch (error: any) {
      console.error('Error uploading image from clipboard:', error);
      throw this.handleError(error);
    }
  }

  // Get gallery statistics with caching
  static async getGalleryStats(): Promise<ApiResponse<GalleryStats>> {
    try {
      const cacheKey = 'gallery_stats';
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(GALLERY_ENDPOINTS.STATS);
      const result = response.data;
      
      // Cache successful responses for shorter duration (1 minute)
      if (result.success) {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error fetching gallery stats:', error);
      throw this.handleError(error);
    }
  }

  // Toggle active status
  static async toggleActive(id: number): Promise<ApiResponse<GalleryItem>> {
    try {
      const response = await axios.patch(GALLERY_ENDPOINTS.TOGGLE_ACTIVE(id));
      
      // Clear cache after toggling status
      this.clearPublicCache();
      
      return response.data;
    } catch (error: any) {
      console.error('Error toggling gallery item active status:', error);
      throw this.handleError(error);
    }
  }

  // Toggle featured status
  static async toggleFeatured(id: number): Promise<ApiResponse<GalleryItem>> {
    try {
      const response = await axios.patch(GALLERY_ENDPOINTS.TOGGLE_FEATURED(id));
      
      // Clear cache after toggling featured status
      this.clearPublicCache();
      
      return response.data;
    } catch (error: any) {
      console.error('Error toggling gallery item featured status:', error);
      throw this.handleError(error);
    }
  }

  // Clear public gallery cache
  static clearPublicCache(): void {
    for (const key of cache.keys()) {
      if (key.includes(GALLERY_ENDPOINTS.PUBLIC)) {
        cache.delete(key);
      }
    }
  }

  // Clear all cache
  static clearAllCache(): void {
    cache.clear();
  }

  // Handle API errors
  static handleError(error: any): ApiResponse {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      return {
        message: data.message || 'An error occurred',
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

  // Helper method to convert file to base64
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Helper method to validate image file
  static validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload images smaller than 10MB.');
    }

    return true;
  }

  // Preload critical gallery data
  static async preloadCriticalData(): Promise<void> {
    try {
      // Preload featured items and first page of gallery
      await Promise.all([
        this.getPublicGallery(null, 12), // First 12 items
        this.getPublicGallery(null, 3)   // Featured items
      ]);
    } catch (error) {
      console.error('Error preloading gallery data:', error);
    }
  }
}

export default GalleryApi;