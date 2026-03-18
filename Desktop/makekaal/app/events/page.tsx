"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { EventCard } from "@/components/event-card"
import { useEvents } from "@/hooks/useEvents"
import { cn } from "@/lib/utils"

const filters = ["All"]

export default function EventsPage() {

const [activeFilter, setActiveFilter] = useState("All")

const { events, loading } = useEvents()

const filteredEvents =
activeFilter === "All"
? events
: events.filter((e) => e.type === activeFilter)

return ( <main className="min-h-screen flex flex-col bg-background">


  <Navbar showBackButton />

  <div className="flex-1 px-4 py-8">

    <div className="max-w-6xl mx-auto">

      <div className="text-center mb-8">

        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
          Upcoming Experiences
        </h1>

        <p className="text-muted-foreground">
          Join guided sessions to reconnect and reset.
        </p>

      </div>

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

      {loading ? (

        <p className="text-center text-muted-foreground">
          Loading events...
        </p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {events.map((event) => (

            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location || "Online"}
              price={event.price || 0}
              isOnline={event.type === "online"}
              zoom_link={event.zoom_link}
            />

          ))}

        </div>

      )}

    </div>

  </div>

</main>


)

}
