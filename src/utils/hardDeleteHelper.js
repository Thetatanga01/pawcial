// Hard Delete Helper Functions
import api from '../api/axiosConfig';

/**
 * Checks if hard delete is allowed based on creation time and system parameter
 * @param {string} createdAt - ISO timestamp of when record was created
 * @param {number} hardDeleteWindowSeconds - Time window in seconds from system parameter
 * @returns {boolean} True if hard delete is allowed
 */
export function isHardDeleteAllowed(createdAt, hardDeleteWindowSeconds = 300) {
  if (!createdAt) {
    return false // No creation time = can't determine, don't allow hard delete
  }
  
  try {
    const createdTime = new Date(createdAt).getTime()
    const currentTime = new Date().getTime()
    const elapsedSeconds = (currentTime - createdTime) / 1000
    
    return elapsedSeconds <= hardDeleteWindowSeconds
  } catch (error) {
    console.error('Error calculating hard delete eligibility:', error)
    return false
  }
}

/**
 * Gets remaining time for hard delete in seconds
 * @param {string} createdAt - ISO timestamp of when record was created
 * @param {number} hardDeleteWindowSeconds - Time window in seconds from system parameter
 * @returns {number} Remaining seconds, or 0 if expired
 */
export function getHardDeleteRemainingSeconds(createdAt, hardDeleteWindowSeconds = 300) {
  if (!createdAt) {
    return 0
  }
  
  try {
    const createdTime = new Date(createdAt).getTime()
    const currentTime = new Date().getTime()
    const elapsedSeconds = (currentTime - createdTime) / 1000
    const remaining = hardDeleteWindowSeconds - elapsedSeconds
    
    return Math.max(0, Math.floor(remaining))
  } catch (error) {
    console.error('Error calculating remaining time:', error)
    return 0
  }
}

/**
 * Formats remaining time as human-readable string
 * @param {number} seconds - Remaining seconds
 * @returns {string} Formatted time (e.g., "2dk 30sn", "45sn")
 */
export function formatRemainingTime(seconds) {
  if (seconds <= 0) return '0sn'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}dk ${remainingSeconds}sn`
  }
  return `${remainingSeconds}sn`
}

/**
 * Fetches system parameter for hard delete window
 * @returns {Promise<number>} Hard delete window in seconds, defaults to 300
 */
export async function fetchHardDeleteWindowSeconds() {
  try {
    const response = await api.get('/system-parameters')
    const params = response.data
    const hardDeleteParam = params.find(p => p.code === 'HARD_DELETE_WINDOW_SECONDS')
    
    if (hardDeleteParam && hardDeleteParam.parameterValue) {
      return parseInt(hardDeleteParam.parameterValue, 10)
    }
    
    return 300 // Default fallback
  } catch (error) {
    console.error('Error fetching hard delete window:', error)
    return 300 // Default fallback
  }
}

