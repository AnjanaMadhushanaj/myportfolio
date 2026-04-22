import { getHeroData } from "@/lib/firestore.server";
import HeroClient from "@/components/ui/HeroClient";

export default async function Hero() {
  const data = await getHeroData();

  return (
    <div className="relative">
      <HeroClient data={data} />
    </div>
  );
}
