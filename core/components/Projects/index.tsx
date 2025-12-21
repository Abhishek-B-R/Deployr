import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/db";
import { ProjectsList } from "@/components/Projects/projects-list";
import { ProjectsListSkeleton } from "@/components/Projects/projects-list-skeleton";
import { redirect } from "next/navigation";

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
  });

  return projects;
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const projects = await getProjects(session.user.email);

  return (
    <div className="min-h-screen min-w-full overflow-x-hidden bg-neo-bg text-neo-black font-sans selection:bg-neo-yellow">
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList projects={projects} user={session.user} />
      </Suspense>
    </div>
  );
}