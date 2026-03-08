"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Send, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"
import { WisdomCard } from "@/components/wisdom-card"
import { useAuth } from "@/contexts/auth-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sanskrit?: {
    text: string
    source: string
    translation: string
    insight: string
  }
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
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isLoggedIn } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setMessageCount((prev) => prev + 1)

    // Show login modal after a few messages (only if not logged in)
    if (messageCount >= 3 && !isLoggedIn) {
      setTimeout(() => setShowLoginModal(true), 1000)
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for sharing that with me. Remember, it's okay to feel this way. Would you like to explore some calming techniques together, or would you prefer to continue talking?",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div key={message.id}>
              <MessageBubble message={message} />
              {/* Show wisdom card after 4 messages */}
              {idx === 4 && (
                <div className="my-4">
                  <WisdomCard insight="Clarity often appears when the mind becomes still. In silence, we find what matters most." />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="max-w-2xl mx-auto">
          {/* Save chat button for non-logged in users */}
          {!isLoggedIn && messages.length > 3 && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full mb-3 py-2 px-4 bg-secondary rounded-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
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
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={handleSend}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            You can share as much or as little as you want.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center py-4 bg-background">
        <p className="text-xs text-muted-foreground">KAAL AI is not a doctor or therapist.</p>
        <p className="text-xs text-muted-foreground">It listens with care and may suggest professional help when needed.</p>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-muted text-foreground"
            : "bg-secondary text-foreground"
        )}
      >
        {message.content && (
          <p className="text-sm whitespace-pre-line leading-relaxed">
            {message.content}
          </p>
        )}
        {message.sanskrit && (
          <div className="space-y-3">
            <p className="text-sm italic text-muted-foreground whitespace-pre-line">
              {message.sanskrit.text}
            </p>
            <p className="text-xs text-muted-foreground">
              {message.sanskrit.source}
            </p>
            <p className="text-sm text-foreground">
              {message.sanskrit.translation}
            </p>
            <p className="text-sm font-medium text-foreground">
              {message.sanskrit.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
