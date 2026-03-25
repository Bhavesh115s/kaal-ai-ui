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
    id: "init",
    role: "assistant",
    content:
      "I'm KAAL. This is a space to pause and reflect. What has been on your mind lately?",
  },
]

export function ChatInterface() {

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isLoggedIn, user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {

    const openChat = localStorage.getItem("kaal_open_chat")

    if (openChat) {

      const chat = JSON.parse(openChat)

      localStorage.setItem("kaal_active_chat", chat.id)

      setMessages([
        {
          id: crypto.randomUUID(),
          role: "user",
          content: chat.title,
        },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: chat.preview,
        },
      ])

      localStorage.removeItem("kaal_open_chat")

    } else {

      localStorage.removeItem("kaal_active_chat")
      setMessages(initialMessages)

    }

  }, [])

  const saveChatLocal = (chat: any) => {

    let chats = JSON.parse(
      localStorage.getItem("kaal_saved_chats") || "[]"
    )

    let activeChatId = localStorage.getItem("kaal_active_chat")

    if (!activeChatId) {

      activeChatId = crypto.randomUUID()

      localStorage.setItem("kaal_active_chat", activeChatId)

      chats.unshift({
        id: activeChatId,
        title: chat.title,
        preview: chat.preview,
        timestamp: chat.timestamp,
      })

    } else {

      chats = chats.map((c: any) => {

        if (c.id === activeChatId) {
          return {
            ...c,
            preview: chat.preview,
            timestamp: chat.timestamp,
          }
        }

        return c
      })
    }

    chats = chats.slice(0,4)

    localStorage.setItem(
      "kaal_saved_chats",
      JSON.stringify(chats)
    )
  }

  const startRecording = async () => {

    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }

    mediaRecorder.onstop = async () => {

      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })

      const response = await fetch("/api/stt", {
        method: "POST",
        body: blob,
      })

      const data = await response.json()

      if (data.text) {
        setInput(data.text)
      }
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const handleSend = async () => {

    if (!input.trim() || isWaitingResponse) return

    const text = input

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setMessageCount((prev) => prev + 1)
    setIsWaitingResponse(true)

    if (messageCount >= 1 && messageCount < 2 && !isLoggedIn) {
      setTimeout(() => setShowLoginModal(true), 1000)
    }

    const loadingId = crypto.randomUUID()

    const loadingMessage: Message = {
      id: loadingId,
      role: "assistant",
      content: "",
      isLoading: true,
    }

    setMessages((prev) => [...prev, loadingMessage])

    try {

      let sessionId = localStorage.getItem("kaal_session")

      if (!sessionId) {
        sessionId = crypto.randomUUID()
        localStorage.setItem("kaal_session", sessionId)
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-name": user?.name || "",
          "x-user-email": user?.email || "",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
        }),
      })

      const data = await response.json()

      const reply = data.reply || "KAAL couldn't respond right now."

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                id: crypto.randomUUID(),
                role: "assistant",
                content: reply,
              }
            : msg
        )
      )

      setIsWaitingResponse(false)

      saveChatLocal({
        title: text.slice(0,40),
        preview: reply.slice(0,80),
        timestamp: new Date().toISOString(),
      })

    } catch (error) {

      console.error("Chat error:", error)

      setIsWaitingResponse(false)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "⚠️ Server error. Please try again.",
              }
            : msg
        )
      )
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto px-3 py-6">

        <div className="w-full max-w-2xl mx-auto space-y-6">

          {messages.map((message, idx) => (
            <div key={message.id}>

              <MessageBubble message={message} />

              {idx === 4 && (
                <div className="my-6">
                  <WisdomCard insight="Clarity often appears when the mind becomes still. In silence, we find what matters most." />
                </div>
              )}

            </div>
          ))}

          <div ref={messagesEndRef} />

        </div>

      </div>

      <div className="border-t border-border bg-background p-3">

        <div className="w-full max-w-2xl mx-auto">

          {!isLoggedIn && messages.length > 3 && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full mb-3 py-2 px-3 bg-secondary rounded-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save chat to continue later
            </button>
          )}

          <div className="flex items-center gap-2 bg-card rounded-full border border-border px-3 py-2">

         <input
         type="text"
          value={input}
         onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
           e.preventDefault()
           handleSend() 
           }
            }}
             placeholder="Share what's on your mind..."
           className="flex-1 bg-transparent text-sm outline-none"
           />

            <button
              onClick={startRecording}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isRecording && "text-red-500"
              )}
            >
              <Mic className="h-5 w-5" />
            </button>

            <button
              onClick={handleSend}
              disabled={isWaitingResponse}
              className={cn(
                "text-primary",
                isWaitingResponse && "opacity-40 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>

          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            You can share as much or as little as you want.
          </p>

        </div>

      </div>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          KAAL AI is not a doctor or therapist.
        </p>
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
        <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-secondary shadow-sm">
          <span className="text-sm text-muted-foreground flex gap-1">
            KAAL is thinking
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span>
        </div>
      </div>
    )
  }

  return (

    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[65%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-muted text-foreground"
            : "bg-secondary text-foreground"
        )}
      >

        {!isUser && (
         <p className="text-[8px] font-medium tracking-wider text-muted-foreground/70 mb-1">
        
         </p>

        )}

        <p className="text-sm whitespace-pre-line leading-relaxed">
          {message.content}
        </p>

      </div>

    </div>

  )
}
