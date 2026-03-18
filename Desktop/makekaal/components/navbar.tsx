"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, LogOut, User, Sparkles } from "lucide-react"
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

        {/* LEFT SIDE */}

        <div className="flex items-center gap-2">

          {showBackButton && !isHome ? (

            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>

          ) : (

            <Link href="/" className="flex items-center gap-2">
              <KaalLogo />
            </Link>

          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-2">

          {isLoggedIn && user ? (

            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <button className="flex items-center gap-2 outline-none">

                  <span className="text-sm text-muted-foreground">
                    Hi, {user.name}
                  </span>

                  <Avatar className="h-8 w-8 bg-muted cursor-pointer">
                    <AvatarFallback className="text-xs text-muted-foreground bg-muted">
                      {user.initial}
                    </AvatarFallback>
                  </Avatar>

                </button>

              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">

                {/* PROFILE */}

                <DropdownMenuItem asChild className="cursor-pointer">

                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>

                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* FEATURES */}

                <div className="px-2 py-1.5">

                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Features
                  </p>

                  <div className="space-y-1">

                    <DropdownMenuItem asChild className="cursor-pointer">

                      <Link
                        href="/meditation"
                        className="flex items-center text-sm"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        Meditation
                      </Link>

                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer">

                      <Link
                        href="/reflection"
                        className="flex items-center text-sm"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        Reflect & Connect
                      </Link>

                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer">

                      <Link
                        href="/events"
                        className="flex items-center text-sm"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        Events
                      </Link>

                    </DropdownMenuItem>

                  </div>

                </div>

                <DropdownMenuSeparator />

                {/* LOGOUT */}

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer"
                >
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

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  )
}

/* ---------------- LOGO ---------------- */

function KaalLogo() {

  return (

    <div className="flex items-center">

      <img
        src="/kaal-logo.png"
        alt="KAAL AI"
        className="h-6 w-auto rounded-sm"
      />

    </div>

  )

}
