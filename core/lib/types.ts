export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  updated_at: string
  private: boolean
  html_url: string
  language: string | null
  stargazers_count: number
  owner: {
    login: string
    avatar_url: string
  }
}

export interface Template {
  id: string
  name: string
  description: string
  image: string
  framework: string
  tags: string[]
}

export interface DeploymentConfig {
  repository: string
  branch: string
  projectName: string
  rootDirectory: string
  buildCommand: string
  outputDirectory: string
  installCommand: string
  envVars: Array<{ key: string; value: string }>
  framework: string
}

export interface Project {
  id: string
  name: string
  slug: string
  repo_name: string | null
  repo_url: string | null
  branch: string | null
  status: "PENDING" | "BUILDING" | "BUILD_SUCCESS" | "BUILD_FAILED" | "DELETED"
  createdAt: Date
  updatedAt: Date
  private: boolean
  isDeleted: boolean
  size: number | null
  views: number
  logs: string | null
  envVars: Array<{ key: string; value: string }>
  userId: string
}

export interface User {
  id: string
  name: string | null
  github_id: number | null
  github_username: string | null
  email: string
  bio: string | null
  avatar: string | null
  accessToken: string | null
}
