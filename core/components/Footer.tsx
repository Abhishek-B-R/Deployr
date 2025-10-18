"use client"

import { LinkedinIcon, Rocket } from "lucide-react"

import PixelSprite from "@/components/PixelSprite"
import { PixelButton, PixelPanel, PixelTag } from "@/components/ui/pixel-primitives"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t-[4px] border-[#09031a] bg-[#120822] text-[#f6ecff]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,225,125,0.05)_1px,transparent_1px),linear-gradient(rgba(255,225,125,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-60"
      />
      <div className="container relative z-10 space-y-10 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <PixelPanel tone="accent" padding="xs" pattern={false} className="flex h-12 w-12 items-center justify-center">
              <Rocket className="h-7 w-7 text-[#23173f]" />
            </PixelPanel>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-[0.35em] text-[#ffe17d]">Deployr</h3>
              <PixelTag tone="midnight" className="bg-[#291f4a] px-2 py-[2px] text-[9px] tracking-[0.3em] text-[#ffe17d]">
                Pixel Ops Studio
              </PixelTag>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PixelButton
              variant="icon"
              size="square"
              type="button"
              aria-label="Open LinkedIn profile"
              className="normal-case tracking-normal"
              onClick={() => {
                window.open("https://www.linkedin.com/in/abhishek-b-r-b232ba2a2/", "_blank", "noopener,noreferrer")
              }}
            >
              <LinkedinIcon className="h-5 w-5" />
            </PixelButton>
            <PixelButton
              variant="icon"
              size="square"
              type="button"
              aria-label="Open X profile"
              className="normal-case tracking-normal"
              onClick={() => {
                window.open("https://x.com/AbhiCodes01", "_blank", "noopener,noreferrer")
              }}
            >
              <PixelSprite src="/x.svg" alt="X logo" width={18} height={18} className="h-[18px] w-[18px]" />
            </PixelButton>
          </div>
        </div>

        <PixelPanel tone="ghost" padding="sm" className="space-y-4 text-[#1b1036] dark:text-[#f6ecff]">
          <div className="grid gap-3 text-[10px] font-black uppercase tracking-[0.28em] md:grid-cols-3">
            <div className="flex items-center justify-between">
              <span>Players online</span>
              <span>128</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Deployments saved</span>
              <span>2048</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pixel mode</span>
              <span>Enabled</span>
            </div>
          </div>
          <PixelTag tone="neutral" className="inline-flex px-3 py-[3px] text-[9px] tracking-[0.3em] text-[#1b1036]">
            Made with ❤️ for developers
          </PixelTag>
        </PixelPanel>

        <PixelPanel tone="ghost" padding="sm" className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#1b1036] dark:text-[#f6ecff] md:flex-row md:items-center md:justify-between">
          <span>© {year} Deployr · A side project by Abhishek BR</span>
          <span>Retro landing rebuild · v2.0</span>
        </PixelPanel>
      </div>
    </footer>
  )
}
