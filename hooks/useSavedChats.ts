import { useState, useEffect } from "react"

export interface SavedChat {
  id: string
  title: string
  preview: string
  timestamp: string
}

interface UseSavedChatsReturn {
  savedChats: SavedChat[]
  loading: boolean
  error: string | null
  saveChat?: (chatData: Partial<SavedChat>) => Promise<SavedChat>
}

export function useSavedChats(): UseSavedChatsReturn {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSavedChats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/saved-chats")
        if (!response.ok) {
          throw new Error("Failed to fetch saved chats")
        }

        const data = await response.json()
        setSavedChats(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[Hook] Error fetching saved chats:", errorMessage)
        setError(errorMessage)
        setSavedChats([])
      } finally {
        setLoading(false)
      }
    }

    fetchSavedChats()
  }, [])

  const saveChat = async (chatData: Partial<SavedChat>) => {
    try {
      const response = await fetch("/api/saved-chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      })

      if (!response.ok) {
        throw new Error("Failed to save chat")
      }

      const newChat = await response.json()
      setSavedChats((prev) => [...prev, newChat])
      return newChat
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[Hook] Error saving chat:", errorMessage)
      throw err
    }
  }

  return { savedChats, loading, error, saveChat }
}
