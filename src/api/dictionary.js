// Dictionary API helper functions
// Backend endpoint base URL
const API_BASE_URL = 'http://localhost:8000/api'

// Dictionary endpoint mapping
// Bu mapping'ler backend'deki gerçek endpoint'lere göre güncellenecek
const DICTIONARY_ENDPOINTS = {
  'asset-status': 'asset-status',
  'asset-type': 'asset-type',
  'color': 'color',
  'domestic-status': 'domestic-status',
  'dose-route': 'dose-route',
  'event-type': 'event-type',
  'facility-type': 'facility-type',
  'health-flag': 'health-flag',
  'hold-type': 'hold-type',
  'med-event-type': 'med-event-type',
  'observation-category': 'observation-category',
  'outcome-type': 'outcome-type',
  'placement-status': 'placement-status',
  'placement-type': 'placement-type',
  'service-type': 'service-type',
  'sex': 'sex',
  'size': 'size',
  'source-type': 'source-type',
  'temperament': 'temperament',
  'training-level': 'training-level',
  'unit-type': 'unit-type',
  'vaccine': 'vaccine',
  'volunteer-area': 'volunteer-area-dictionary',
  'volunteer-status': 'volunteer-status',
  'zone-purpose': 'zone-purpose'
}

/**
 * Get all items from a dictionary
 * @param {string} dictionaryId - Dictionary identifier
 * @returns {Promise<Array>} Array of dictionary items
 */
export async function getDictionaryItems(dictionaryId) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching dictionary ${dictionaryId}:`, error)
    throw error
  }
}

/**
 * Create a new dictionary item
 * @param {string} dictionaryId - Dictionary identifier
 * @param {object} data - Item data with code and label
 * @returns {Promise<object>} Created item
 */
export async function createDictionaryItem(dictionaryId, data) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error creating dictionary item for ${dictionaryId}:`, error)
    throw error
  }
}

/**
 * Update a dictionary item
 * @param {string} dictionaryId - Dictionary identifier
 * @param {number|string} itemId - Item ID
 * @param {object} data - Updated data with code and label
 * @returns {Promise<object>} Updated item
 */
export async function updateDictionaryItem(dictionaryId, itemId, data) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error updating dictionary item for ${dictionaryId}:`, error)
    throw error
  }
}

/**
 * Delete a dictionary item
 * @param {string} dictionaryId - Dictionary identifier
 * @param {number|string} itemId - Item ID
 * @returns {Promise<void>}
 */
export async function deleteDictionaryItem(dictionaryId, itemId) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${itemId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error deleting dictionary item for ${dictionaryId}:`, error)
    throw error
  }
}

/**
 * Get available dictionary types
 * @returns {Array<string>} Array of dictionary IDs
 */
export function getAvailableDictionaries() {
  return Object.keys(DICTIONARY_ENDPOINTS)
}

