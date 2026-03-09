"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Send, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"
import { WisdomCard } from "@/components/wisdom-card"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi, I'm KAAL.\n\nTake a moment.\n\nWhat has been on your mind lately?",
  },
]

export function ChatInterface() {

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isLoggedIn } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const handleSend = async () => {

    if (!input.trim()) return

    const sessionId =
      localStorage.getItem("kaal_session") ||
      crypto.randomUUID()

    localStorage.setItem("kaal_session", sessionId)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      isLoading: true,
    }

    // 🔥 FIX: add both messages together
    setMessages((prev) => [...prev, userMessage, loadingMessage])

    setInput("")

    try {

      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "andai"
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: userMessage.content
    })
  }
)

      if (!res.ok) {
        throw new Error("API request failed")
      }

      const data = await res.json()

      setMessages((prev) => {

        const updated = [...prev]

        const lastIndex = updated.length - 1

        updated[lastIndex] = {
          ...updated[lastIndex],
          content: data.reply || "I'm here with you. Tell me more.",
          isLoading: false,
        }

        return updated

      })

    } catch (error) {

      console.error("Chat API error:", error)

      setMessages((prev) => {

        const updated = [...prev]

        const lastIndex = updated.length - 1

        updated[lastIndex] = {
          ...updated[lastIndex],
          content: "KAAL is currently unavailable.",
          isLoading: false,
        }

        return updated

      })

    }

  }


  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto px-4 py-6">

        <div className="max-w-2xl mx-auto space-y-4">

          {messages.map((message, idx) => (

            <div key={message.id}>

              <MessageBubble message={message} />

              {idx === 4 && (
                <WisdomCard insight="Clarity often appears when the mind becomes still. In silence, we find what matters most." />
              )}

            </div>

          ))}

          <div ref={messagesEndRef} />

        </div>

      </div>


      <div className="border-t border-border bg-background p-4">

        <div className="max-w-2xl mx-auto">

          {!isLoggedIn && messages.length > 3 && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full mb-3 py-2 px-4 bg-secondary rounded-full text-sm flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save chat to continue later
            </button>
          )}

          <div className="flex items-center gap-2 bg-card rounded-full border border-border px-4 py-2">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type here ..I am listening."
              className="flex-1 bg-transparent text-sm outline-none"
            />

            <button className="text-muted-foreground">
              <Mic className="h-5 w-5" />
            </button>

            <button
              onClick={handleSend}
              className="text-primary"
            >
              <Send className="h-5 w-5" />
            </button>

          </div>

        </div>

      </div>


      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="Would you like to save your conversations with KAAL?"
        message="Save your progress so you can continue later."
      />

    </div>
  )
}


function MessageBubble({ message }: { message: Message }) {

  const isUser = message.role === "user"

  if (message.isLoading) {

    return (

      <div className="flex justify-start">

        <div className="rounded-2xl px-4 py-3 bg-secondary">

          <span className="text-sm">KAAL is thinking...</span>

        </div>

      </div>

    )

  }

  return (

    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser ? "bg-muted" : "bg-secondary"
        )}
      >

        <p className="text-sm whitespace-pre-line">
          {message.content}
        </p>

      </div>

    </div>

  )

}