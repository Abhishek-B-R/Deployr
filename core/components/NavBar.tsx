"use client";
import { useState } from "react";
import {
  ChevronDown,
  Github,
  Rocket,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "./auth-btn";

// Simple UI Components to replace Shadcn for this demo
const Button = ({
  children,
  className,
  variant = "primary",
  size = "default",
  onClick,
  ...props
}: any) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const variants: any = {
    primary:
      "bg-neo-blue text-black border-2 border-neo-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:bg-blue-600",
    outline:
      "bg-white text-neo-black border-2 border-neo-black shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-gray-50",
    ghost:
      "hover:bg-neo-yellow hover:text-black border-2 border-transparent hover:border-neo-black hover:shadow-neo-sm",
    icon: "p-2 border-2 border-transparent hover:border-neo-black hover:bg-white hover:shadow-neo-sm",
  };

  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const session = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b-4 border-neo-black bg-neo-bg px-4 md:px-10 h-20 flex items-center"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container mx-auto flex h-full items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            router.push("/");
            closeMobileMenu();
          }}
        >
          <motion.div className="flex items-center justify-center w-10 h-10 bg-neo-yellow border-2 border-neo-black shadow-neo-sm group-hover:rotate-12 transition-transform">
            <Rocket className="w-6 h-6 text-black" />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter text-neo-black">
            Deployr
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="primary"
              onClick={() => router.push("/projects")}
              className="bg-neo-yellow"
            >
              Dashboard
            </Button>
          </motion.div>

          {/* Dropdown Placeholder */}
          <div className="relative">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Add New... <ChevronDown className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-48 bg-white border-2 border-neo-black shadow-neo-lg z-50 p-2"
                >
                  <button
                    onClick={() => router.push("/new")}
                    className="w-full text-left px-4 py-2 hover:bg-neo-yellow font-bold text-sm transition-colors mb-1 border border-transparent text-black hover:border-black"
                  >
                    Project
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        "https://github.com/new",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neo-green font-bold text-sm transition-colors border border-transparent text-black hover:border-black"
                  >
                    Repository
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Click outside closer would go here in full app */}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open("https://github.com/Abhishek-B-R/Deployr", "_blank");
              }}
            >
              <Github className="w-5 h-5" />
            </Button>
          </motion.div>

          <AuthButton session={session} />
        </nav>

        {/* Mobile Menu Toggle */}
        <motion.div
          className="md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="relative z-50"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            <motion.div
              className="fixed top-20 left-0 right-0 bg-neo-white border-b-4 border-neo-black z-40 md:hidden shadow-neo-lg"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.nav
                className="container px-6 py-6 space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    className="w-full justify-start"
                    onClick={closeMobileMenu}
                    variant="primary"
                  >
                    Dashboard
                  </Button>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">
                    Add New
                  </p>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={closeMobileMenu}
                  >
                    Project
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={closeMobileMenu}
                  >
                    Repository
                  </Button>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={closeMobileMenu}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source
                  </Button>
                </motion.div>

                <AuthButton className={"w-full"} session={session}/>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


export default function NavBar() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  );
}