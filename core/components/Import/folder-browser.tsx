"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, ChevronRight, Home, Loader2 } from "lucide-react"

interface FolderItem {
  name: string
  path: string
  type: "folder"
}

interface FolderApiResponse {
  folders: string[]
}

interface FolderBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPath: (path: string) => void
  repoId: number
  owner: string
  repo: string
  currentPath: string
}

export function FolderBrowser({
  open,
  onOpenChange,
  onSelectPath,
  repoId,
  owner,
  repo,
  currentPath,
}: FolderBrowserProps) {
  const [pathSegments, setPathSegments] = useState<string[]>([])
  const [allFolders, setAllFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string>(currentPath)

  useEffect(() => {
    if (open) {
      const segments = currentPath === "./" ? [] : currentPath.split("/").filter(Boolean)
      setPathSegments(segments)
      setSelectedPath(currentPath)
      fetchAllFolders()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPath])

  const fetchAllFolders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/repositories/${repoId}/folders?owner=${owner}&repo=${repo}`)

      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }

      const data: FolderApiResponse = await response.json()
      setAllFolders(data.folders || [])
    } catch (error) {
      console.error("Error fetching folders:", error)
      setAllFolders([])
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLevelFolders = (): FolderItem[] => {
    const currentPathStr = pathSegments.length === 0 ? "" : `/${pathSegments.join("/")}`

    const childFolders = new Set<string>()

    allFolders.forEach((folderPath) => {
      // Skip root folder "/"
      if (folderPath === "/") return

      // Remove leading slash for consistency
      const cleanPath = folderPath.startsWith("/") ? folderPath.slice(1) : folderPath

      if (currentPathStr === "") {
        // At root level, show top-level folders
        const firstSegment = cleanPath.split("/")[0]
        if (firstSegment && !cleanPath.includes("/", 1)) {
          childFolders.add(firstSegment)
        }
      } else {
        // At deeper levels, show immediate children
        const currentPathClean = currentPathStr.slice(1) // Remove leading slash
        if (cleanPath.startsWith(currentPathClean + "/")) {
          const remainingPath = cleanPath.slice(currentPathClean.length + 1)
          const nextSegment = remainingPath.split("/")[0]
          if (nextSegment && !remainingPath.includes("/", nextSegment.length)) {
            childFolders.add(nextSegment)
          }
        }
      }
    })

    return Array.from(childFolders)
      .map((folderName) => ({
        name: folderName,
        path: pathSegments.length === 0 ? folderName : `${pathSegments.join("/")}/${folderName}`,
        type: "folder" as const,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const navigateToFolder = (folderPath: string) => {
    const newSegments = folderPath.split("/").filter(Boolean)
    setPathSegments(newSegments)
    setSelectedPath(folderPath || "./")
  }

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      // Navigate to root
      setPathSegments([])
      setSelectedPath("./")
    } else {
      // Navigate to specific segment
      const newSegments = pathSegments.slice(0, index + 1)
      const newPath = newSegments.join("/")
      setPathSegments(newSegments)
      setSelectedPath(newPath || "./")
    }
  }

  const handleSubmit = () => {
    onSelectPath(selectedPath)
    onOpenChange(false)
  }

  const displayPath = selectedPath === "./" ? "./ (root)" : selectedPath
  const currentFolders = getCurrentLevelFolders()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Root Directory</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-1 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToBreadcrumb(-1)}
              className="h-8 px-2 hover:bg-muted"
            >
              <Home className="w-4 h-4" />
            </Button>

            {pathSegments.map((segment, index) => (
              <div key={index} className="flex items-center space-x-1">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToBreadcrumb(index)}
                  className="h-8 px-2 hover:bg-muted font-medium"
                >
                  {segment}
                </Button>
              </div>
            ))}
          </div>

          {/* Current Selection */}
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Selected: {displayPath}</span>
              </div>
              <Badge variant="secondary">
                {pathSegments.length === 0
                  ? "Root"
                  : `${pathSegments.length} level${pathSegments.length > 1 ? "s" : ""} deep`}
              </Badge>
            </div>
          </div>

          {/* Folder List */}
          <div className="flex-1 border rounded-lg overflow-hidden">
            <div className="bg-muted/30 px-4 py-2 border-b">
              <span className="text-sm font-medium">
                {pathSegments.length === 0 ? "Root Directory" : `Contents of /${pathSegments.join("/")}`}
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading folders...</span>
                </div>
              ) : currentFolders.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  No folders found in this directory
                </div>
              ) : (
                <div className="divide-y">
                  {currentFolders.map((folder) => (
                    <button
                      key={folder.path}
                      onClick={() => navigateToFolder(folder.path)}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{folder.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Use &quot;{displayPath}&quot; as Root Directory</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
