import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProjectPage(props: any) {
  const projectId = await props.params?.projectId;

  redirect(`/project/${projectId}/overview`);
}
