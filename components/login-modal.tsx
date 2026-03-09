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
  title = "Save this conversation",
  message = "Save your progress so you can continue our conversation later."
}: LoginModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [showPreferenceModal, setShowPreferenceModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { loginWithGoogle, loginWithEmail, preferences } = useAuth()

  const handleContinueWithGoogle = async () => {
    setIsLoading(true)
    setError("")
    try {
      await loginWithGoogle()
      // Show preference modal only if not already set
      if (!preferences.preferenceSet) {
        setShowPreferenceModal(true)
      } else {
        handleClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueWithEmail = () => {
    setShowEmailForm(true)
  }

  const handleSendEmail = async () => {
    if (!email) {
      setError("Please enter your email")
      return
    }
    
    setIsLoading(true)
    setError("")
    try {
      await loginWithEmail(email)
      setEmailSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send login link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setShowEmailForm(false)
    setEmailSent(false)
    setEmail("")
    setName("")
  }

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

  if (emailSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl" data-dialog-content>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold">Check your email</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-6">
              We sent you a secure login link.
            </p>
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="rounded-full"
            >
              Resend email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (showEmailForm) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl" data-dialog-content>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold">Continue with Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="rounded-full"
            />
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
            <Button
              onClick={handleSendEmail}
              disabled={!email || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
            <Button
              onClick={() => setShowEmailForm(false)}
              variant="outline"
              className="w-full rounded-full"
              disabled={isLoading}
            >
              Back
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We'll send you a login link via email.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl" data-dialog-content>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <span className="text-2xl">📁</span>
          </div>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-center py-2">
          <p className="text-muted-foreground mb-6">
            {message}
          </p>
          
          <div className="space-y-3">
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
            
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              onClick={handleContinueWithGoogle}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue with Google"}
            </Button>
            
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={handleContinueWithEmail}
              disabled={isLoading}
            >
              Continue with Email
            </Button>
            
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Maybe later
            </button>
            
            <p className="text-xs text-muted-foreground">
              You can continue chatting without signing in.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
