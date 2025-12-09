'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.0,        // Speed of scroll (lower = faster, good for brutalism)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Snappy easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,   // Mouse wheel sensitivity
      touchMultiplier: 2,   // Touch sensitivity
      infinite: false,
    })

    // Animation loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}