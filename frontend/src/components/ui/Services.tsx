import { getServicesData } from "@/lib/firestore.server";
import ServicesClient from "@/components/ui/ServicesClient";

export default async function Services() {
  const data = await getServicesData();

  return (
    <div className="relative">
      <ServicesClient data={data} />
    </div>
  );
}
