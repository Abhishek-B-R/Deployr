"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  GitBranch,
  Rocket,
} from "lucide-react"
import Header from "./NavBar"
import Hero from "./Hero"
import Features from "./Features"
import AdditionalFeatures from "./AdditionalFeatures"
import Footer from "./Footer"
import { SessionProvider } from "next-auth/react";

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen px-16 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <SessionProvider>
        <Header/>
      </SessionProvider>
      <Hero isVisible={isVisible}/>
      <Features/>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              How it Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Deploy in three simple steps</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your frontend project live in minutes with our streamlined deployment process.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Github className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Repository</h3>
              <p className="text-muted-foreground">
                Link your GitHub, GitLab, or Bitbucket repository containing your frontend project.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Configure Build</h3>
              <p className="text-muted-foreground">
                We detect your framework (React, Vue, Angular, etc.) and configure optimal build settings.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Deploy & Share</h3>
              <p className="text-muted-foreground">
                Your frontend goes live instantly with a custom URL ready to share with clients and users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AdditionalFeatures/>
      <Footer/>
    </div>
  )
}
