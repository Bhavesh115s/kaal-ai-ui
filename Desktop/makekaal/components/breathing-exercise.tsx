"use client"

import { useState, useEffect, useRef } from "react"
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

type BreathingExerciseProps = {
  onSessionComplete?: () => void
}

const patterns: BreathingPattern[] = [
  { name: "Gentle", pattern: "4-4-4", inhale: 4, hold: 4, exhale: 4 },
  { name: "Deep", pattern: "5-5-8", inhale: 5, hold: 5, exhale: 8 },
]

export function BreathingExercise({ onSessionComplete }: BreathingExerciseProps) {

  const [selectedPattern, setSelectedPattern] = useState(patterns[0])
  const [breathCount, setBreathCount] = useState(6)
  const [currentBreath, setCurrentBreath] = useState(0)
  const [phase, setPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle")
  const [isActive, setIsActive] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [omPlaying, setOmPlaying] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  /* ---------------- OM SOUND ---------------- */

  useEffect(() => {
    audioRef.current = new Audio("/sounds/om.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = 0.5
  }, [])

  const toggleOmSound = () => {

    if (!audioRef.current) return

    if (omPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    } else {
      audioRef.current.play().catch(()=>{})
    }

    setOmPlaying(!omPlaying)
  }

  const stopOm = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setOmPlaying(false)
  }

  /* ---------------- BREATHING ENGINE ---------------- */

  const startSession = () => {

    setIsActive(true)
    setCurrentBreath(0)
    setShowReflection(false)

    runCycle()
  }

  const runCycle = () => {

    setPhase("inhale")

    timerRef.current = setTimeout(() => {

      setPhase("hold")

      timerRef.current = setTimeout(() => {

        setPhase("exhale")

        timerRef.current = setTimeout(() => {

          setCurrentBreath((prev)=>{

            const next = prev + 1

            if (next >= breathCount) {

              setIsActive(false)
              setShowReflection(true)
              setPhase("idle")

              stopOm()

              /* SESSION COMPLETE CALLBACK */

              if (onSessionComplete) {
                onSessionComplete()
              }

              return next
            }

            runCycle()
            return next

          })

        }, selectedPattern.exhale * 1000)

      }, selectedPattern.hold * 1000)

    }, selectedPattern.inhale * 1000)

  }

  const resetSession = () => {

    setIsActive(false)
    setPhase("idle")
    setCurrentBreath(0)
    setShowReflection(false)

    if (timerRef.current) clearTimeout(timerRef.current)

    stopOm()
  }

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current)

      if (audioRef.current) {
        audioRef.current.pause()
      }

    }

  }, [])

  /* ---------------- UI HELPERS ---------------- */

  const scaleClass = {
    inhale: "scale-110",
    hold: "scale-110",
    exhale: "scale-90",
    idle: ""
  }

  return (

    <div className="flex flex-col items-center">

      {/* HEADER */}

      <div className="text-center mb-6">
        <h2 className="text-lg text-muted-foreground">
          Breathe with intention.
        </h2>

        <p className="text-sm text-muted-foreground">
          A guided breathing experience designed to reset your nervous system.
        </p>
      </div>

      {/* PATTERN SELECT */}

      <div className="flex gap-3 mb-6">

        {patterns.map((pattern, idx) => (

          <button
            key={idx}
            onClick={() => setSelectedPattern(pattern)}
            disabled={isActive}
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

      {/* BREATH COUNT */}

      <div className="flex items-center gap-3 mb-8">

        <button
          onClick={() => setBreathCount((p)=>Math.max(1,p-1))}
          disabled={isActive}
          className="w-8 h-8 border rounded-full"
        >
          -
        </button>

        <span>{breathCount} Breaths</span>

        <button
          onClick={() => setBreathCount((p)=>p+1)}
          disabled={isActive}
          className="w-8 h-8 border rounded-full"
        >
          +
        </button>

      </div>

      {/* BREATHING CIRCLE */}

      <div className="relative w-64 h-64 mb-6">

        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200/50 to-blue-200/50 transition-all duration-1000",
            scaleClass[phase]
          )}
        />

        <div
          className={cn(
            "absolute inset-4 rounded-full bg-gradient-to-br from-cyan-300/60 to-purple-200/40 transition-all duration-1000",
            scaleClass[phase]
          )}
        />

        {/* OM BUTTON */}

        <div className="absolute inset-0 flex items-center justify-center">

          <button
            onClick={toggleOmSound}
            className="text-5xl hover:scale-110 transition-transform"
          >
            ॐ
          </button>

        </div>

        {/* COUNTER */}

        <div className="absolute bottom-8 left-0 right-0 text-center">

          <p className="text-2xl font-semibold text-primary">
            {currentBreath} / {breathCount}
          </p>

          <p className="text-sm capitalize text-primary">
            {phase === "idle" ? "Ready" : phase}
          </p>

        </div>

        {/* SOUND INDICATOR */}

        {omPlaying && (

          <button
            onClick={toggleOmSound}
            className="absolute top-4 right-4 flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs"
          >

            <Volume2 className="h-3 w-3"/>
            OM Playing

          </button>

        )}

      </div>

      {/* START BUTTON */}

      {!showReflection && (

        <Button
          onClick={isActive ? resetSession : startSession}
          className="rounded-full px-8"
        >

          {isActive ? "Stop" : "Start session"}

        </Button>

      )}

      {showReflection && (
        <ReflectionPrompt onClose={resetSession}/>
      )}

    </div>
  )
}

/* ---------------- REFLECTION ---------------- */

function ReflectionPrompt({ onClose }: { onClose: ()=>void }) {

  const [showGita, setShowGita] = useState(false)

  return (

    <div className="max-w-2xl mx-auto w-full">

      {showGita ? (

        <>

          <DailyGitaWisdom onReflectionSubmit={()=>setShowGita(false)} />

          <button onClick={onClose} className="text-sm mt-4">
            Continue to home
          </button>

        </>

      ) : (

        <div className="bg-card rounded-2xl p-6 text-center">

          <h3 className="font-semibold mb-2">
            Session Complete
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Notice how your body feels.
          </p>

          <button
            onClick={()=>setShowGita(true)}
            className="w-full py-2 bg-primary text-white rounded-full mb-3"
          >
            Explore Gita Wisdom
          </button>

          <button onClick={onClose} className="text-sm">
            Skip for now
          </button>

        </div>

      )}

    </div>

  )
}
