import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deployment = await prisma.project.findFirst({
      where: {
        id: params.id,
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
