"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Zap, Calendar, BarChart3, Edit2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface SavedConversation {
  id: string
  title: string
  date: string
  messageCount: number
}

interface MeditationProgress {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
}

interface BookedEvent {
  id: string
  title: string
  date: string
  time: string
  status: "upcoming" | "completed"
}

interface ReflectionEntry {
  id: string
  date: string
  stressLevel: "Low" | "Moderate" | "High"
  mood: string
}

export default function ProfilePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([])
  const [meditationProgress, setMeditationProgress] = useState<MeditationProgress>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
  })
  const [bookedEvents, setBookedEvents] = useState<BookedEvent[]>([])
  const [reflectionHistory, setReflectionHistory] = useState<ReflectionEntry[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // Load saved conversations
    const savedChats = localStorage.getItem("kaal-saved-conversations")
    if (savedChats) {
      setSavedConversations(JSON.parse(savedChats))
    } else {
      // Demo data
      setSavedConversations([
        {
          id: "1",
          title: "Discussion about stress management",
          date: "Mar 5, 2026",
          messageCount: 12,
        },
        {
          id: "2",
          title: "Work-life balance conversation",
          date: "Mar 3, 2026",
          messageCount: 8,
        },
        {
          id: "3",
          title: "Evening reflection session",
          date: "Feb 28, 2026",
          messageCount: 6,
        },
      ])
    }

    // Load meditation progress
    const medProgress = localStorage.getItem("kaal-meditation-progress")
    if (medProgress) {
      setMeditationProgress(JSON.parse(medProgress))
    } else {
      // Demo data
      setMeditationProgress({
        totalSessions: 24,
        totalMinutes: 480,
        currentStreak: 7,
        longestStreak: 14,
      })
    }

    // Load booked events
    const bookedEventsData = localStorage.getItem("kaal-booked-events")
    if (bookedEventsData) {
      setBookedEvents(JSON.parse(bookedEventsData))
    } else {
      // Demo data
      setBookedEvents([
        {
          id: "1",
          title: "Weekly Yoga Session",
          date: "Mar 10, 2026",
          time: "6:00 PM",
          status: "upcoming",
        },
        {
          id: "2",
          title: "Meditation Circle",
          date: "Mar 8, 2026",
          time: "5:30 PM",
          status: "upcoming",
        },
        {
          id: "3",
          title: "Wellness Workshop",
          date: "Feb 25, 2026",
          time: "2:00 PM",
          status: "completed",
        },
      ])
    }

    // Load reflection history
    const reflectionData = localStorage.getItem("kaal-reflection-history")
    if (reflectionData) {
      setReflectionHistory(JSON.parse(reflectionData))
    } else {
      // Demo data
      setReflectionHistory([
        {
          id: "1",
          date: "Mar 6, 2026",
          stressLevel: "Low",
          mood: "Calm and peaceful",
        },
        {
          id: "2",
          date: "Mar 4, 2026",
          stressLevel: "Moderate",
          mood: "Slightly anxious but hopeful",
        },
        {
          id: "3",
          date: "Feb 29, 2026",
          stressLevel: "High",
          mood: "Overwhelmed",
        },
      ])
    }
  }, [isLoggedIn, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar showBackButton />

      <div className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 bg-primary/20">
                <AvatarFallback className="text-2xl font-semibold text-primary">
                  {user.initial}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-2">Member since today</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full" disabled>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="rounded-full text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </section>

          {/* Meditation Progress */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Meditation Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Sessions</p>
                  <p className="text-3xl font-bold text-foreground">
                    {meditationProgress.totalSessions}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Total Minutes</p>
                  <p className="text-3xl font-bold text-foreground">
                    {meditationProgress.totalMinutes}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Current Streak</p>
                  <p className="text-3xl font-bold text-primary">
                    {meditationProgress.currentStreak} days
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm mb-2">Longest Streak</p>
                  <p className="text-3xl font-bold text-foreground">
                    {meditationProgress.longestStreak} days
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Saved Conversations */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Saved Conversations
            </h2>
            {savedConversations.length > 0 ? (
              <div className="space-y-3">
                {savedConversations.map((conv) => (
                  <Card key={conv.id} className="bg-card border-border hover:border-muted-foreground transition-colors cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{conv.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {conv.messageCount} messages • {conv.date}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full">
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No saved conversations yet</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Booked Events */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booked Events
            </h2>
            {bookedEvents.length > 0 ? (
              <div className="space-y-3">
                {bookedEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`border ${
                      event.status === "completed"
                        ? "bg-muted/50 border-muted"
                        : "bg-card border-border hover:border-muted-foreground"
                    } transition-colors`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.date} at {event.time}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-2 ${
                              event.status === "completed"
                                ? "text-muted-foreground"
                                : "text-primary"
                            }`}
                          >
                            {event.status === "completed" ? "COMPLETED" : "UPCOMING"}
                          </p>
                        </div>
                        {event.status === "upcoming" && (
                          <Button variant="outline" size="sm" className="rounded-full">
                            Modify
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No booked events</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Reflection History */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reflection History
            </h2>
            {reflectionHistory.length > 0 ? (
              <div className="space-y-3">
                {reflectionHistory.map((entry) => (
                  <Card key={entry.id} className="bg-card border-border">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">{entry.date}</p>
                          <p className="font-medium text-foreground mt-1">{entry.mood}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            entry.stressLevel === "Low"
                              ? "bg-green-100/20 text-green-700"
                              : entry.stressLevel === "Moderate"
                                ? "bg-yellow-100/20 text-yellow-700"
                                : "bg-red-100/20 text-red-700"
                          }`}
                        >
                          {entry.stressLevel} Stress
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No reflection history yet</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
