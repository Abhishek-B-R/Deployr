import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = context.params
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { logs } = await request.json()

    if (!logs || typeof logs !== "string") {
      return NextResponse.json({ error: "Invalid logs data" }, { status: 400 })
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Update project with logs
    await prisma.project.update({
      where: { id },
      data: {
        logs,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Logs saved successfully",
      logsLength: logs.length,
    })
  } catch (error) {
    console.error("Error saving logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get project logs
    const project = await prisma.project.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
      select: {
        logs: true,
        updatedAt: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      logs: project.logs || "",
      lastUpdated: project.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
