import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"
import { ProjectOverview } from "@/components/ProjectOverview/project-overview"
import { ProjectOverviewSkeleton } from "@/components/ProjectOverview/project-overview-skeleton"


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProjectOverviewPage(props: any) {
  const { params } = props
  const { projectId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    notFound()
  }

  const project = await getProject(projectId, session.user.email)

  if (!project) {
    notFound()
  }

  return (
      <div className="min-h-screen min-w-full bg-background">
        <Suspense fallback={<ProjectOverviewSkeleton />}>
          <ProjectOverview project={project} />
        </Suspense>
      </div>
  )
}
