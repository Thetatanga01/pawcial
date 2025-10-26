// Generic API helper factory
const API_BASE_URL = 'http://localhost:8000/api';

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
        const params = new URLSearchParams();
        
        // Add query parameters if provided
        if (options.all) {
          params.append('all', 'true');
        }
        if (options.page !== undefined) {
          params.append('page', String(options.page));
        }
        if (options.size !== undefined) {
          params.append('size', String(options.size));
        }
        
        const queryString = params.toString();
        const url = queryString 
          ? `${API_BASE_URL}/${endpoint}?${queryString}`
          : `${API_BASE_URL}/${endpoint}`;
        
        console.log(`Fetching ${endpoint} (paged):`, url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${endpoint} page`, {
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          contentLength: data.content?.length
        });
        return data; // { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
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
        const queryParams = new URLSearchParams();

        if (params.search && params.search.trim()) {
          queryParams.append('search', params.search.trim());
        }
        if (params.all) {
          queryParams.append('all', 'true');
        }
        if (params.page !== undefined) {
          queryParams.append('page', String(params.page));
        }
        if (params.size !== undefined) {
          queryParams.append('size', String(params.size));
        }
        // append extra params if provided
        Object.entries(extra || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && String(value).trim() !== '') {
            queryParams.append(key, String(value));
          }
        });

        const queryString = queryParams.toString();
        const url = queryString
          ? `${API_BASE_URL}/${endpoint}/search?${queryString}`
          : `${API_BASE_URL}/${endpoint}/search`;

        console.log(`Searching ${endpoint} (paged):`, url);
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
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
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
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
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log(`Created ${endpoint}:`, result);
          return result;
        } else {
          console.log(`${endpoint} created (no JSON response)`);
          return null;
        }
      } catch (error) {
        console.error(`Error creating ${endpoint}:`, error);
        throw error;
      }
    },

    async update(id, data) {
      try {
        console.log(`Updating ${endpoint}:`, id, data);
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
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
        const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log(`${endpoint} deleted successfully`);
        return true;
      } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
      }
    }
  };
}

