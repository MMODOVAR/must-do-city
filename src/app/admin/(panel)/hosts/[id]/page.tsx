import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { deleteHost, saveHost } from "@/modules/hosts/actions";
import { hostsService } from "@/modules/hosts/service";
import { HostForm } from "@/modules/hosts/ui/HostForm";
import { geographyService } from "@/modules/geography/service";
import { routes } from "@/modules/shared/routes";

export default async function EditHostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [host, cities] = await Promise.all([hostsService.adminGet(id), geographyService.cityOptions()]);
  if (!host) notFound();

  return (
    <>
      <PageHeader title={host.name} subtitle={host.city.name} back={{ href: "/admin/hosts", label: "Hosts" }} />
      {host.published && <Link href={routes.host(host.slug)} target="_blank" className="-mt-3 mb-5 inline-block text-sm text-sea hover:underline">View profile ↗</Link>}
      <HostForm action={saveHost.bind(null, host.id)} host={host} cities={cities} />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Experiences hosted by {host.name}</h2>
      <div className="card divide-y divide-stone-100">
        {host.experiences.length === 0 && <p className="p-5 text-sm text-stone-500">None yet — pick this host when editing an experience.</p>}
        {host.experiences.map((e) => (
          <Link key={e.id} href={`/admin/experiences/${e.id}`} className="flex items-center justify-between p-4 text-sm hover:bg-stone-50">
            <span className="font-medium">{e.title}</span><StatusPill published={e.published} />
          </Link>
        ))}
      </div>
      <div className="mt-10 border-t border-stone-200 pt-6">
        <ConfirmButton action={deleteHost.bind(null, host.id)} label="Delete host" warning={`Delete ${host.name}? Their experiences stay, without a host.`} />
      </div>
    </>
  );
}
