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
     * Get all items with optional filters
     * @param {Object} options - Query options
     * @param {boolean} options.all - Include archived/inactive items (default: false)
     * @param {string} options.search - Search term for filtering
     */
    async getAll(options = {}) {
      try {
        const params = new URLSearchParams();
        
        // Add query parameters if provided
        if (options.all) {
          params.append('all', 'true');
        }
        if (options.search && options.search.trim()) {
          params.append('search', options.search.trim());
        }
        
        const queryString = params.toString();
        const url = queryString 
          ? `${API_BASE_URL}/${endpoint}?${queryString}`
          : `${API_BASE_URL}/${endpoint}`;
        
        console.log(`Fetching all ${endpoint}:`, url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.length} ${endpoint} items`);
        return data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
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

