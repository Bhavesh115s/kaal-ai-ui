import { useState, useEffect } from "react"

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  category?: string
  price?: number
  spots?: number
  image?: string
}

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
  createEvent?: (eventData: Partial<Event>) => Promise<Event>
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/events")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        setEvents(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[Hook] Error fetching events:", errorMessage)
        setError(errorMessage)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const newEvent = await response.json()
      setEvents((prev) => [...prev, newEvent])
      return newEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[Hook] Error creating event:", errorMessage)
      throw err
    }
  }

  return { events, loading, error, createEvent }
}
