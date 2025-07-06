import ImportPage from "@/components/Import";
import prisma from "@/db";
import { redirect } from "next/navigation";

// NextJs issue, through i gave it valid types, its not building and throwing this error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ImportPageWrapper(props: any) {
  const searchParams = await props?.searchParams;
  const repo =
    typeof searchParams?.repo === "string" ? searchParams.repo : undefined;

  if (repo) {
    const repo_url = `https://github.com/${repo}`;

    const project = await prisma.project.findFirst({
      where: { repo_url },
    });

    if (project) {
      redirect(`/projects/${project.id}/overview`);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ImportPage />
    </div>
  );
}
