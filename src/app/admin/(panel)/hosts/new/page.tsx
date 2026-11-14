import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { saveHost } from "@/modules/hosts/actions";
import { HostForm } from "@/modules/hosts/ui/HostForm";
import { geographyService } from "@/modules/geography/service";

export default async function NewHostPage() {
  const cities = await geographyService.cityOptions();
  return (
    <>
      <PageHeader title="New host" back={{ href: "/admin/hosts", label: "Hosts" }} />
      {cities.length === 0 ? (
        <p className="card p-6 text-sm">Create a city first. <Link href="/admin/cities/new" className="font-medium text-clay">New city →</Link></p>
      ) : (
        <HostForm action={saveHost.bind(null, null)} cities={cities} />
      )}
    </>
  );
}
