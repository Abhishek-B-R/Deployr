export interface FrameworkConfig {
  name: string
  slug: string
  logo: string
  buildCommand: string
  outputDirectory: string
  installCommand: string
  devCommand: string
  description: string
  color: string
}

export const frameworks: Record<string, FrameworkConfig> = {
  nextjs: {
    name: "Next.js",
    slug: "nextjs",
    logo: "⚡",
    buildCommand: "npm run build",
    outputDirectory: "out",
    installCommand: "npm install",
    devCommand: "npm run dev",
    description: "The React Framework for Production",
    color: "#000000",
  },
  react: {
    name: "Create React App",
    slug: "react",
    logo: "⚛️",
    buildCommand: "npm run build",
    outputDirectory: "build",
    installCommand: "npm install",
    devCommand: "npm start",
    description: "Set up a modern web app by running one command",
    color: "#61DAFB",
  },
  vue: {
    name: "Vue.js",
    slug: "vue",
    logo: "💚",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    devCommand: "npm run serve",
    description: "The Progressive JavaScript Framework",
    color: "#4FC08D",
  },
  vite: {
    name: "Vite",
    slug: "vite",
    logo: "⚡",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    devCommand: "npm run dev",
    description: "Next Generation Frontend Tooling",
    color: "#646CFF",
  },
  angular: {
    name: "Angular",
    slug: "angular",
    logo: "🅰️",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    devCommand: "npm start",
    description: "The modern web developer's platform",
    color: "#DD0031",
  },
  svelte: {
    name: "SvelteKit",
    slug: "svelte",
    logo: "🧡",
    buildCommand: "npm run build",
    outputDirectory: "build",
    installCommand: "npm install",
    devCommand: "npm run dev",
    description: "Cybernetically enhanced web apps",
    color: "#FF3E00",
  },
  static: {
    name: "Static HTML",
    slug: "static",
    logo: "📄",
    buildCommand: "",
    outputDirectory: ".",
    installCommand: "",
    devCommand: "",
    description: "Static HTML, CSS, and JavaScript",
    color: "#E34F26",
  },
  unknown: {
    name: "Other",
    slug: "unknown",
    logo: "❓",
    buildCommand: "npm run build",
    outputDirectory: "public",
    installCommand: "npm install",
    devCommand: "npm run dev",
    description: "Unknown framework",
    color: "#000000",
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function detectFramework(packageJson: any): FrameworkConfig {
  if (!packageJson) return frameworks.unknown

  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  const scripts = packageJson.scripts || {}

  // Next.js detection
  if (dependencies.next) {
    return frameworks.nextjs
  }

  // Vite detection (check before React as Vite can be used with React)
  if (dependencies.vite || scripts.dev?.includes("vite")) {
    return frameworks.vite
  }

  // React detection
  if (dependencies.react || dependencies["react-scripts"]) {
    return frameworks.react
  }

  // Vue detection
  if (dependencies.vue || dependencies["@vue/cli-service"]) {
    return frameworks.vue
  }

  // Angular detection
  if (dependencies["@angular/core"]) {
    return frameworks.angular
  }

  // SvelteKit detection
  if (dependencies["@sveltejs/kit"] || dependencies.svelte) {
    return frameworks.svelte
  }

  return frameworks.unknown
}
