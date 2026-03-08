"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface GitaVerse {
  id: string
  chapterVerse: string
  sanskrit: string
  translation: string
  meaning: string
  reflection: string
}

// Sample Gita verses - in production, these would come from an API
const gitaVersesPool: GitaVerse[] = [
  {
    id: "1",
    chapterVerse: "Chapter 2, Verse 47",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of your actions.",
    meaning: "Focus on doing your duty without being attached to the results. This teaches detachment from outcomes while maintaining commitment to action.",
    reflection: "What expectation might be creating pressure in your life today?",
  },
  {
    id: "2",
    chapterVerse: "Chapter 6, Verse 6",
    sanskrit: "बन्धुरात्मात्मनस्तस्य येनात्मैव आत्मना जितः।",
    translation: "For those who have conquered the mind, it is the best of friends; but for those who have failed to do so, the mind works as the greatest enemy.",
    meaning: "The mind is your greatest ally when controlled, but your worst enemy when left uncontrolled. Mental discipline is key to peace.",
    reflection: "How can you befriend your mind today instead of fighting it?",
  },
  {
    id: "3",
    chapterVerse: "Chapter 5, Verse 20",
    sanskrit: "लभन्ते ब्रह्मनिर्वाणं ऋषयः क्षीणकल्मषाः।",
    translation: "Those who achieve liberation attain peace in this life and beyond.",
    meaning: "True liberation comes from freeing yourself from attachment, fear, and negativity. This inner freedom is available to you now.",
    reflection: "What belief or attachment could you let go of today?",
  },
  {
    id: "4",
    chapterVerse: "Chapter 13, Verse 6",
    sanskrit: "अनन्यश्चिन्तयन्तो मां ये जनाः पर्युपासते।",
    translation: "Those who concentrate the mind on Me and engage in My devotional service, believing that I am the Supreme personality, are certainly the best yogis.",
    meaning: "Peace comes from finding one point of focus and dedicating yourself to it with complete attention and care.",
    reflection: "What deserves your complete, undivided attention today?",
  },
  {
    id: "5",
    chapterVerse: "Chapter 2, Verse 38",
    sanskrit: "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।",
    translation: "Treating pleasure and pain, loss and gain, victory and defeat as the same, engage in battle.",
    meaning: "Equanimity is the path to peace. When you can observe life's ups and downs with equal calmness, you find lasting contentment.",
    reflection: "Where in your life can you practice more acceptance and less resistance?",
  },
]

interface DailyGitaWisdomProps {
  onReflectionSubmit?: (reflection: string) => void
}

export function DailyGitaWisdom({ onReflectionSubmit }: DailyGitaWisdomProps) {
  const [verse, setVerse] = useState<GitaVerse | null>(null)
  const [showReflection, setShowReflection] = useState(false)
  const [reflectionAnswer, setReflectionAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        // Try to fetch from API
        const response = await fetch("/api/gita/daily-verse")
        if (response.ok) {
          const data = await response.json()
          setVerse(data)
        } else {
          // Fallback to random verse from pool
          const randomVerse = gitaVersesPool[Math.floor(Math.random() * gitaVersesPool.length)]
          setVerse(randomVerse)
        }
      } catch (error) {
        console.log("[v0] Failed to fetch Gita verse:", error)
        // Use random verse from pool
        const randomVerse = gitaVersesPool[Math.floor(Math.random() * gitaVersesPool.length)]
        setVerse(randomVerse)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVerse()
  }, [])

  const handleReflectionSubmit = () => {
    if (reflectionAnswer.trim()) {
      onReflectionSubmit?.(reflectionAnswer)
      setReflectionAnswer("")
      setShowReflection(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-card border border-border rounded-2xl w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading daily wisdom...</p>
        </CardContent>
      </Card>
    )
  }

  if (!verse) {
    return null
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Card className="bg-gradient-to-br from-secondary/40 to-secondary/20 border border-secondary/50 rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary/70" />
            <h3 className="text-sm font-semibold text-primary/70 uppercase tracking-wide">
              Daily Gita Insight
            </h3>
          </div>

          {/* Verse Section */}
          <div className="mb-8">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">
              {verse.chapterVerse}
            </p>
            
            {/* Sanskrit */}
            <p className="text-lg italic text-foreground/80 mb-6 leading-relaxed font-serif">
              "{verse.sanskrit}"
            </p>

            {/* Translation */}
            <div className="space-y-2 mb-6 pl-4 border-l-2 border-primary/50">
              <p className="text-sm font-medium text-primary/80">Translation:</p>
              <p className="text-sm text-foreground leading-relaxed">
                "{verse.translation}"
              </p>
            </div>

            {/* Meaning */}
            <div className="space-y-2 bg-primary/5 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-foreground">Meaning:</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {verse.meaning}
              </p>
            </div>

            {/* Reflection Question */}
            <div className="bg-muted/40 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-2">Reflect:</p>
              <p className="text-sm text-foreground/80 italic">
                "{verse.reflection}"
              </p>
            </div>
          </div>

          {/* Reflection Input */}
          {showReflection ? (
            <div className="space-y-4 mt-6 pt-6 border-t border-border">
              <textarea
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Share your thoughts on the reflection..."
                className="w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowReflection(false)
                    setReflectionAnswer("")
                  }}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip
                </button>
                <Button
                  onClick={handleReflectionSubmit}
                  disabled={!reflectionAnswer.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                >
                  Save Reflection
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => setShowReflection(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                Answer the Reflection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
