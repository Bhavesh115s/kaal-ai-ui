"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  buttonText?: string
}

function FeatureCard({ icon, title, description, href, buttonText = "Start" }: FeatureCardProps) {
  return (
    <Card className="bg-card border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl">{icon}</div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>
        <Link href={href}>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function FeatureCards() {
  const features = [
    {
      icon: <MeditationIcon />,
      title: "Meditation",
      description: "Take a few gentle minutes to settle your thoughts and body.",
      href: "/meditation",
    },
    {
      icon: <TherapistIcon />,
      title: "Reflect & Connect",
      description: "Understand yourself better through guided reflections and connect with support.",
      href: "/reflection",
    },
    {
      icon: <EventsIcon />,
      title: "Events",
      description: "Explore upcoming community events and wellness sessions.",
      href: "/events",
    },
  ]

  return (
    <div className="w-full bg-secondary py-12 px-4">
      <p className="text-center text-sm text-muted-foreground italic mb-8">
        Explore more ways to support your wellbeing.
      </p>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
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

function TherapistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill="#e5b95e" />
      <path d="M4 20C4 16 7.5 14 12 14C16.5 14 20 16 20 20" stroke="#e5b95e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function EventsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="#e5b95e" strokeWidth="1.5" />
      <path d="M4 9H20" stroke="#e5b95e" strokeWidth="1.5" />
      <path d="M8 3V5" stroke="#e5b95e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V5" stroke="#e5b95e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
