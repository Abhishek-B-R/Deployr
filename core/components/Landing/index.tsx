"use client"
import React, { useState, useEffect } from "react"
import Hero from "./Hero"
import Features from "./Features"
import AdditionalFeatures from "./AdditionalFeatures"
import Footer from "../Footer"
import NavBar from "../NavBar"
import HowItWorks from "./HowItWorks"

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

return (
    // Neo-Brutalist base background is usually an off-white/cream or a very light pastel.
    <div className="min-h-screen w-full bg-neo-bg overflow-x-hidden">
      <NavBar/>
      <main className="pt-20"> {/* Add padding for fixed navbar */}
        <Hero isVisible={isVisible}/>
        <Features/>
        <HowItWorks/>
        <AdditionalFeatures/>
      </main>
      <Footer/>
    </div>
  )
}