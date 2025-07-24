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
  buildCommand: z.string().min(1).optional(),
  installCommand: z.string().min(1).optional(),
  outputDirectory: z.string().min(1).optional(),
  framework: z.string().min(1).optional(),
  rootDirectory: z.string().min(1).optional(),
  envVars: z
    .array(
      z.object({
        key: z.string().min(1, "Environment variable key is required"),
        value: z.string().min(1, "Environment variable value is required"),
      }),
    )
    .optional(),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, context: any) {
  const { id } = await context.params

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
      include: {
        envVars: true,
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

    // Prepare update data for Project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug
    if (validatedData.private !== undefined) updateData.private = validatedData.private
    if (validatedData.buildCommand !== undefined) updateData.buildCommand = validatedData.buildCommand
    if (validatedData.installCommand !== undefined) updateData.installCommand = validatedData.installCommand
    if (validatedData.outputDirectory !== undefined) updateData.outputDirectory = validatedData.outputDirectory
    if (validatedData.framework !== undefined) updateData.framework = validatedData.framework
    if (validatedData.rootDirectory !== undefined) updateData.rootDirectory = validatedData.rootDirectory

    // Use transaction to update project and environment variables
    const result = await prisma.$transaction(async (tx) => {
      // Update project
      await tx.project.update({
        where: { id },
        data: updateData,
      })

      // Handle environment variables if provided
      if (validatedData.envVars !== undefined) {
        // Delete existing environment variables
        await tx.envVar.deleteMany({
          where: { projectId: id },
        })

        // Create new environment variables
        if (validatedData.envVars.length > 0) {
          await tx.envVar.createMany({
            data: validatedData.envVars.map((envVar) => ({
              key: envVar.key,
              value: envVar.value,
              projectId: id,
            })),
          })
        }
      }

      // Fetch updated project with environment variables
      return await tx.project.findUnique({
        where: { id },
        include: {
          envVars: true,
        },
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating project:", error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, context: any) {
  const { id } = await context.params

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
