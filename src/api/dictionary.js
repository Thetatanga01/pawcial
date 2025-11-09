// Dictionary API helper functions
// Backend endpoint base URL
import { getApiBaseUrl } from '../config/apiConfig'
const API_BASE_URL = getApiBaseUrl()

// Dictionary endpoint mapping (plural forms)
const DICTIONARY_ENDPOINTS = {
  'asset-status': 'asset-statuses',
  'asset-type': 'asset-types',
  'color': 'colors',
  'domestic-status': 'domestic-statuses',
  'dose-route': 'dose-routes',
  'event-type': 'event-types',
  'facility-type': 'facility-types',
  'health-flag': 'health-flags',
  'hold-type': 'hold-types',
  'med-event-type': 'med-event-types',
  'observation-category': 'observation-categories',
  'organization': 'organizations',
  'outcome-type': 'outcome-types',
  'placement-status': 'placement-statuses',
  'placement-type': 'placement-types',
  'service-type': 'service-types',
  'sex': 'sexes',
  'size': 'sizes',
  'source-type': 'source-types',
  'temperament': 'temperaments',
  'training-level': 'training-levels',
  'unit-type': 'unit-types',
  'vaccine': 'vaccines',
  'volunteer-area': 'volunteer-areas',
  'volunteer-status': 'volunteer-statuses',
  'zone-purpose': 'zone-purposes',
  'proficiency-level': 'proficiency-levels'
}

/**
 * Get all items from a dictionary
 * @param {string} dictionaryId - Dictionary identifier
 * @param {boolean} showAll - Include archived/inactive items (default: false)
 * @returns {Promise<Array>} Array of dictionary items
 */
export async function getDictionaryItems(dictionaryId, showAll = false) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    // Dropdown için tüm kayıtları çek (size=1000 ile pagination varsa tümünü al)
    const params = new URLSearchParams({
      size: '1000',
      all: showAll.toString()
    })
    const url = `${API_BASE_URL}/${endpoint}?${params}`
    console.log('Fetching dictionary items:', { dictionaryId, endpoint, url, showAll })
    
    const response = await fetch(url)
    
    console.log('Fetch response:', {
      status: response.status,
      statusText: response.statusText
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorText}`)
    }
    
    const data = await response.json()
    // Backend response direkt array veya {content: []} olabilir
    const result = data.content || data
    console.log(`Fetched ${result.length} items from ${dictionaryId}`)
    return result
  } catch (error) {
    console.error(`Error fetching dictionary ${dictionaryId}:`, error)
    console.error('Error stack:', error.stack)
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
    // Proficiency-level için label yerine name kullan
    const requestData = dictionaryId === 'proficiency-level' 
      ? { ...data, name: data.label }
      : data
    
    const url = `${API_BASE_URL}/${endpoint}`
    console.log('Creating dictionary item:', { dictionaryId, endpoint, data: requestData, url })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    
    console.log('Create response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Create error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorText || 'No error details'}`)
    }
    
    // Backend returns 201 CREATED with the created item
    // Check if there's a response body
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json()
      console.log('Create success:', result)
      return result
    }
    
    // If no JSON response, return the input data with success status
    console.log('Create success (no response body)')
    return data
  } catch (error) {
    console.error(`Error creating dictionary item for ${dictionaryId}:`, error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * Toggle a dictionary item (activate/deactivate)
 * Backend uses soft delete pattern with toggle
 * @param {string} dictionaryId - Dictionary identifier
 * @param {string} code - Item code
 * @returns {Promise<void>}
 */
export async function toggleDictionaryItem(dictionaryId, code) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const url = `${API_BASE_URL}/${endpoint}/${code}/toggle`
    console.log('Toggling dictionary item:', { dictionaryId, endpoint, code, url })
    
    const response = await fetch(url, {
      method: 'PATCH'
    })
    
    console.log('Toggle response:', {
      status: response.status,
      statusText: response.statusText
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorText}`)
    }
    
    console.log('Toggle success')
  } catch (error) {
    console.error(`Error toggling dictionary item for ${dictionaryId}:`, error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * Delete a dictionary item (uses toggle for soft delete)
 * Note: Backend uses toggle instead of delete (soft delete pattern)
 * @param {string} dictionaryId - Dictionary identifier
 * @param {string} code - Item code
 * @returns {Promise<void>}
 */
export async function deleteDictionaryItem(dictionaryId, code) {
  return toggleDictionaryItem(dictionaryId, code)
}

/**
 * Hard delete a dictionary item (permanent deletion)
 * Dictionary items can be hard deleted without time restriction
 * @param {string} dictionaryId - Dictionary identifier
 * @param {string} code - Item code
 * @returns {Promise<void>}
 */
export async function hardDeleteDictionaryItem(dictionaryId, code) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    const url = `${API_BASE_URL}/${endpoint}/${code}/hard-delete`
    console.log('Hard deleting dictionary item:', { dictionaryId, endpoint, code, url })
    
    const response = await fetch(url, {
      method: 'DELETE'
    })
    
    console.log('Hard delete response:', {
      status: response.status,
      statusText: response.statusText
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorText}`)
    }
    
    console.log('Hard delete success')
  } catch (error) {
    console.error(`Error hard deleting dictionary item for ${dictionaryId}:`, error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * Update a dictionary item's label
 * Backend supports updating only the label field
 * @param {string} dictionaryId - Dictionary identifier
 * @param {string} code - Item code (immutable)
 * @param {object} data - Object with label property
 * @returns {Promise<object>} Updated item
 */
export async function updateDictionaryItem(dictionaryId, code, data) {
  const endpoint = DICTIONARY_ENDPOINTS[dictionaryId]
  if (!endpoint) {
    throw new Error(`Unknown dictionary: ${dictionaryId}`)
  }

  try {
    // Proficiency-level için label yerine name kullan
    const requestData = dictionaryId === 'proficiency-level'
      ? { name: data.label }
      : { label: data.label }
    
    const url = `${API_BASE_URL}/${endpoint}/${code}`
    console.log('Updating dictionary item:', { 
      dictionaryId, 
      endpoint, 
      code, 
      requestData, 
      url 
    })
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    
    console.log('Update response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}\nDetails: ${errorText || 'No error details'}`)
    }
    
    // Backend returns JSON response
    const result = await response.json()
    console.log('Update success:', result)
    
    return result
  } catch (error) {
    console.error(`Error updating dictionary item for ${dictionaryId}:`, error)
    console.error('Error stack:', error.stack)
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
