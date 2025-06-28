import { redirect } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
    const projectId = await params.projectId;
  redirect(`/project/${projectId}/overview`);
}
