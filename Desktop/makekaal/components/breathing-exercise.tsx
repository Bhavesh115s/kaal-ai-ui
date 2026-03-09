"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Volume2 } from "lucide-react"
import { DailyGitaWisdom } from "@/components/daily-gita-wisdom"

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
]

export function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0])
  const [breathCount, setBreathCount] = useState(6)
  const [currentBreath, setCurrentBreath] = useState(0)
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
  const [isActive, setIsActive] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [omSoundPlaying, setOmSoundPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const playOmSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.src = "/om.mp3"
      audioRef.current.loop = true
      audioRef.current.play()
    }
    setOmSoundPlaying(true)
  }, [])

  const stopOmSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setOmSoundPlaying(false)
  }, [])

  const toggleOmSound = useCallback(() => {
    if (omSoundPlaying) {
      stopOmSound()
    } else {
      playOmSound()
    }
  }, [omSoundPlaying, playOmSound, stopOmSound])

  const startSession = () => {
    setIsActive(true)
    setCurrentBreath(0)
    setPhase("inhale")
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentBreath(0)
    setPhase("idle")
    setShowReflection(false)
    stopOmSound()
  }

  useEffect(() => {
    if (!isActive) return

    let timer: NodeJS.Timeout

    if (phase === "inhale") {
      timer = setTimeout(() => {
        setPhase("hold")
      }, selectedPattern.inhale * 1000)
    }

    if (phase === "hold") {
      timer = setTimeout(() => {
        setPhase("exhale")
      }, selectedPattern.hold * 1000)
    }

    if (phase === "exhale") {
      timer = setTimeout(() => {
        const next = currentBreath + 1

        if (next >= breathCount) {
          setIsActive(false)
          setShowReflection(true)
        }

        setCurrentBreath(next)
        setPhase("inhale")
      }, selectedPattern.exhale * 1000)
    }

    return () => clearTimeout(timer)
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
                : "bg-card border border-border"
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
          disabled={isActive}
          className="w-8 h-8 rounded-full border flex items-center justify-center"
        >
          -
        </button>

        <span>{breathCount} Breaths</span>

        <button
          onClick={() => setBreathCount((prev) => prev + 1)}
          disabled={isActive}
          className="w-8 h-8 rounded-full border flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Breathing Animation */}
      <div className="relative w-64 h-64 mb-6">

        <div
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-1000",
            "bg-gradient-to-br from-cyan-200 to-blue-200",
            phase === "inhale" && "scale-110",
            phase === "exhale" && "scale-90"
          )}
        />

        <div
          className={cn(
            "absolute inset-4 rounded-full transition-all duration-1000",
            "bg-gradient-to-br from-cyan-300 to-purple-200",
            phase === "inhale" && "scale-105",
            phase === "exhale" && "scale-95"
          )}
        />

        {/* OM Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!omSoundPlaying ? (
            <button
              onClick={toggleOmSound}
              className="text-5xl hover:scale-110 transition"
            >
              ॐ
            </button>
          ) : (
            <div className="text-5xl animate-pulse">ॐ</div>
          )}
        </div>

        {/* Counter */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-2xl font-semibold">
            {currentBreath}/{breathCount}
          </p>

          <p className="text-sm capitalize">
            {phase === "idle" ? "Ready" : phase}
          </p>
        </div>

        {omSoundPlaying && (
          <button
            onClick={toggleOmSound}
            className="absolute top-4 right-4 flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full text-xs"
          >
            <Volume2 className="h-3 w-3" />
            OM Playing
          </button>
        )}
      </div>

      {!showReflection && (
        <Button
          onClick={isActive ? resetSession : startSession}
          className="rounded-full px-8"
        >
          {isActive ? "Stop" : "Start session"}
        </Button>
      )}

      {showReflection && <ReflectionPrompt onClose={resetSession} />}

      <audio ref={audioRef} loop />
    </div>
  )
}

function ReflectionPrompt({ onClose }: { onClose: () => void }) {
  const [showGita, setShowGita] = useState(false)

  return (
    <div className="max-w-2xl mx-auto w-full">
      {showGita ? (
        <div className="flex flex-col items-center gap-4">
          <DailyGitaWisdom onReflectionSubmit={() => setShowGita(false)} />
          <button onClick={onClose} className="text-sm">
            Continue
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-6 shadow-lg text-center">
          <h3 className="font-semibold mb-2">
            Session Complete
          </h3>

          <p className="text-sm mb-6">
            Notice how your body feels.
          </p>

          <div className="space-y-3">

            <button
              onClick={() => setShowGita(true)}
              className="w-full py-2 bg-primary text-white rounded-full"
            >
              Explore Gita Wisdom
            </button>

            <a href="/chat">
              <button className="w-full py-2 bg-muted rounded-full">
                Talk to KAAL
              </button>
            </a>

            <a href="/reflection">
              <button className="w-full py-2 border rounded-full">
                Reflection Test
              </button>
            </a>

          </div>

          <button onClick={onClose} className="text-sm mt-4">
            Skip
          </button>
        </div>
      )}
    </div>
  )
}