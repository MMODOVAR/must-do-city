import Link from "next/link";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { hostsService } from "@/modules/hosts/service";

export default async function HostsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const hosts = await hostsService.adminList(q);
  return (
    <>
      <PageHeader title="Hosts" subtitle="The locals who run your experiences" action={{ href: "/admin/hosts/new", label: "+ New host" }} />
      <form className="mb-4"><input name="q" defaultValue={q} placeholder="Search by name or city…" className="input max-w-sm" /></form>
      <DataTable head={["Host", "City", "Languages", "Experiences", "Status", ""]} empty="No hosts yet." isEmpty={hosts.length === 0}>
        {hosts.map((h) => (
          <tr key={h.id} className="hover:bg-stone-50">
            <td className="p-4">
              <Link href={`/admin/hosts/${h.id}`} className="flex items-center gap-3 font-medium hover:text-clay">
                <Avatar name={h.name} src={h.avatarUrl} size={32} /> {h.name} {h.verified && <span className="text-xs text-sea">✔</span>}
              </Link>
            </td>
            <td className="p-4">{h.city.name}, {h.city.country.name}</td>
            <td className="p-4 text-stone-600">{h.languages}</td>
            <td className="p-4">{h._count.experiences}</td>
            <td className="p-4"><StatusPill published={h.published} /></td>
            <td className="p-4 text-right whitespace-nowrap">
              <Link href={`/admin/experiences/new?city=${h.cityId}`} className="mr-4 text-stone-500 hover:text-ink">+ Experience</Link>
              <Link href={`/admin/hosts/${h.id}`} className="font-medium text-clay">Edit</Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
