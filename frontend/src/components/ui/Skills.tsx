import { getSkillsData } from "@/lib/firestore.server";
import SkillsClient from "@/components/ui/SkillsClient";

export default async function Skills() {
  const data = await getSkillsData();

  return (
    <div className="relative">
      <SkillsClient data={data} />
    </div>
  );
}
