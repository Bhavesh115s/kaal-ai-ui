"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, LogOut, User, MessageSquare, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  showBackButton?: boolean
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const { user, isLoggedIn, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && !isHome ? (
            <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <KaalLogo />
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 outline-none">
                  <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                  <Avatar className="h-8 w-8 bg-muted cursor-pointer">
                    <AvatarFallback className="text-xs text-muted-foreground bg-muted">
                      {user.initial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/saved-chats" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Saved Chats
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/" className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Features
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="text-sm text-foreground hover:opacity-70 transition-opacity"
            >
              Log in
            </button>
          )}
        </div>
      </header>
      
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}

function KaalLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#c4c4c4" strokeWidth="1.5" />
        <path d="M8 8L12 12M12 12L16 8M12 12V18" stroke="#c4c4c4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-lg font-medium tracking-[0.3em] text-[#c4c4c4]">KAAL</span>
    </div>
  )
}
