"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SessionProvider, signIn, useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  GithubIcon,
  Menu,
  Rocket,
  Settings,
  X,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PixelButton, PixelPanel, PixelTag } from "@/components/ui/pixel-primitives"
import { ThemeToggle } from "@/components/theme-toggle"

function Header() {
  const session = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((token) => token[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)

  const handleNavigation = (href: string) => {
    router.push(href)
    closeMobileMenu()
  }

  const dropdownItemClass =
    "cursor-pointer border-[2px] border-transparent px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1b1036] transition-colors hover:border-[#1b1036] hover:bg-[#ffe17d] focus:bg-[#ffe17d] focus:border-[#1b1036] dark:text-[#f6ecff] dark:hover:border-[#f6ecff] dark:hover:bg-[#291f4a] dark:focus:bg-[#291f4a]"

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 border-b-[4px] border-[#09031a] bg-[#13082a]/95 text-[#f6ecff] backdrop-blur"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,225,125,0.05)_1px,transparent_1px),linear-gradient(rgba(255,225,125,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-60"
        />
        <div className="container relative flex h-20 items-center justify-between px-4 md:px-6">
          <motion.button
            type="button"
            className="group flex cursor-pointer items-center gap-4 text-left focus:outline-none"
            onClick={() => {
              router.push("/")
              closeMobileMenu()
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <PixelPanel
              tone="accent"
              padding="xs"
              pattern={false}
              className="flex h-12 w-12 items-center justify-center transition-transform duration-150 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0_0_rgba(35,23,63,0.7)]"
            >
              <Rocket className="h-6 w-6 text-[#1f1338]" />
            </PixelPanel>
            <div className="flex flex-col items-start leading-[1.1]">
              <span className="text-xl font-black uppercase tracking-[0.55em] text-[#ffe17d] md:text-2xl">
                Deployr
              </span>
              <PixelTag
                tone="neutral"
                className="mt-1 px-2 py-[3px] text-[9px] tracking-[0.3em] text-[#1f1338] shadow-[2px_2px_0_0_rgba(35,23,63,0.35)]"
              >
                Pixel Command
              </PixelTag>
            </div>
          </motion.button>

          <div className="hidden items-center gap-4 md:flex lg:gap-6">
            <PixelButton
              variant="secondary"
              size="sm"
              type="button"
              className="normal-case tracking-[0.2em]"
              onClick={() => router.push("/projects")}
            >
              Dashboard
            </PixelButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PixelButton
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="normal-case tracking-[0.2em]"
                >
                  Add New
                  <ChevronDown className="h-4 w-4" />
                </PixelButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={10}
                className="z-50 mt-2 min-w-[220px] rounded-none border-[3px] border-[#1b1036] bg-[#f8ecff] p-2 shadow-[6px_6px_0_0_rgba(27,16,54,0.6)] dark:border-[#7b6aff]/70 dark:bg-[#1a1330]"
              >
                <DropdownMenuItem
                  className={dropdownItemClass}
                  onSelect={(event) => {
                    event.preventDefault()
                    router.push("/new")
                  }}
                >
                  Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={dropdownItemClass}
                  onSelect={(event) => {
                    event.preventDefault()
                    window.open("https://github.com/new", "_blank", "noopener,noreferrer")
                  }}
                >
                  Repository
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 border border-dashed border-[#1b1036]/40" />
                <DropdownMenuItem
                  className={dropdownItemClass}
                  onSelect={(event) => {
                    event.preventDefault()
                    router.push("/new")
                  }}
                >
                  Quick Deploy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <PixelButton
              variant="icon"
              size="square"
              type="button"
              className="normal-case tracking-normal"
              onClick={() => {
                window.open("https://www.github.com/Abhishek-B-R/Deployr", "_blank", "noopener,noreferrer")
              }}
            >
              <GithubIcon className="h-5 w-5" />
            </PixelButton>

            {session.status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="group relative rounded-none focus:outline-none">
                    <PixelPanel
                      tone="ghost"
                      padding="xs"
                      pattern={false}
                      className="flex h-12 w-12 items-center justify-center transition-transform duration-150 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0_0_rgba(34,21,56,0.25)]"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.data?.user?.image ?? ""} alt={session.data?.user?.name ?? ""} />
                        <AvatarFallback>
                          {getInitials(session.data?.user?.name ?? session.data?.user?.email ?? "U")}
                        </AvatarFallback>
                      </Avatar>
                    </PixelPanel>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="z-50 min-w-[220px] rounded-none border-[3px] border-[#1b1036] bg-[#f6ecff] p-3 shadow-[6px_6px_0_0_rgba(27,16,54,0.5)] dark:border-[#7b6aff]/70 dark:bg-[#1a1330]"
                >
                  <div className="mb-2 space-y-1 text-xs uppercase tracking-[0.3em] text-[#1b1036] dark:text-[#f6ecff]">
                    <p className="font-bold">
                      {session.data?.user?.name ?? "Player One"}
                    </p>
                    {session.data?.user?.email ? <p className="truncate text-[9px] tracking-[0.28em]">{session.data.user.email}</p> : null}
                  </div>
                  <DropdownMenuSeparator className="my-2 border border-dashed border-[#1b1036]/40 dark:border-[#7b6aff]/40" />
                  <DropdownMenuItem asChild className={dropdownItemClass}>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 border border-dashed border-[#1b1036]/40 dark:border-[#7b6aff]/40" />
                  <DropdownMenuItem
                    className={dropdownItemClass}
                    onSelect={(event) => {
                      event.preventDefault()
                      router.push("/api/auth/signout")
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <PixelButton
                variant="ghost"
                size="sm"
                type="button"
                className="normal-case tracking-[0.2em]"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </PixelButton>
            )}
          </div>

          <PixelButton
            variant="ghost"
            size="square"
            type="button"
            className="md:hidden normal-case tracking-normal"
            onClick={toggleMobileMenu}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMobileMenuOpen ? "close" : "menu"}
                initial={{ rotate: isMobileMenuOpen ? -90 : 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: isMobileMenuOpen ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </PixelButton>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#080318]/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-24 left-4 right-4 z-50 md:hidden"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <PixelPanel tone="ghost" padding="sm" className="space-y-5">
                <PixelTag tone="info" className="px-3 py-[3px] text-[9px] tracking-[0.3em]">
                  Mission Control
                </PixelTag>
                <nav className="space-y-4">
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    type="button"
                    className="w-full justify-between normal-case tracking-[0.2em]"
                    onClick={() => handleNavigation("/projects")}
                  >
                    Dashboard
                  </PixelButton>
                  <div className="grid gap-2">
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="w-full justify-between normal-case tracking-[0.2em]"
                      onClick={() => handleNavigation("/new")}
                    >
                      Project
                    </PixelButton>
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="w-full justify-between normal-case tracking-[0.2em]"
                      onClick={() => {
                        window.open("https://github.com/new", "_blank", "noopener,noreferrer")
                        closeMobileMenu()
                      }}
                    >
                      Repository
                    </PixelButton>
                  </div>
                  <div className="flex items-center justify-between rounded-none border-[2px] border-dashed border-[#1b1036]/40 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#1b1036] dark:border-[#7b6aff]/40 dark:text-[#f6ecff]">
                    <span>Theme</span>
                    <ThemeToggle />
                  </div>
                  <PixelButton
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="w-full justify-between normal-case tracking-[0.2em]"
                    onClick={() => {
                      window.open("https://www.github.com/Abhishek-B-R/Deployr", "_blank", "noopener,noreferrer")
                      closeMobileMenu()
                    }}
                  >
                    View Source
                  </PixelButton>
                </nav>

                <PixelPanel tone="terminal" padding="sm" pattern={false} className="space-y-3">
                  {session.status === "authenticated" ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-[#91f6d3]">
                          <AvatarImage src={session.data?.user?.image ?? ""} alt={session.data?.user?.name ?? ""} />
                          <AvatarFallback>
                            {getInitials(session.data?.user?.name ?? session.data?.user?.email ?? "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#0f2d2d]">
                            {session.data?.user?.name ?? "Pilot"}
                          </p>
                          {session.data?.user?.email ? (
                            <p className="text-[9px] uppercase tracking-[0.28em] text-[#0f2d2d]/80">
                              {session.data.user.email}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <PixelButton
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="w-full bg-[#0f2d2d] text-[#91f6d3] normal-case tracking-[0.2em] hover:bg-[#134040]"
                        onClick={() => handleNavigation("/settings")}
                      >
                        Settings
                      </PixelButton>
                      <PixelButton
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="w-full bg-[#0f2d2d] text-[#91f6d3] normal-case tracking-[0.2em] hover:bg-[#134040]"
                        onClick={() => {
                          router.push("/api/auth/signout")
                          closeMobileMenu()
                        }}
                      >
                        Sign out
                      </PixelButton>
                    </>
                  ) : (
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      type="button"
                      className="w-full normal-case tracking-[0.2em]"
                      onClick={() => {
                        signIn("github")
                        closeMobileMenu()
                      }}
                    >
                      Sign in with GitHub
                    </PixelButton>
                  )}
                </PixelPanel>
              </PixelPanel>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default function NavBar() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  )
}
