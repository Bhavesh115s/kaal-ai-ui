"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  question: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "How would you describe your overall mood lately?",
    options: ["Generally positive", "Neutral", "Often low", "Very low"],
  },
  {
    id: 2,
    question: "How well have you been sleeping?",
    options: ["Very well", "Fairly well", "Poorly", "Hardly at all"],
  },
  {
    id: 3,
    question: "How often do you feel stressed?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 4,
    question: "How has your energy felt lately?",
    options: ["Energised and steady", "Mostly balanced", "Frequently exhausted", "Often drained"],
  },
  {
    id: 5,
    question: "How connected do you feel to others?",
    options: ["Very connected", "Somewhat connected", "Often isolated", "Completely disconnected"],
  },
  {
    id: 6,
    question: "How well can you focus on tasks?",
    options: ["Very well", "Fairly well", "Struggling", "Cannot focus at all"],
  },
  {
    id: 7,
    question: "How often do you feel anxious?",
    options: ["Rarely", "Sometimes", "Often", "Almost always"],
  },
  {
    id: 8,
    question: "How would you rate your self-care habits?",
    options: ["Excellent", "Good", "Fair", "Poor"],
  },
]

export function ReflectionAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const router = useRouter()

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleContinue = () => {
    if (!selectedOption) return

    setAnswers((prev) => ({ ...prev, [question.id]: selectedOption }))
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      // Calculate result and navigate
      const allAnswers = { ...answers, [question.id]: selectedOption }
      const result = calculateStressLevel(allAnswers)
      sessionStorage.setItem("reflectionResult", JSON.stringify({ 
        level: result.level, 
        score: result.score, 
        answers: allAnswers 
      }))
      router.push("/reflection/result")
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-center text-foreground mb-8">
        Assess Your Mental Clarity
      </h1>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-2" />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-card border-2 border-primary rounded-full"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl text-center text-muted-foreground mb-8">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              "w-full py-4 px-6 rounded-2xl text-center transition-all border-2",
              selectedOption === option
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="rounded-full px-8"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedOption}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
        >
          Continue
        </Button>
      </div>

      {/* Timer hint */}
      <div className="text-right mt-8">
        <span className="text-sm text-primary">10 mints</span>
      </div>
    </div>
  )
}

// Scoring: 1 = lowest stress, 4 = highest stress
// Example: Energized and steady = 1, Mostly balanced = 2, Frequently exhausted = 3, Often drained = 4
function calculateStressLevel(answers: Record<number, string>): { level: "Low" | "Moderate" | "High"; score: number } {
  let score = 0
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find((q) => q.id === parseInt(questionId))
    if (question) {
      // Option index + 1 gives us score 1-4
      const optionScore = question.options.indexOf(answer) + 1
      score += optionScore
    }
  })

  // Max possible score is questions.length * 4
  // Min possible score is questions.length * 1
  const maxScore = questions.length * 4
  const minScore = questions.length
  const range = maxScore - minScore
  const normalizedScore = ((score - minScore) / range) * 100

  let level: "Low" | "Moderate" | "High"
  if (normalizedScore < 33) {
    level = "Low"
  } else if (normalizedScore < 66) {
    level = "Moderate"
  } else {
    level = "High"
  }

  return { level, score }
}
