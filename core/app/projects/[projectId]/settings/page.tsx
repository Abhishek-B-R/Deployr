import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"
import { ProjectSettings } from "@/components/ProjectOverview/project-settings"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"

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
export default async function ProjectSettingsPage(props: any) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    notFound()
  }
  const { params } = await props
  const { projectId } = await params

  const project = await getProject(projectId, session.user.email)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex justify-center-safe bg-[#F4F0E5]">
      <NavBar/>
      <Suspense fallback={<div>Loading project settings...</div>}>
        <ProjectSettings project={project} />
      </Suspense>
    </div>
  )
}
