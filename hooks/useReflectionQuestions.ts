import { useState, useEffect } from "react"

export interface ReflectionQuestion {
  id: number
  question: string
  options: string[]
}

interface UseReflectionQuestionsReturn {
  questions: ReflectionQuestion[]
  loading: boolean
  error: string | null
  submitReflection: (answers: Record<number, string>) => Promise<any>
}

export function useReflectionQuestions(): UseReflectionQuestionsReturn {
  const [questions, setQuestions] = useState<ReflectionQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/reflection/questions")
        if (!response.ok) {
          throw new Error("Failed to fetch reflection questions")
        }

        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[Hook] Error fetching questions:", errorMessage)
        setError(errorMessage)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const submitReflection = async (answers: Record<number, string>) => {
    try {
      const response = await fetch("/api/reflection/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit reflection")
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[Hook] Error submitting reflection:", errorMessage)
      throw err
    }
  }

  return { questions, loading, error, submitReflection }
}
