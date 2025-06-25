import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"
import { ProjectOverview } from "@/components/project-overview"
import { ProjectOverviewSkeleton } from "@/components/project-overview-skeleton"

interface PageProps {
  params: {
    projectId: string
  }
}

async function getProject(projectId: string, userEmail: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user: {
        email: userEmail,
      },
      isDeleted: false,
    },
    include: {
      envVars: true,
      user: true,
    },
  })

  return project
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    notFound()
  }

  const project = await getProject(params.projectId, session.user.email)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ProjectOverviewSkeleton />}>
        <ProjectOverview project={project} />
      </Suspense>
    </div>
  )
}
