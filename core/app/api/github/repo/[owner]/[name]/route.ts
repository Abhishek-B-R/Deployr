import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { detectFramework } from "@/lib/framework-detection"

export async function GET(request: NextRequest, { params }: { params: { owner: string; name: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { owner, name } = params

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
      }
    } catch (error) {
      console.log("Could not fetch package.json, using static framework"+error)
      framework = detectFramework(null)
    }

    return NextResponse.json({
      repository: repoData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branches: branches.map((branch: any) => ({
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
