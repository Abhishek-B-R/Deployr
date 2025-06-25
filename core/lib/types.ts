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