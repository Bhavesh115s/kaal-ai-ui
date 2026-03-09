import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

interface UseChatReturn {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { sessionId, user } = useAuth()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      setLoading(true)
      setError(null)

      try {
        // Add user message to local state optimistically
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, userMessage])

        // Prepare headers with session ID for anonymous users
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "X-API-Key": "andai",
        }
        
        // Add session ID for anonymous users
        if (!user && sessionId) {
          headers["X-Session-ID"] = sessionId
        }

        // Send to API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: content,
            chat_history: messages,
            user_id: user?.id,
            session_id: sessionId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send message")
        }

        const data = await response.json()

        // Add AI response
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || data.message || "I understand. How can I help?",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message"
        setError(errorMessage)
        console.error("[useChat] Error:", err)

        // Remove the last user message if there was an error
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setLoading(false)
      }
    },
    [messages]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  }
}
