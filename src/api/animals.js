// API Base URL
import api from './axiosConfig';

/**
 * Get all animals with optional filters and pagination
 * @param {Object} options - Query options
 * @param {boolean} options.all - Include archived/inactive animals (default: false)
 * @param {number} options.page - Page number (default: 0)
 * @param {number} options.size - Page size (default: 20)
 */
export async function getAnimals(options = {}) {
  try {
    const params = {};
    
    // Add query parameters if provided
    if (options.all) {
      params.all = 'true';
    }
    if (options.page !== undefined) {
      params.page = options.page.toString();
    }
    if (options.size !== undefined) {
      params.size = options.size.toString();
    }
    
    console.log('Fetching animals with params:', params);
    const response = await api.get('/animals', { params });
    const data = response.data;
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
    const response = await api.get(`/animals/${id}`);
    const data = response.data;
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
    const response = await api.post('/animals', animalData);
    const data = response.data;
    console.log('Created animal:', data);
    return data;
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
    const response = await api.put(`/animals/${id}`, animalData);
    const data = response.data;
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
    await api.delete(`/animals/${id}`);
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
    await api.delete(`/animals/${id}/hard-delete`);
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
    const queryParams = {}
    
    if (params.name && params.name.trim()) {
      queryParams.name = params.name.trim()
    }
    if (params.speciesName && params.speciesName.trim()) {
      queryParams.speciesName = params.speciesName.trim()
    }
    if (params.breedName && params.breedName.trim()) {
      queryParams.breedName = params.breedName.trim()
    }
    if (params.all) {
      queryParams.all = 'true'
    }
    if (params.page !== undefined) {
      queryParams.page = params.page.toString()
    }
    if (params.size !== undefined) {
      queryParams.size = params.size.toString()
    }
    
    console.log('Searching animals with params:', queryParams)
    const response = await api.get('/animals/search', { params: queryParams })
    const data = response.data
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

/**
 * Get all photos for an animal
 * @param {string} animalId - Animal ID
 */
export async function getAnimalPhotos(animalId) {
  try {
    console.log('Fetching photos for animal:', animalId);
    const response = await api.get(`/animals/${animalId}/photos`);
    const data = response.data;
    console.log(`Fetched ${data.length} photos for animal ${animalId}`);
    return data;
  } catch (error) {
    console.error('Error fetching animal photos:', error, error.stack);
    throw error;
  }
}

/**
 * Upload a photo for an animal (base64 encoded)
 * @param {string} animalId - Animal ID
 * @param {Object} photoData - Photo data
 * @param {string} photoData.imageBase64 - Base64 encoded image data
 * @param {string} photoData.description - Optional photo description
 */
export async function uploadAnimalPhoto(animalId, photoData) {
  try {
    console.log('Uploading photo for animal:', animalId);
    const response = await api.post(`/animals/${animalId}/photos`, photoData);
    const data = response.data;
    console.log('Photo uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error uploading photo:', error, error.stack);
    throw error;
  }
}

/**
 * Delete a photo
 * @param {string} animalId - Animal ID
 * @param {string} photoId - Photo ID
 */
export async function deleteAnimalPhoto(animalId, photoId) {
  try {
    console.log('Deleting photo:', photoId, 'for animal:', animalId);
    await api.delete(`/animals/${animalId}/photos/${photoId}`);
    console.log('Photo deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error, error.stack);
    throw error;
  }
}

/**
 * Set a photo as primary (main photo)
 * @param {string} animalId - Animal ID
 * @param {string} photoId - Photo ID
 */
export async function setAnimalPhotoPrimary(animalId, photoId) {
  try {
    console.log('Setting photo as primary:', photoId, 'for animal:', animalId);
    const response = await api.patch(`/animals/${animalId}/photos/${photoId}/set-primary`);
    const data = response.data;
    console.log('Photo set as primary successfully:', data);
    return data;
  } catch (error) {
    console.error('Error setting photo as primary:', error, error.stack);
    throw error;
  }
}

/**
 * Reorder a photo
 * @param {string} animalId - Animal ID
 * @param {string} photoId - Photo ID
 * @param {number} order - New order/position
 */
export async function reorderAnimalPhoto(animalId, photoId, order) {
  try {
    console.log('Reordering photo:', photoId, 'to position:', order);
    const response = await api.patch(`/animals/${animalId}/photos/${photoId}/order`, null, {
      params: { order }
    });
    const data = response.data;
    console.log('Photo reordered successfully:', data);
    return data;
  } catch (error) {
    console.error('Error reordering photo:', error, error.stack);
    throw error;
  }
}

