"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuth } from "@/contexts/auth-context"
import { UserPreferenceModal } from "@/components/user-preference-modal"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
}

export function LoginModal({
  open,
  onOpenChange,
  title = "Save your conversation with KAAL",
  message = "Sign in to keep your chats and continue anytime.",
}: LoginModalProps) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const [showPreferenceModal, setShowPreferenceModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { loginWithEmail, preferences } = useAuth()

  /* ---------------- SAVE USER ---------------- */

  const saveUser = (userEmail: string, userName: string) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: userName,
        email: userEmail,
      })
    )
  }

  /* ---------------- SEND EMAIL ---------------- */

  const handleSendEmail = async () => {

    if (!name) {
      setError("Please enter your name")
      return
    }

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setError("")
    setIsLoading(true)

    try {

      saveUser(email, name)

      await loginWithEmail(email)

      setEmailSent(true)

    } catch (err) {

      setError("Failed to send login link")

    } finally {

      setIsLoading(false)

    }

  }

  /* ---------------- CLOSE ---------------- */

  const handleClose = () => {

    onOpenChange(false)

    setName("")
    setEmail("")
    setError("")
    setEmailSent(false)

  }

  /* ---------------- PREF MODAL ---------------- */

  const handlePreferenceModalClose = () => {
    setShowPreferenceModal(false)
    handleClose()
  }

  if (showPreferenceModal) {
    return (
      <UserPreferenceModal
        open={showPreferenceModal}
        onOpenChange={handlePreferenceModalClose}
      />
    )
  }

  /* ---------------- EMAIL SENT ---------------- */

  if (emailSent) {

    return (

      <Dialog open={open} onOpenChange={handleClose}>

        <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl">

          <DialogHeader className="text-center">

            <DialogTitle className="text-xl font-semibold">
              Check your email
            </DialogTitle>

          </DialogHeader>

          <div className="text-center py-4">

            <p className="text-muted-foreground mb-6">
              We sent you a secure login link.
            </p>

            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="rounded-full"
            >
              Resend Email
            </Button>

          </div>

        </DialogContent>

      </Dialog>

    )

  }

  /* ---------------- LOGIN FORM ---------------- */

  return (

    <Dialog open={open} onOpenChange={handleClose}>

      <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl">

        <DialogHeader className="text-center">

          <div className="flex justify-center mb-2">
            <span className="text-2xl">💬</span>
          </div>

          <DialogTitle className="text-xl font-semibold">
            {title}
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4 py-4">

          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-full"
          />

          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full"
          />

          {error && (
            <p className="text-xs text-destructive text-center">
              {error}
            </p>
          )}

          <Button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>

          <button
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Maybe later
          </button>

          <p className="text-xs text-muted-foreground text-center">
            You can keep chatting without signing in.
          </p>

        </div>

      </DialogContent>

    </Dialog>

  )
}
