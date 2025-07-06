import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { detectFramework } from "@/lib/framework-detection"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { owner, name } = await context.params

    // Fetch repository details
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Deployr-App",
      },
    })

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    const repoData = await repoResponse.json()

    // Fetch branches
    const branchesResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/branches`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Deployr-App",
      },
    })

    const branches = branchesResponse.ok ? await branchesResponse.json() : []

    // Try to fetch package.json for framework detection
    let packageJson = null
    let framework = null

    try {
      const packageResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/package.json`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Deployr-App",
        },
      })

      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        if (packageData.content) {
          const content = Buffer.from(packageData.content, "base64").toString("utf-8")
          packageJson = JSON.parse(content)
          framework = detectFramework(packageJson)
        }
      } else {
        // If package.json is not found, use unknown framework
        framework = detectFramework(null)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If there's any error fetching or parsing package.json, use unknown framework
      console.log("Could not fetch or parse package.json, using unknown framework")
      framework = detectFramework(null)
    }

    interface branchType{
      name: string
      commit: {
        sha: string
      }
    }

    return NextResponse.json({
      repository: repoData,
      branches: branches.map((branch: branchType) => ({
        name: branch.name,
        sha: branch.commit.sha,
      })),
      framework,
      packageJson,
    })
  } catch (error) {
    console.error("Error fetching repository details:", error)
    return NextResponse.json({ error: "Failed to fetch repository details" }, { status: 500 })
  }
}
