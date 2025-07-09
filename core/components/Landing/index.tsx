"use client"

import { useState, useEffect } from "react"
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
    <div className="min-h-screen w-full md:w-[98%] md:pl-40 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <NavBar/>
      <Hero isVisible={isVisible}/>
      <Features/>
      <HowItWorks/>
      <AdditionalFeatures/>
      <Footer/>
    </div>
  )
}