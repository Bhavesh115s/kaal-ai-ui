import { Navbar } from "@/components/navbar"
import { ReflectionAssessment } from "@/components/reflection-assessment"

export default function ReflectionPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar showBackButton />
      
      <div className="flex-1 flex items-center justify-center py-12">
        <ReflectionAssessment />
      </div>
    </main>
  )
}
