import { getProjectsData } from "@/lib/firestore.server";
import ProjectsClient from "@/components/ui/ProjectsClient";

export default async function Projects() {
  const data = await getProjectsData();

  return (
    <div className="relative">
      <ProjectsClient data={data} />
    </div>
  );
}
