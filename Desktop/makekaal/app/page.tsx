"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { FeatureCards } from "@/components/feature-cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  const handleStartConversation = () => {
    router.push("/chat")
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-xl bg-secondary/50 border-0 shadow-none">
            <CardContent className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center text-foreground mb-4">
                Talk with KAAL AI
              </h1>
              <p className="text-center text-muted-foreground mb-8 text-lg leading-relaxed">
                A quiet space to share your thoughts and find clarity.
              </p>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleStartConversation}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base"
                >
                  Start Conversation
                </Button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  KAAL AI is not a doctor or therapist.
                </p>
                <p className="text-xs text-muted-foreground">
                  It listens with care and may suggest professional help when needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Feature Cards Section */}
        <FeatureCards />
      </div>
    </main>
  )
}
