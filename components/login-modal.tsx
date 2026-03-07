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

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
}

export function LoginModal({ 
  open, 
  onOpenChange,
  title = "Save your conversation",
  message = "Would you like to save this conversation so you can come back later?"
}: LoginModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const { login } = useAuth()

  const handleContinueWithGoogle = () => {
    // Simulate Google login
    const userName = "User"
    login({ name: userName, initial: userName[0].toUpperCase(), email: "user@gmail.com" })
    handleClose()
  }

  const handleContinueWithEmail = () => {
    setShowEmailForm(true)
  }

  const handleSendEmail = () => {
    if (email && name) {
      // Simulate email login
      login({ name, initial: name[0].toUpperCase(), email })
      handleClose()
    } else if (email) {
      setEmailSent(true)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setShowEmailForm(false)
    setEmailSent(false)
    setEmail("")
    setName("")
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
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-full"
            />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full"
            />
            <Button
              onClick={handleSendEmail}
              disabled={!name || !email}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Continue
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Enter your details to continue.
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
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              onClick={handleContinueWithGoogle}
            >
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={handleContinueWithEmail}
            >
              Continue with Email
            </Button>
            
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              May be later
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
