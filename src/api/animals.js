// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get all animals with optional filters
 * @param {Object} options - Query options
 * @param {boolean} options.all - Include archived/inactive animals (default: false)
 * @param {string} options.search - Search term for filtering
 */
export async function getAnimals(options = {}) {
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
      ? `${API_BASE_URL}/animals?${queryString}`
      : `${API_BASE_URL}/animals`;
    
    console.log('Fetching animals from:', url);
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched animals:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('Error fetching animals:', error, error.stack);
    throw error;
  }
}

/**
 * Get single animal by ID
 */
export async function getAnimal(id) {
  try {
    console.log('Fetching animal:', id);
    const response = await fetch(`${API_BASE_URL}/animals/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched animal:', data);
    return data;
  } catch (error) {
    console.error('Error fetching animal:', error, error.stack);
    throw error;
  }
}

/**
 * Create new animal
 */
export async function createAnimal(animalData) {
  try {
    console.log('Creating animal with data:', animalData);
    console.log('POST URL:', `${API_BASE_URL}/animals`);
    
    const response = await fetch(`${API_BASE_URL}/animals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animalData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Created animal:', data);
      return data;
    } else {
      console.log('No JSON response body (possibly 204 No Content)');
      return null;
    }
  } catch (error) {
    console.error('Error creating animal:', error, error.stack);
    throw error;
  }
}

/**
 * Update animal
 */
export async function updateAnimal(id, animalData) {
  try {
    console.log('Updating animal:', id, 'with data:', animalData);
    console.log('PUT URL:', `${API_BASE_URL}/animals/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animalData)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Updated animal:', data);
    return data;
  } catch (error) {
    console.error('Error updating animal:', error, error.stack);
    throw error;
  }
}

/**
 * Delete animal (or toggle active status)
 */
export async function deleteAnimal(id) {
  try {
    console.log('Deleting animal:', id);
    console.log('DELETE URL:', `${API_BASE_URL}/animals/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/animals/${id}`, {
      method: 'DELETE'
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Animal deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting animal:', error, error.stack);
    throw error;
  }
}

