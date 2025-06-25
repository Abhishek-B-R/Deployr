import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"

type BodyData = {
    repository : string,
    branch:string,
    projectName:string,
    rootDirectory:string,
    buildCommand:string,
    outputDirectory:string,
    installCommand:string,
    envVars:{
        key:string,
        value:string
    }[],
    framework:string,
}

function generateSlug(projectName: string): string {
  return (
    projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 10)
  )
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
    const {
      repository,
      branch,
      projectName,
      rootDirectory,
      buildCommand,
      outputDirectory,
      installCommand,
      envVars,
      framework,
    }:BodyData = body

    // Validate required fields
    if (!repository || !branch || !projectName) {
      return NextResponse.json({ error: "Missing required fields: repository, branch, projectName" }, { status: 400 })
    }

    
    // Find or create user in database using your schema fields
    let user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    
    if (!user) {
        const response = await fetch("https://api.github.com/user", {
            headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Deployr-App",
            },      
        })
        const { id } = await response.json()

        user = await prisma.user.create({
            data: {
            email: session.user.email,
            name: session.user.name || "",
            avatar: session.user.image || "",
            github_username: session.user.name || "", // You might want to get this from GitHub API
            github_id: id, 
            },
        })
    }

    // Generate unique slug
    let slug = generateSlug(projectName)
    let slugExists = await prisma.project.findUnique({ where: { slug } })

    while (slugExists) {
      slug = generateSlug(projectName)
      slugExists = await prisma.project.findUnique({ where: { slug } })
    }

    // Create project in database using your schema
    const project = await prisma.project.create({
      data: {
        name: projectName,
        repo_name: repository.split("/")[1],
        repo_url: `https://github.com/${repository}`,
        branch,
        slug,
        userId: user.id,
        status: "PENDING", 
        buildCommand: buildCommand || "",
        installCommand: installCommand || "npm install",
        outputDirectory: outputDirectory || "dist",
        framework: framework || "",
        rootDirectory: "./"+rootDirectory,
        envVars: {
          create: envVars.map((env: { key: string; value: string }) => ({
            key: env.key,
            value: env.value,
          })),
        },
      },
      include: {
        envVars: true,
      },
    })

    // Prepare data for backend
    const backendPayload = {
      id: project.id,
      repository,
      branch,
      session
    }

    // Send to your backend
    try {
      const backendResponse = await fetch("http://localhost:8080/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendPayload),
      })

      if (!backendResponse.ok) {
        // Update project status to failed if backend call fails
        await prisma.project.update({
          where: { id: project.id },
          data: {
            status: "BUILD_FAILED", // Using your enum value
            logs: `Backend deployment failed: ${backendResponse.status} ${backendResponse.statusText}`,
          },
        })

        throw new Error(`Backend deployment failed: ${backendResponse.status}`)
      }

      const backendResult = await backendResponse.json()

      // Update project with any additional info from backend
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: "BUILDING", // Using your enum value
          logs: "Deployment started successfully",
        },
      })

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.name,
          slug: project.slug,
          status: project.status,
        },
        backendResponse: backendResult,
      })
    } catch (backendError) {
      console.error("Backend deployment error:", backendError)

      // Update project status to failed
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: "BUILD_FAILED", // Using your enum value
          logs: `Backend deployment error: ${backendError instanceof Error ? backendError.message : "Unknown error"}`,
        },
      })

      return NextResponse.json(
        {
          error: "Deployment failed",
          details: backendError instanceof Error ? backendError.message : "Unknown error",
          project: {
            id: project.id,
            name: project.name,
            slug: project.slug,
            status: "BUILD_FAILED",
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Deployment error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
