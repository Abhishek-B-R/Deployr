import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import prisma from "@/db"
import { ProjectsList } from "@/components/Projects/projects-list"
import { ProjectsListSkeleton } from "@/components/Projects/projects-list-skeleton"
import { redirect } from "next/navigation"

async function getProjects(userEmail: string) {
  const projects = await prisma.project.findMany({
    where: {
      user: {
        email: userEmail,
      },
      isDeleted: false,
    },
    include: {
      envVars: true,
      user: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return projects
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const projects = await getProjects(session.user.email)

  return (
    <div className="min-h-screen min-w-full md:pl-16 sm:pl-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList projects={projects} user={session.user} />
      </Suspense>
    </div>
  )
}
