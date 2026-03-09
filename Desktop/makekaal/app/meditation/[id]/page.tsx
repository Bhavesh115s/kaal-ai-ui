"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MeditationSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params)
  const router = useRouter()

  const [meditation, setMeditation] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // FETCH MEDITATION DATA
  useEffect(() => {

    async function fetchMeditation() {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/meditation`
        )

        const data = await res.json()

        setMeditation(data)

      } catch (error) {

        console.error("Meditation fetch error:", error)

      }

    }

    fetchMeditation()

  }, [id])

  // TIMER
  useEffect(() => {

    if (!isPlaying || !meditation) return

    intervalRef.current = setInterval(() => {

      setCurrentTime((prev) => prev + 1)

    }, 1000)

    const breathCycle = () => {

      setBreathPhase("inhale")

      setTimeout(() => setBreathPhase("hold"), 4000)

      setTimeout(() => setBreathPhase("exhale"), 8000)

    }

    breathCycle()

    breathIntervalRef.current = setInterval(breathCycle, 12000)

    return () => {

      if (intervalRef.current) clearInterval(intervalRef.current)

      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)

    }

  }, [isPlaying, meditation])

  if (!meditation) {

    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading meditation...</p>
      </div>
    )

  }

  const formatTime = (seconds: number) => {

    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`

  }

  const progress = meditation.duration
    ? (currentTime / meditation.duration) * 100
    : 0

  const handleClose = () => {

    setIsPlaying(false)

    router.push("/meditation")

  }

  const handleSkipBack = () => {

    setCurrentTime((prev) => Math.max(0, prev - 30))

  }

  const handleSkipForward = () => {

    setCurrentTime((prev) => prev + 30)

  }

  return (

    <div className="fixed inset-0 bg-[#3a3a4a] flex flex-col">

      {/* HEADER */}

      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex-1" />

        <div className="text-center">
          <h1 className="text-white font-medium">
            Meditation Session
          </h1>
          <p className="text-white/60 text-sm">
            Follow the breathing rhythm
          </p>
        </div>

        <div className="flex-1 flex justify-end">
          <button onClick={handleClose}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col items-center justify-center px-4">

        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden mb-8">

          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png"
            alt="Meditation"
            className="w-full h-full object-cover"
          />

          {/* BREATHING CIRCLE */}

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

        {/* PROGRESS */}

        <div className="w-full max-w-2xl mb-4">

          <div className="flex justify-between text-sm text-white/60 mb-2">

            <span>{formatTime(currentTime)}</span>

            <span>{formatTime(meditation.duration || 600)}</span>

          </div>

          <div className="relative h-1 bg-white/20 rounded-full">

            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-500"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

        {/* CONTROLS */}

        <div className="flex items-center gap-8">

          <button onClick={handleSkipBack}>
            <SkipBack className="h-8 w-8 text-white/60" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"
          >

            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}

          </button>

          <button onClick={handleSkipForward}>
            <SkipForward className="h-8 w-8 text-white/60" />
          </button>

        </div>

      </div>

    </div>

  )

}