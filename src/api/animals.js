// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get all animals with optional filters and pagination
 * @param {Object} options - Query options
 * @param {boolean} options.all - Include archived/inactive animals (default: false)
 * @param {number} options.page - Page number (default: 0)
 * @param {number} options.size - Page size (default: 20)
 */
export async function getAnimals(options = {}) {
  try {
    const params = new URLSearchParams();
    
    // Add query parameters if provided
    if (options.all) {
      params.append('all', 'true');
    }
    if (options.page !== undefined) {
      params.append('page', options.page.toString());
    }
    if (options.size !== undefined) {
      params.append('size', options.size.toString());
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
    console.log('Fetched paginated response:', {
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      contentLength: data.content?.length
    });
    return data; // Returns { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
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
 * Delete animal (soft delete - toggle active status)
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

/**
 * Hard delete animal (permanent deletion - only allowed within time window)
 */
export async function hardDeleteAnimal(id) {
  try {
    console.log('Hard deleting animal:', id);
    console.log('HARD DELETE URL:', `${API_BASE_URL}/animals/${id}/hard-delete`);
    
    const response = await fetch(`${API_BASE_URL}/animals/${id}/hard-delete`, {
      method: 'DELETE'
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('Animal hard deleted successfully');
    return true;
  } catch (error) {
    console.error('Error hard deleting animal:', error, error.stack);
    throw error;
  }
}

/**
 * Search animals with specific filters and pagination
 * @param {Object} params - Search parameters
 * @param {string} params.name - Filter by animal name
 * @param {string} params.speciesName - Filter by species name
 * @param {string} params.breedName - Filter by breed name
 * @param {boolean} params.all - Include archived/inactive animals
 * @param {number} params.page - Page number (default: 0)
 * @param {number} params.size - Page size (default: 20)
 */
export async function searchAnimals(params = {}) {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.name && params.name.trim()) {
      queryParams.append('name', params.name.trim())
    }
    if (params.speciesName && params.speciesName.trim()) {
      queryParams.append('speciesName', params.speciesName.trim())
    }
    if (params.breedName && params.breedName.trim()) {
      queryParams.append('breedName', params.breedName.trim())
    }
    if (params.all) {
      queryParams.append('all', 'true')
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString())
    }
    
    const queryString = queryParams.toString()
    const url = queryString 
      ? `${API_BASE_URL}/animals/search?${queryString}`
      : `${API_BASE_URL}/animals/search`
    
    console.log('Searching animals:', url)
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to search animals: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Search paginated response:', {
      page: data.page,
      size: data.size,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      contentLength: data.content?.length
    })
    return data // Returns { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
  } catch (error) {
    console.error('Error searching animals:', error, error.stack)
    throw error
  }
}

