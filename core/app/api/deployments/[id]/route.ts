import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await context.params
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deployment = await prisma.project.findFirst({
      where: {
        id: id,
        user: {
          email: session.user.email,
        },
      },
      include: {
        envVars: true,
      },
    })

    if (!deployment) {
      return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
    }

    return NextResponse.json(deployment)
  } catch (error) {
    console.error("Error fetching deployment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
