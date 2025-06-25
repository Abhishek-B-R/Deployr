/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { RefreshCw, ChevronDown, Star, Lock, Globe, ExternalLink } from "lucide-react"
import type { Repository } from "@/lib/types"
import { getTimeAgo, getLanguageColor } from "@/lib/utils"
import { useRouter } from "next/navigation"

function RepositoryListInsider() {
  const { data: session } = useSession()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("updated")
  const router = useRouter()

  const fetchRepositories = async () => {
    if (!session) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        sort: sortBy,
        per_page: "30",
      })

      const response = await fetch(`/api/github/repos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRepositories(data)
      }
    } catch (error) {
      console.error("Error fetching repositories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepositories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sortBy])

  const handleImport = (repo: Repository) => {
    router.push(`/new/import?repo=${repo.full_name}`)
  }

  if (!session) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your repositories</p>
          <Button onClick={() => router.push("/api/auth/signin")}>Sign in with GitHub</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Import Git Repository</h2>
          <Button variant="ghost" size="icon" onClick={() => fetchRepositories()} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex gap-10 px-4 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <img src={session.user?.image || ""} alt={session.user?.name || ""} className="w-4 h-4 rounded-full" />
                {session.user?.name}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <img
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                  className="w-4 h-4 rounded-full mr-2"
                />
                {session.user?.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort: {sortBy}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("updated")}>Recently Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created")}>Recently Created</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("pushed")}>Recently Pushed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("full_name")}>Name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading repositories...</p>
            </div>
          ) : repositories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No repositories found</p>
            </div>
          ) : (
            repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline truncate"
                      >
                        {repo.name}
                      </a>
                      {repo.private ? (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Globe className="w-3 h-3 text-muted-foreground" />
                      )}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{getTimeAgo(repo.updated_at)}</span>
                      {repo.language && <span>{repo.language}</span>}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{repo.description}</p>
                    )}
                  </div>
                </div>
                <Button onClick={() => handleImport(repo)} size="sm" className="ml-4 flex-shrink-0">
                  Import
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function RepositoryList() {
    return (
        <SessionProvider>
            <RepositoryListInsider/>
        </SessionProvider>
    )
};
