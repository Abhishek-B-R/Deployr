import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeAgo(input: string | Date): string {
  const updated = typeof input === "string" ? new Date(input) : input
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hr${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`
  return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`
}

export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#4FC08D",
    React: "#61DAFB",
  }
  return colors[language || ""] || "#8b949e"
}
