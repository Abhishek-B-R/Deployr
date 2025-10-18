"use client"

import { useEffect, useState, useCallback } from "react"

export type PixelPreferences = {
  crt: boolean
  sfx: boolean
}

const STORAGE_KEY = "deployr:pixel-preferences"

function getInitial(): PixelPreferences {
  if (typeof window === "undefined") return { crt: false, sfx: false }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PixelPreferences>
      return {
        crt: Boolean(parsed.crt),
        sfx: Boolean(parsed.sfx),
      }
    }
  } catch (_) {}
  return { crt: false, sfx: false }
}

export function usePixelPreferences() {
  const [prefs, setPrefs] = useState<PixelPreferences>(getInitial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch (_) {}
  }, [prefs, hydrated])

  const setCRT = useCallback((crt: boolean) => setPrefs((p) => ({ ...p, crt })), [])
  const setSFX = useCallback((sfx: boolean) => setPrefs((p) => ({ ...p, sfx })), [])

  const toggleCRT = useCallback(() => setPrefs((p) => ({ ...p, crt: !p.crt })), [])
  const toggleSFX = useCallback(() => setPrefs((p) => ({ ...p, sfx: !p.sfx })), [])

  return { prefs, setPrefs, setCRT, setSFX, toggleCRT, toggleSFX, hydrated }
}
