"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { EventCard } from "@/components/event-card"
import { cn } from "@/lib/utils"

const filters = ["All"]

const events: Array<any> = []

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredEvents = activeFilter === "All" 
    ? events 
    : events.filter(e => e.category === activeFilter)

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
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
