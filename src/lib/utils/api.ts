/**
 * Safe API utilities for handling JSON responses
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Safely parse JSON response with proper error handling
 */
export async function parseJsonSafely<T = any>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    console.warn(`API response not OK: ${response.status} ${response.statusText}`)
    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
  }
  
  try {
    const text = await response.text()
    if (!text.trim()) {
      return { success: false, error: 'Empty response' }
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.warn('Response is not JSON:', text.substring(0, 100))
      return { success: false, error: 'Invalid JSON response' }
    }
    
    const data = JSON.parse(text)
    return data
  } catch (parseError) {
    console.warn('JSON parse error:', parseError)
    return { success: false, error: 'JSON parse failed' }
  }
}

/**
 * Fetch with safe JSON parsing
 */
export async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options)
    return await parseJsonSafely<T>(response)
  } catch (fetchError) {
    console.error('Fetch error:', fetchError)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Fetch multiple URLs with safe JSON parsing
 */
export async function fetchMultipleJson<T = any>(urls: string[]): Promise<ApiResponse<T>[]> {
  const responses = await Promise.allSettled(urls.map(url => fetch(url)))
  
  return Promise.all(
    responses.map(async (result) => {
      if (result.status === 'fulfilled') {
        return await parseJsonSafely<T>(result.value)
      } else {
        return { success: false, error: result.reason?.message || 'Request failed' }
      }
    })
  )
}