"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { PixelButton } from "@/components/ui/pixel-primitives"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => setTheme(theme === "light" ? "dark" : "light")

  if (!mounted) {
    return (
      <PixelButton variant="icon" size="square" type="button" className="normal-case tracking-normal">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </PixelButton>
    )
  }

  return (
    <PixelButton
      variant="icon"
      size="square"
      type="button"
      className="relative normal-case tracking-normal"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </PixelButton>
  )
}
