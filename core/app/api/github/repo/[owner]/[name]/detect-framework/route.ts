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
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path") || "./"

    let packageJson = null
    let framework = null

    try {
      // Construct the correct package.json path based on the directory
      let packagePath = "package.json"
      if (path && path !== "./" && path !== "/") {
        const cleanPath = path.replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
        packagePath = `${cleanPath}/package.json`
      }

      console.log(`Fetching package.json from path: ${packagePath}`)

      const packageResponse = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${packagePath}`, {
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
          console.log(`Framework detected: ${framework.name}`)
        }
      } else {
        console.log(`package.json not found at ${packagePath}, using unknown framework`)
        framework = detectFramework(null)
      }
    } catch (error) {
      console.error(`Error fetching package.json:`, error)
      framework = detectFramework(null)
    }

    return NextResponse.json({
      framework,
      packageJson,
      detectedPath: path,
      success: true,
    })
  } catch (error) {
    console.error("Error in framework detection API:", error)
    return NextResponse.json({ error: "Failed to detect framework", success: false }, { status: 500 })
  }
}
