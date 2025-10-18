"use client";

import { motion } from "framer-motion";
import {
  PixelButton,
  PixelCard,
  PixelCardHeader,
  PixelCardTitle,
  PixelCardContent,
  RetroBadge,
  PixelProgress,
  PixelContainer,
  PixelIcon,
} from "@/components/ui/pixel";

export default function PixelShowcase() {
  return (
    <section className="py-20 w-full">
      <PixelContainer variant="dots" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-pixel text-sm mb-4 flex items-center justify-center gap-3">
              <PixelIcon name="star" size={32} className="text-[var(--pixel-yellow)]" />
              8-Bit Components
              <PixelIcon name="star" size={32} className="text-[var(--pixel-yellow)]" />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Retro-styled UI components with authentic pixel art aesthetics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <PixelCard className="h-full">
                <PixelCardHeader>
                  <PixelCardTitle className="flex items-center gap-2">
                    <PixelIcon name="heart" size={20} className="text-[var(--pixel-red)]" />
                    Buttons
                  </PixelCardTitle>
                </PixelCardHeader>
                <PixelCardContent className="space-y-3 pt-6">
                  <PixelButton className="w-full" variant="default">
                    Default
                  </PixelButton>
                  <PixelButton className="w-full" variant="yellow">
                    Warning
                  </PixelButton>
                  <PixelButton className="w-full" variant="red">
                    Danger
                  </PixelButton>
                  <PixelButton className="w-full" variant="blue">
                    Info
                  </PixelButton>
                </PixelCardContent>
              </PixelCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <PixelCard className="h-full">
                <PixelCardHeader>
                  <PixelCardTitle className="flex items-center gap-2">
                    <PixelIcon name="sparkle" size={20} className="text-[var(--pixel-blue)]" />
                    Badges
                  </PixelCardTitle>
                </PixelCardHeader>
                <PixelCardContent className="space-y-3 pt-6">
                  <div className="flex flex-wrap gap-2">
                    <RetroBadge variant="default">NEW</RetroBadge>
                    <RetroBadge variant="yellow">BETA</RetroBadge>
                    <RetroBadge variant="red">HOT</RetroBadge>
                    <RetroBadge variant="blue">INFO</RetroBadge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RetroBadge variant="outline">OUTLINE</RetroBadge>
                    <RetroBadge variant="ghost">GHOST</RetroBadge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RetroBadge size="sm" variant="default">Small</RetroBadge>
                    <RetroBadge size="lg" variant="yellow">Large</RetroBadge>
                  </div>
                </PixelCardContent>
              </PixelCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <PixelCard className="h-full">
                <PixelCardHeader>
                  <PixelCardTitle className="flex items-center gap-2">
                    <PixelIcon name="coin" size={20} className="text-[var(--pixel-yellow)]" />
                    Progress
                  </PixelCardTitle>
                </PixelCardHeader>
                <PixelCardContent className="space-y-4 pt-6">
                  <div>
                    <div className="text-xs font-pixel mb-2 flex justify-between">
                      <span>HEALTH</span>
                      <span>75/100</span>
                    </div>
                    <PixelProgress value={75} max={100} variant="default" />
                  </div>
                  <div>
                    <div className="text-xs font-pixel mb-2 flex justify-between">
                      <span>MANA</span>
                      <span>50/100</span>
                    </div>
                    <PixelProgress value={50} max={100} variant="blue" />
                  </div>
                  <div>
                    <div className="text-xs font-pixel mb-2 flex justify-between">
                      <span>XP</span>
                      <span>90/100</span>
                    </div>
                    <PixelProgress value={90} max={100} variant="yellow" />
                  </div>
                </PixelCardContent>
              </PixelCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <PixelCard>
                <PixelCardHeader>
                  <PixelCardTitle className="flex items-center gap-2">
                    <PixelIcon name="block" size={20} className="text-[var(--pixel-green)]" />
                    Features
                  </PixelCardTitle>
                </PixelCardHeader>
                <PixelCardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="font-pixel text-xs text-[var(--pixel-green)]">
                        PIXEL PERFECT
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Authentic 8-bit aesthetics with modern web standards
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-pixel text-xs text-[var(--pixel-blue)]">
                        DARK MODE
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatic theme adaptation with proper contrast
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-pixel text-xs text-[var(--pixel-yellow)]">
                        ACCESSIBLE
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Built on Shadcn UI with full ARIA support
                      </p>
                    </div>
                  </div>
                </PixelCardContent>
              </PixelCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="font-pixel text-xs text-muted-foreground mb-6">
              READY TO START YOUR ADVENTURE?
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PixelButton size="lg" variant="default">
                GET STARTED
              </PixelButton>
            </motion.div>
          </motion.div>
        </div>
      </PixelContainer>
    </section>
  );
}
