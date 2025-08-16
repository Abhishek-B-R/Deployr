import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing owner or repo parameter" }, { status: 400 })
    }

    // Get repository tree from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract unique folder paths
    const folders = new Set<string>()
    folders.add("/") // Root folder

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.tree.forEach((item: any) => {
      if (item.type === "tree") {
        folders.add(`/${item.path}`)
      } else if (item.type === "blob") {
        // Add parent directories of files
        const pathParts = item.path.split("/")
        for (let i = 1; i < pathParts.length; i++) {
          const folderPath = "/" + pathParts.slice(0, i).join("/")
          folders.add(folderPath)
        }
      }
    })

    const sortedFolders = Array.from(folders).sort()

    return NextResponse.json({ folders: sortedFolders })
  } catch (error) {
    console.error("Error fetching repository folders:", error)
    return NextResponse.json({ error: "Failed to fetch repository folders" }, { status: 500 })
  }
}
