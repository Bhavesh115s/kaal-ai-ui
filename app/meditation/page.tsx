import { Navbar } from "@/components/navbar"
import { BreathingExercise } from "@/components/breathing-exercise"
import { MeditationCards } from "@/components/meditation-cards"

export default function MeditationPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar showBackButton />
      
      <div className="flex-1 flex flex-col">
        {/* Breathing Exercise Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-secondary/30">
          <BreathingExercise />
        </section>
        
        {/* Guided Meditation Cards */}
        <MeditationCards />
      </div>
    </main>
  )
}
