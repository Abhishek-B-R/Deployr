import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"
import { z } from "zod"

const updateProjectSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  private: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

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

    // Check if slug is unique (if being updated)
    if (validatedData.slug && validatedData.slug !== existingProject.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Soft delete the project
    await prisma.project.update({
      where: { id },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
