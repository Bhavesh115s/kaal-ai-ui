import { Navbar } from "@/components/navbar"
import { MoodSelector } from "@/components/mood-selector"
import { FeatureCards } from "@/components/feature-cards"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Mood Selection Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-12">
          <MoodSelector />
        </section>
        
        {/* Feature Cards Section */}
        <FeatureCards />
      </div>
    </main>
  )
}
