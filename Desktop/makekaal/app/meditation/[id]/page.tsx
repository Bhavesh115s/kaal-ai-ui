"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { X, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const meditationData: Record<
  string,
  { title: string; duration: number; image: string; sound: string }
> = {
  "breathing-calm": {
    title: "Breathing Calm",
    duration: 600,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
    sound: "/sounds/breathing.mp3",
  },

  "morning-energy": {
    title: "Morning Energy",
    duration: 480,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
    sound: "/sounds/morning.mp3",
  },

  "stress-relief": {
    title: "Stress Relief",
    duration: 720,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
    sound: "/sounds/stress.mp3",
  },

  "deep-calm": {
    title: "Deep Calm",
    duration: 264,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Overlay-snEUdoXf4yVuOGf3SLyji0CwsmuTqd.png",
    sound: "/sounds/deep.mp3",
  },
}

export default function MeditationSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()

  const meditation = meditationData[id] || meditationData["breathing-calm"]

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [breathPhase, setBreathPhase] =
    useState<"inhale" | "hold" | "exhale">("inhale")

  const [tracked, setTracked] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const omRef = useRef<HTMLAudioElement | null>(null)

  /* ---------------- TRACK MEDITATION ---------------- */

  const trackMeditation = async () => {
    try {

      await fetch("/api/meditation", {
        headers: {
          "x-user-name": user?.name || "",
          "x-user-email": user?.email || "",
        },
      })

      setTracked(true)

    } catch (error) {
      console.error("Meditation tracking failed", error)
    }
  }

  /* ---------------- LOAD AUDIO ---------------- */

  useEffect(() => {
    audioRef.current = new Audio(meditation.sound)
    audioRef.current.loop = true
    audioRef.current.volume = 0.45

    omRef.current = new Audio("/sounds/om.mp3")
    omRef.current.volume = 0.6

    return () => {
      audioRef.current?.pause()
      omRef.current?.pause()
    }
  }, [meditation.sound])

  /* ---------------- TIMER + BREATHING ---------------- */

  useEffect(() => {
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= meditation.duration) {
          setIsPlaying(false)
          return meditation.duration
        }
        return prev + 1
      })
    }, 1000)

    const breathCycle = () => {
      setBreathPhase("inhale")

      if (id === "breathing-calm" && omRef.current) {
        omRef.current.currentTime = 0
        omRef.current.play().catch(() => {})
      }

      setTimeout(() => setBreathPhase("hold"), 4000)
      setTimeout(() => setBreathPhase("exhale"), 8000)
    }

    breathCycle()

    breathIntervalRef.current = setInterval(breathCycle, 12000)

    return () => {
      clearInterval(intervalRef.current!)
      clearInterval(breathIntervalRef.current!)
    }
  }, [isPlaying, meditation.duration, id])

  const progress = (currentTime / meditation.duration) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  /* ---------------- PLAY / PAUSE ---------------- */

  const togglePlay = () => {

    if (!audioRef.current) return

    if (!isPlaying) {

      if (!tracked) {
        trackMeditation()
      }

      audioRef.current.play().catch(() => {})

    } else {

      audioRef.current.pause()

    }

    setIsPlaying(!isPlaying)
  }

  const handleClose = () => {
    audioRef.current?.pause()
    omRef.current?.pause()
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
      <div className="flex items-center justify-between px-6 py-4">

        <div className="flex-1" />

        <div className="text-center">
          <h1 className="text-white font-medium">{meditation.title}</h1>
          <p className="text-white/60 text-sm">Choose an option</p>
        </div>

        <div className="flex-1 flex justify-end">
          <button onClick={handleClose} className="text-white/80 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">

        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden mb-8">

          <img src={meditation.image} className="w-full h-full object-cover" />

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

        <div className="flex items-center justify-center gap-8 mt-4">

          <button onClick={handleSkipBack} className="text-white/60 hover:text-white">
            <SkipBack className="h-8 w-8" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >

            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}

          </button>

          <button onClick={handleSkipForward} className="text-white/60 hover:text-white">
            <SkipForward className="h-8 w-8" />
          </button>

        </div>

      </div>
    </div>
  )
}