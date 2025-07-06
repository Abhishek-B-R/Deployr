import ImportPage from "@/components/Import";
import prisma from "@/db";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { repo?: string };
}

export default async function Import({ searchParams }: PageProps) {
  const repo = searchParams.repo;
  const repo_url = `https://github.com/${repo}`;
  const project = await prisma.project.findFirst({
    where: { repo_url }
  })
  if (project) {
    redirect(`/projects/${project.id}/overview`)
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ImportPage/>
    </div>
  )
};
