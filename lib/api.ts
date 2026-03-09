/**
 * Centralized API helper for all frontend API requests
 * Handles communication with Next.js API routes which forward to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "andai"

interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string = API_BASE_URL, apiKey: string = API_KEY) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private getHeaders(additionalHeaders?: Record<string, string>) {
    return {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      ...additionalHeaders,
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        ...options,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data?.error || "Request failed",
        status: response.status,
      }
    } catch (error) {
      console.error("[API] GET request failed:", error)
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      }
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data?.error || "Request failed",
        status: response.status,
      }
    } catch (error) {
      console.error("[API] POST request failed:", error)
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      }
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: "PUT",
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data?.error || "Request failed",
        status: response.status,
      }
    } catch (error) {
      console.error("[API] PUT request failed:", error)
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      }
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        method: "DELETE",
        headers: this.getHeaders(),
        ...options,
      })

      const data = response.ok ? await response.json() : {}

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data?.error || "Request failed",
        status: response.status,
      }
    } catch (error) {
      console.error("[API] DELETE request failed:", error)
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      }
    }
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export class for testing purposes
export { ApiClient }
