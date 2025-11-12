// Generic API helper factory
import api from './axiosConfig';

/**
 * Creates API helpers for a given endpoint
 * @param {string} endpoint - API endpoint (e.g., 'species', 'breeds')
 * @returns {Object} API helper functions
 */
export function createApiHelpers(endpoint) {
  return {
    /**
     * Get items with optional filters and pagination
     * @param {Object} options - Query options
     * @param {boolean} options.all - Include archived/inactive items (default: false)
     * @param {number} options.page - Page number (default: 0)
     * @param {number} options.size - Page size (default: 20)
     */
    async getAll(options = {}) {
      try {
        const params = {};
        
        // Add query parameters if provided
        if (options.all) {
          params.all = 'true';
        }
        if (options.page !== undefined) {
          params.page = String(options.page);
        }
        if (options.size !== undefined) {
          params.size = String(options.size);
        }
        
        console.log(`Fetching ${endpoint} (paged) with params:`, params);
        const response = await api.get(`/${endpoint}`, { params });
        const data = response.data;
        
        // Backend'den array mı yoksa paginated response mu geldiğini kontrol et
        if (Array.isArray(data)) {
          // Düz array ise, paginated response formatına çevir
          console.log(`Fetched ${endpoint} as array, length:`, data.length);
          return {
            content: data,
            page: 0,
            size: data.length,
            totalElements: data.length,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false
          };
        } else {
          // Zaten paginated response ise olduğu gibi dön
          console.log(`Fetched ${endpoint} page`, {
            page: data.page,
            size: data.size,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            contentLength: data.content?.length
          });
          return data;
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },

    /**
     * Search endpoint with pagination
     * @param {Object} params
     * @param {string} params.search - generic search term (backend should map it)
     * @param {boolean} params.all - include inactive
     * @param {number} params.page - page number
     * @param {number} params.size - page size
     * @param {Object} [extra] - extra query params (key/value) for entity-specific fields
     */
    async search(params = {}, extra = {}) {
      try {
        const queryParams = {};

        if (params.search && params.search.trim()) {
          queryParams.search = params.search.trim();
        }
        if (params.all) {
          queryParams.all = 'true';
        }
        if (params.page !== undefined) {
          queryParams.page = String(params.page);
        }
        if (params.size !== undefined) {
          queryParams.size = String(params.size);
        }
        // append extra params if provided
        Object.entries(extra || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && String(value).trim() !== '') {
            queryParams[key] = String(value);
          }
        });

        console.log(`Searching ${endpoint} (paged) with params:`, queryParams);
        const response = await api.get(`/${endpoint}/search`, { params: queryParams });
        const data = response.data;
        console.log(`Search ${endpoint} page`, {
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          contentLength: data.content?.length
        });
        return data;
      } catch (error) {
        console.error(`Error searching ${endpoint}:`, error);
        throw error;
      }
    },

    async getOne(id) {
      try {
        console.log(`Fetching ${endpoint} by id:`, id);
        const response = await api.get(`/${endpoint}/${id}`);
        const data = response.data;
        console.log(`Fetched ${endpoint}:`, data);
        return data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },

    async create(data) {
      try {
        console.log(`Creating ${endpoint}:`, data);
        const response = await api.post(`/${endpoint}`, data);
        const result = response.data;
        console.log(`Created ${endpoint}:`, result);
        return result;
      } catch (error) {
        console.error(`Error creating ${endpoint}:`, error);
        throw error;
      }
    },

    async update(id, data) {
      try {
        console.log(`Updating ${endpoint}:`, id, data);
        const response = await api.put(`/${endpoint}/${id}`, data);
        const result = response.data;
        console.log(`Updated ${endpoint}:`, result);
        return result;
      } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        throw error;
      }
    },

    async delete(id) {
      try {
        console.log(`Deleting ${endpoint}:`, id);
        await api.delete(`/${endpoint}/${id}`);
        console.log(`${endpoint} deleted successfully`);
        return true;
      } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
      }
    },

    async hardDelete(id) {
      try {
        console.log(`Hard deleting ${endpoint}:`, id);
        await api.delete(`/${endpoint}/${id}/hard-delete`);
        console.log(`${endpoint} hard deleted successfully`);
        return true;
      } catch (error) {
        console.error(`Error hard deleting ${endpoint}:`, error);
        throw error;
      }
    }
  };
}

