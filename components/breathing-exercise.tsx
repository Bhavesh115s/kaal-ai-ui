"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BreathingPattern = {
  name: string
  pattern: string
  inhale: number
  hold: number
  exhale: number
}

const patterns: BreathingPattern[] = [
  { name: "Gentle", pattern: "4-4-4", inhale: 4, hold: 4, exhale: 4 },
  { name: "Deep", pattern: "5-5-8", inhale: 5, hold: 5, exhale: 8 },
  { name: "Deep", pattern: "5-5-8", inhale: 5, hold: 5, exhale: 8 },
]

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0])
  const [breathCount, setBreathCount] = useState(6)
  const [currentBreath, setCurrentBreath] = useState(0)
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
  const [isActive, setIsActive] = useState(false)
  const [showReflection, setShowReflection] = useState(false)

  const startSession = useCallback(() => {
    setIsActive(true)
    setCurrentBreath(0)
    setPhase("inhale")
  }, [])

  const resetSession = useCallback(() => {
    setIsActive(false)
    setCurrentBreath(0)
    setPhase("idle")
    setShowReflection(false)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const runBreathCycle = () => {
      // Inhale phase
      setPhase("inhale")
      setTimeout(() => {
        // Hold phase
        setPhase("hold")
        setTimeout(() => {
          // Exhale phase
          setPhase("exhale")
          setTimeout(() => {
            setCurrentBreath((prev) => {
              const next = prev + 1
              if (next >= breathCount) {
                setIsActive(false)
                setShowReflection(true)
                return next
              }
              // Start next cycle
              setPhase("inhale")
              return next
            })
          }, selectedPattern.exhale * 1000)
        }, selectedPattern.hold * 1000)
      }, selectedPattern.inhale * 1000)
    }

    if (phase === "idle" && isActive) {
      runBreathCycle()
    }
  }, [isActive, phase, breathCount, selectedPattern, currentBreath])

  // Restart cycle when transitioning from exhale back to inhale
  useEffect(() => {
    if (!isActive || currentBreath >= breathCount) return
    
    if (phase === "inhale" && currentBreath > 0) {
      const timer = setTimeout(() => {
        setPhase("hold")
      }, selectedPattern.inhale * 1000)
      return () => clearTimeout(timer)
    }
    
    if (phase === "hold") {
      const timer = setTimeout(() => {
        setPhase("exhale")
      }, selectedPattern.hold * 1000)
      return () => clearTimeout(timer)
    }
    
    if (phase === "exhale") {
      const timer = setTimeout(() => {
        setCurrentBreath((prev) => {
          const next = prev + 1
          if (next >= breathCount) {
            setIsActive(false)
            setShowReflection(true)
            return next
          }
          setPhase("inhale")
          return next
        })
      }, selectedPattern.exhale * 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, isActive, currentBreath, breathCount, selectedPattern])

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg text-muted-foreground">Breathe with intention.</h2>
        <p className="text-sm text-muted-foreground">
          A guided breathing experience designed to reset your nervous system.
        </p>
      </div>

      {/* Pattern Selection */}
      <div className="flex gap-3 mb-6">
        {patterns.map((pattern, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPattern(pattern)}
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-all",
              selectedPattern === pattern
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            )}
          >
            {pattern.name} ({pattern.pattern})
          </button>
        ))}
      </div>

      {/* Breath Counter */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setBreathCount((prev) => Math.max(1, prev - 1))}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted"
          disabled={isActive}
        >
          -
        </button>
        <span className="text-sm text-foreground">{breathCount} Breaths</span>
        <button
          onClick={() => setBreathCount((prev) => prev + 1)}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted"
          disabled={isActive}
        >
          +
        </button>
      </div>

      {/* Breathing Animation */}
      <div className="relative w-64 h-64 mb-6">
        {/* Outer glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-1000",
            "bg-gradient-to-br from-cyan-200/50 to-blue-200/50",
            phase === "inhale" && "scale-110",
            phase === "hold" && "scale-110",
            phase === "exhale" && "scale-90"
          )}
        />
        
        {/* Inner circle */}
        <div
          className={cn(
            "absolute inset-4 rounded-full transition-all duration-1000",
            "bg-gradient-to-br from-cyan-300/60 to-purple-200/40",
            phase === "inhale" && "scale-105",
            phase === "hold" && "scale-105",
            phase === "exhale" && "scale-95"
          )}
        />

        {/* Meditation figure */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MeditationFigure />
        </div>

        {/* Counter and phase */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-2xl font-semibold text-primary">
            {currentBreath}/{breathCount}
          </p>
          <p className="text-sm text-primary capitalize">
            {phase === "idle" ? "Ready" : phase}
          </p>
        </div>
      </div>

      {/* Start/Reset Button */}
      {!showReflection && (
        <Button
          onClick={isActive ? resetSession : startSession}
          className="bg-muted hover:bg-muted/80 text-foreground rounded-full px-8"
        >
          {isActive ? "Stop" : "Start session"}
        </Button>
      )}

      {/* Reflection Modal */}
      {showReflection && (
        <ReflectionPrompt onClose={resetSession} />
      )}
    </div>
  )
}

function MeditationFigure() {
  return (
    <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="25" r="12" stroke="#d4a373" strokeWidth="2" fill="none" />
      {/* Body */}
      <path d="M50 37 L50 65" stroke="#d4a373" strokeWidth="2" />
      {/* Arms */}
      <path d="M30 70 Q40 55 50 60 Q60 55 70 70" stroke="#d4a373" strokeWidth="2" fill="none" />
      {/* Legs crossed */}
      <path d="M35 85 Q45 75 50 80 Q55 75 65 85" stroke="#d4a373" strokeWidth="2" fill="none" />
      <path d="M25 90 Q40 80 50 85 Q60 80 75 90" stroke="#d4a373" strokeWidth="2" fill="none" />
    </svg>
  )
}

function ReflectionPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg max-w-sm text-center">
      <h3 className="font-semibold text-foreground mb-2">
        Would you like to reflect for a moment?
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Notice how your body feels.<br />
        Do not suddenly move elements.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <a href="/chat">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
            Talk to Kaal
          </Button>
        </a>
        <a href="/chat">
          <Button variant="outline" className="rounded-full">
            Explore Gita Wisdom
          </Button>
        </a>
        <a href="/reflection">
          <Button variant="outline" className="rounded-full">
            Take Reflection Test
          </Button>
        </a>
      </div>
      <button
        onClick={onClose}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Skip for now
      </button>
    </div>
  )
}
