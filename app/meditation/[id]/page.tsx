"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

// Meditation data will be populated from backend API
// Placeholder for future backend integration
const meditationData: Record<string, { title: string; duration: number; image: string }> = {
  "breathing-calm": {
    title: "Breathing Calm",
    duration: 600, // 10 minutes in seconds
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
  },
}

export default function MeditationSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const meditation = meditationData[id] || {
    title: "Meditation Session",
    duration: 600,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= meditation.duration) {
            setIsPlaying(false)
            return meditation.duration
          }
          return prev + 1
        })
      }, 1000)

      // Breath cycle: inhale 4s, hold 4s, exhale 4s
      const breathCycle = () => {
        setBreathPhase("inhale")
        setTimeout(() => setBreathPhase("hold"), 4000)
        setTimeout(() => setBreathPhase("exhale"), 8000)
      }
      breathCycle()
      breathIntervalRef.current = setInterval(breathCycle, 12000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)
    }
  }, [isPlaying, meditation.duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentTime / meditation.duration) * 100

  const handleClose = () => {
    setIsPlaying(false)
    router.push("/meditation")
  }

  const handleSkipBack = () => {
    setCurrentTime((prev) => Math.max(0, prev - 30))
  }

  const handleSkipForward = () => {
    setCurrentTime((prev) => Math.min(meditation.duration, prev + 30))
  }

  return (
    <div className="fixed inset-0 bg-[#3a3a4a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1" />
        <div className="text-center">
          <h1 className="text-white font-medium">{meditation.title}</h1>
          <p className="text-white/60 text-sm">Choose an option</p>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Meditation image */}
        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden mb-8">
          <img
            src={meditation.image}
            alt="Meditation scene"
            className="w-full h-full object-cover"
          />
          
          {/* Breathing circle overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "rounded-full bg-white/20 backdrop-blur-sm transition-all duration-[4000ms] flex items-center justify-center",
                breathPhase === "inhale" && "w-32 h-32 scale-125",
                breathPhase === "hold" && "w-32 h-32 scale-125",
                breathPhase === "exhale" && "w-24 h-24 scale-100"
              )}
            >
              <span className="text-white text-sm font-medium capitalize">
                {isPlaying ? breathPhase : "Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mb-4">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(meditation.duration)}</span>
          </div>
          <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <button
            onClick={handleSkipBack}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="h-8 w-8" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={handleSkipForward}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  )
}
