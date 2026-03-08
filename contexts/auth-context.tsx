"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  name: string
  initial: string
  email?: string
}

interface UserPreferences {
  guidancePreference?: "gita" | "no-preference"
  preferenceSet?: boolean
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  preferences: UserPreferences
  login: (user: User) => void
  logout: () => void
  updateUserPreference: (preference: "gita" | "no-preference") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({})

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("kaal-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Check for stored preferences
    const storedPreferences = localStorage.getItem("kaal-preferences")
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences))
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("kaal-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("kaal-user")
  }

  const updateUserPreference = (preference: "gita" | "no-preference") => {
    const updatedPreferences = {
      guidancePreference: preference,
      preferenceSet: true,
    }
    setPreferences(updatedPreferences)
    localStorage.setItem("kaal-preferences", JSON.stringify(updatedPreferences))
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: !!user, 
        preferences,
        login, 
        logout,
        updateUserPreference,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
