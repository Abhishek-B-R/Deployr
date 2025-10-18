"use client"

import { useEffect, useState } from "react"

import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import Hero from "@/components/Landing/Hero"
import Features from "@/components/Landing/Features"
import HowItWorks from "@/components/Landing/HowItWorks"
import AdditionalFeatures from "@/components/Landing/AdditionalFeatures"

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#f4edff] text-[#1b1236] dark:bg-[#070212] dark:text-[#f6ecff]">
      <div className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,22,63,0.08)_1px,transparent_1px),linear-gradient(rgba(34,22,63,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70 dark:opacity-40"
        />
        <div className="relative z-10 pb-20">
          <NavBar />
          <main className="space-y-24 pt-10">
            <Hero isVisible={isVisible} />
            <Features />
            <HowItWorks />
            <AdditionalFeatures />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
