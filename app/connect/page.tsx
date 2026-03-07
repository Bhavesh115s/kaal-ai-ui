"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { TherapistCard } from "@/components/therapist-card"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/contexts/auth-context"

const therapists = [
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Today 4:30 PM",
    communicationModes: ["Audio call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isRecommended: true,
    isOnline: true,
  },
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Today 4:30 PM",
    communicationModes: ["Video call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isRecommended: true,
    isOnline: true,
  },
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Tomorrow 4:30 PM",
    communicationModes: ["Video call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isBestMatch: true,
    isOnline: false,
  },
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Today 4:30 PM",
    communicationModes: ["Audio call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isRecommended: true,
    isOnline: true,
  },
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Today 4:30 PM",
    communicationModes: ["Video call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isRecommended: true,
    isOnline: true,
  },
  {
    name: "Dr. Soham Sharma",
    specialization: "Relationship & Emotional Recovery",
    experience: "10 years exp.",
    rating: 4.5,
    sessionPrice: 1500,
    nextAvailable: "Tomorrow 4:30 PM",
    communicationModes: ["Video call"],
    languages: ["English", "Tamil"],
    quote: "I help individuals navigate relationship transitions with clarity and confidence.",
    isBestMatch: true,
    isOnline: false,
  },
]

export default function ConnectPage() {
  const [stressLevel, setStressLevel] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    // Check if user came from reflection with high stress
    const result = sessionStorage.getItem("reflectionResult")
    if (result) {
      const parsed = JSON.parse(result)
      setStressLevel(parsed.level)
    }
  }, [])

  const handleBookSession = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar showBackButton />
      
      <div className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
              Here&apos;s someone who may be right for you
            </h1>
            <p className="text-muted-foreground">
              Based on what you shared, we found these therapists.
            </p>
            {stressLevel === "High" && (
              <p className="text-sm text-primary mt-2">
                Based on your reflection assessment, we recommend speaking with a professional.
              </p>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            KAAL does not replace professional therapy. If you're experiencing severe distress, persistent symptoms, or thoughts of self-harm, please reach out to a mental health professional. Human support is available when needed, and there's no shame in seeking help.
          </p>

          {/* Therapist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {therapists.map((therapist, idx) => (
              <TherapistCard key={idx} {...therapist} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              Don't see the right fit? Scroll down for more options.
            </p>
            <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center text-xs">?</span>
              Not sure who to choose? That's completely okay.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Picking a therapist can feel overwhelming. Here are some options to help you take the next step.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/chat">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                  Talk to Kaal AI
                </Button>
              </Link>
              <Link href="/meditation">
                <Button variant="outline" className="rounded-full px-8">
                  Try Meditation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        title="Sign in to book"
        message="Create an account to book sessions with therapists and track your progress."
      />
    </main>
  )
}
