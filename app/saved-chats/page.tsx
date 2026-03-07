"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function SavedChatsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar showBackButton={true} />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl bg-secondary/50 border-0 shadow-none">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-2">
                No saved conversations yet
              </h1>
              <p className="text-muted-foreground">
                Start a conversation with KAAL AI and save it to continue later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
