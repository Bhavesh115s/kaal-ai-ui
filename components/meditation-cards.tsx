"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"

interface MeditationCardProps {
  id: string
  title: string
  description: string
  duration: string
  isLocked?: boolean
  isFree?: boolean
  onLockedClick?: () => void
}

function MeditationCard({
  id,
  title,
  description,
  duration,
  isLocked = false,
  isFree = false,
  onLockedClick,
}: MeditationCardProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  const handleClick = () => {
    // If locked and not logged in, trigger login modal
    if (isLocked && !isLoggedIn) {
      onLockedClick?.()
      return
    }
    // Navigate to meditation session
    router.push(`/meditation/${id}`)
  }

  return (
    <Card
      className={cn(
        "bg-card border border-border cursor-pointer transition-all hover:shadow-md relative overflow-hidden",
        isFree && "border-green-300",
        isLocked && !isLoggedIn && "opacity-90"
      )}
      onClick={handleClick}
    >
      {/* Lock overlay */}
      {isLocked && !isLoggedIn && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Premium</span>
          </div>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <MeditationIcon />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          {isLocked && !isLoggedIn ? (
            <Badge variant="secondary" className="bg-muted text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Locked
            </Badge>
          ) : isFree ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Free
            </Badge>
          ) : (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              Unlocked
            </Badge>
          )}
          <span className="text-sm text-primary">{duration}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MeditationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6" r="2" fill="#e5b95e" />
      <path d="M12 10C9 10 6 13 6 16C6 17 7 18 12 18C17 18 18 17 18 16C18 13 15 10 12 10Z" fill="#e5b95e" opacity="0.6" />
    </svg>
  )
}

export function MeditationCards() {
  const [meditations, setMeditations] = useState<any[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isLoggedIn } = useAuth()

  // Default meditation cards - first one is always free
  const defaultMeditations = [
    {
      id: "breathing-calm",
      title: "Breathing Calm",
      description: "Find peace and relaxation with a guided breathing exercise.",
      duration: "10 mins",
      isFree: true,
    },
    {
      id: "morning-energy",
      title: "Morning Energy",
      description: "Start your day with vitality and clarity.",
      duration: "8 mins",
      isFree: false,
      isLocked: true,
    },
    {
      id: "stress-relief",
      title: "Stress Relief",
      description: "Release tension and find inner peace.",
      duration: "12 mins",
      isFree: false,
      isLocked: true,
    },
    {
      id: "deep-calm",
      title: "Deep Calm",
      description: "Enter a state of profound tranquility.",
      duration: "15 mins",
      isFree: false,
      isLocked: true,
    },
  ]

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await fetch("/api/meditations")
        if (response.ok) {
          const data = await response.json()
          // Ensure first meditation is always free and unlocked
          const formattedData = data.map((med: any, idx: number) => ({
            ...med,
            isFree: idx === 0,
            isLocked: idx > 0 && !isLoggedIn,
          }))
          setMeditations(formattedData)
        }
      } catch (error) {
        console.log("[v0] Failed to fetch meditations:", error)
        // Use default meditations
        setMeditations(defaultMeditations)
      }
    }

    fetchMeditations()
  }, [isLoggedIn])

  return (
    <>
      <div className="w-full bg-secondary py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-center text-foreground mb-2">
            Guided Meditations
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Choose a meditation to practice mindfulness and calm
          </p>
          
          {meditations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {meditations.map((meditation) => (
                <MeditationCard 
                  key={meditation.id} 
                  {...meditation}
                  // If user is logged in, unlock all premium content
                  isLocked={meditation.isLocked && !isLoggedIn}
                  onLockedClick={() => setShowLoginModal(true)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading meditations...</p>
            </div>
          )}
        </div>
      </div>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        title="Unlock Premium Meditations"
        message="Sign in to access all meditation sessions, save your progress, and track your wellness journey."
      />
    </>
  )
}
