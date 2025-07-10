"use client"

import { ChevronDown, GithubIcon, Rocket, Settings, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { SessionProvider, signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

function Header() {
  const session = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => {
              router.push("/")
              closeMobileMenu()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, ease: "linear" }}
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Deployr
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => router.push("/projects")}
              >
                Dashboard
              </Button>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" variant="outline">
                    Add New... <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild onClick={() => router.push("/new")}>
                  <Button variant="ghost" size="sm" className="w-full justify-start cursor-pointer">
                    Project
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                  onClick={() => {
                    window.open("https://github.com/new", "_blank", "noopener,noreferrer")
                  }}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Repository
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  window.open("https://www.github.com/Abhishek-B-R/Deployr", "_blank", "noopener,noreferrer")
                }}
              >
                <GithubIcon className="w-4 h-4" />
              </Button>
            </motion.div>

            {session.status === "authenticated" ? (
              <div>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.data.user?.image || ""} alt={session.data.user?.name || ""} />
                            <AvatarFallback>
                              {getInitials(session.data.user?.name || session.data.user?.email || "U")}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {session.data.user?.name && <p className="font-medium">{session.data.user?.name}</p>}
                          {session.data.user?.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                              {session.data.user?.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/api/auth/signout")}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild>
                    <Link href="/api/auth/signin">Sign In</Link>
                  </Button>
                )}
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" onClick={() => signIn("github")}>
                  Sign In
                </Button>
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.div className="md:hidden" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="relative z-50">
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-b shadow-lg z-40 md:hidden"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.nav
                className="container px-4 py-6 space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {/* Dashboard Button */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => {
                      router.push("/projects")
                      closeMobileMenu()
                    }}
                  >
                    Dashboard
                  </Button>
                </motion.div>

                {/* Add New Section */}
                <motion.div
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <p className="text-sm font-medium text-muted-foreground px-2">Add New</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      router.push("/new")
                      closeMobileMenu()
                    }}
                  >
                    Project
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      window.open("https://github.com/new", "_blank", "noopener,noreferrer")
                      closeMobileMenu()
                    }}
                  >
                    Repository
                  </Button>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                  className="flex items-center justify-between px-2"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </motion.div>

                {/* GitHub Link */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      window.open("https://www.github.com/Abhishek-B-R/Deployr", "_blank", "noopener,noreferrer")
                      closeMobileMenu()
                    }}
                  >
                    <GithubIcon className="w-4 h-4 mr-2" />
                    View Source
                  </Button>
                </motion.div>

                {/* User Section */}
                <motion.div
                  className="pt-4 border-t"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  {session.status === "authenticated" ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.data?.user?.image || ""} alt={session.data?.user?.name || ""} />
                          <AvatarFallback>
                            {getInitials(session.data?.user?.name || session.data?.user?.email || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 leading-none">
                          {session.data?.user?.name && <p className="font-medium text-sm">{session.data.user.name}</p>}
                          {session.data?.user?.email && (
                            <p className="truncate text-xs text-muted-foreground">{session.data.user.email}</p>
                          )}
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => {
                            router.push("/settings")
                            closeMobileMenu()
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => {
                            router.push("/api/auth/signout")
                            closeMobileMenu()
                          }}
                        >
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        signIn("github")
                        closeMobileMenu()
                      }}
                    >
                      Sign In with GitHub
                    </Button>
                  )}
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
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
