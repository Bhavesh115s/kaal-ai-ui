/**
 * Centralized API helper for all frontend API requests
 * Handles communication with Next.js API routes which forward to FastAPI backend
 * 
 * Architecture:
 * Frontend Components → Next.js API Routes (/api/*) → FastAPI Backend
 * 
 * All requests to /api/* routes are forwarded to FastAPI backend with X-API-Key header
 * API_KEY header value: "andai" (configurable via environment variables)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "andai"
const NEXT_API_BASE = "/api"

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

// Export singleton instance (configured for Next.js API routes)
export const api = new ApiClient(NEXT_API_BASE, API_KEY)

// Export class for testing purposes
export { ApiClient }

/**
 * FastAPI Endpoint Helpers
 * Use these functions for common API operations
 * All requests go through Next.js API routes which forward to FastAPI backend
 */

// Chat endpoints
export const chatApi = {
  sendMessage: (message: string, chatHistory?: any[]) =>
    api.post("/chat", { message, chat_history: chatHistory }),
  getHistory: () => api.get("/chat"),
}

// Events endpoints
export const eventsApi = {
  getAll: () => api.get("/events"),
  create: (eventData: any) => api.post("/events", eventData),
  getById: (id: string) => api.get(`/events/${id}`),
  register: (eventId: string, registrationData: any) =>
    api.post(`/events/${eventId}/register`, registrationData),
}

// Meditation endpoints
export const meditationApi = {
  getAll: () => api.get("/meditations"),
  getById: (id: string) => api.get(`/meditations/${id}`),
  recordSession: (meditationId: string, duration: number) =>
    api.post("/meditations/session", { meditation_id: meditationId, duration }),
}

// Psychologist endpoints
export const psychologistApi = {
  getAll: () => api.get("/psychologist"),
  bookSession: (booking: any) => api.post("/psychologist", booking),
  getAvailability: (psychologistId: string) =>
    api.get(`/psychologist/${psychologistId}/availability`),
}

// Self-reflection endpoints
export const reflectionApi = {
  submitAssessment: (answers: any) =>
    api.post("/reflection", { answers }),
  getHistory: () => api.get("/reflection"),
  getAnalysis: (reflectionId: string) =>
    api.get(`/reflection/${reflectionId}/analysis`),
}

// Gita wisdom endpoints
export const gitaApi = {
  getDailyVerse: () => api.get("/gita/daily-verse"),
  getVerse: (verseId: string) => api.get(`/gita/${verseId}`),
}

// Saved chats endpoints
export const savedChatsApi = {
  getAll: () => api.get("/saved-chats"),
  save: (chatData: any) => api.post("/saved-chats", chatData),
  getById: (id: string) => api.get(`/saved-chats/${id}`),
  delete: (id: string) => api.delete(`/saved-chats/${id}`),
}
