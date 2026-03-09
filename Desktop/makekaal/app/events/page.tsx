"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { EventCard } from "@/components/event-card"
import { cn } from "@/lib/utils"

const filters = ["All"]

export default function EventsPage() {

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events`
        )

        const data = await response.json()

        console.log("EVENT DATA:", data)

        // ensure events always array
        if (Array.isArray(data)) {
          setEvents(data)
        } 
        else if (data && Array.isArray(data.events)) {
          setEvents(data.events)
        } 
        else {
          setEvents([])
        }

      } catch (error) {

        console.log("Failed to fetch events:", error)
        setEvents([])

      }

      setLoading(false)

    }

    fetchEvents()

  }, [])

  // ensure filteredEvents always array
  const safeEvents = Array.isArray(events) ? events : []

  const filteredEvents =
    activeFilter === "All"
      ? safeEvents
      : safeEvents.filter((e) => e.category === activeFilter)

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading events...</p>
      </main>
    )
  }

  return (

    <main className="min-h-screen flex flex-col bg-background">

      <Navbar showBackButton />

      <div className="flex-1 px-4 py-8">

        <div className="max-w-6xl mx-auto">

          {/* Header */}

          <div className="text-center mb-8">

            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
              Upcoming Experiences
            </h1>

            <p className="text-muted-foreground">
              Join guided sessions to reconnect and reset.
            </p>

          </div>

          {/* Filters */}

          <div className="flex justify-center gap-3 mb-8">

            {filters.map((filter) => (

              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm transition-all",
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {filter}
              </button>

            ))}

          </div>

          {/* Events Grid */}

          {filteredEvents.length === 0 ? (

            <div className="text-center py-12">

              <p className="text-lg text-muted-foreground">
                No upcoming events at the moment.
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for new sessions.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredEvents.map((event: any) => (

                <EventCard
                  key={event._id || event.id}
                  id={event._id || event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  price={event.price}
                  isOnline={event.isOnline}
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </main>

  )

}