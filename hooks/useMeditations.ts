import { useState, useEffect } from "react"

export interface Meditation {
  id: string
  title: string
  description: string
  duration: string
  isFree?: boolean
  isLocked?: boolean
}

interface UseMeditationsReturn {
  meditations: Meditation[]
  loading: boolean
  error: string | null
}

export function useMeditations(): UseMeditationsReturn {
  const [meditations, setMeditations] = useState<Meditation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/meditations")
        if (!response.ok) {
          throw new Error("Failed to fetch meditations")
        }

        const data = await response.json()
        setMeditations(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[Hook] Error fetching meditations:", errorMessage)
        setError(errorMessage)
        setMeditations([])
      } finally {
        setLoading(false)
      }
    }

    fetchMeditations()
  }, [])

  return { meditations, loading, error }
}
