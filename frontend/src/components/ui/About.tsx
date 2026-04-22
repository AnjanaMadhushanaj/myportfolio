/**
 * About.tsx — Server Component Shell
 */

import { getAboutData } from "@/lib/firestore.server";
import AboutClient from "@/components/ui/AboutClient";

export default async function About() {
  const data = await getAboutData();

  return (
    <div className="relative">
      <AboutClient data={data} />
    </div>
  );
}
