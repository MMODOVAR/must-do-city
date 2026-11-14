import Link from "next/link";
import { PageHeader, StatusPill } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { experiencesService } from "@/modules/experiences/service";
import { priceLabel } from "@/modules/experiences/domain";
import { Rating } from "@/modules/shared/ui/Stars";

export default async function ExperiencesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await experiencesService.adminList(q);
  return (
    <>
      <PageHeader title="Experiences" subtitle={`${items.length} shown`} action={{ href: "/admin/experiences/new", label: "+ New experience" }} />
      <form className="mb-4"><input name="q" defaultValue={q} placeholder="Search by title, city or host…" className="input max-w-sm" /></form>
      <DataTable head={["Experience", "City", "Host", "Category", "Rating", "Price", "Bookings", "Status"]} empty="No experiences found." isEmpty={items.length === 0}>
        {items.map((e) => (
          <tr key={e.id} className="hover:bg-stone-50">
            <td className="p-4 font-medium">
              <Link href={`/admin/experiences/${e.id}`} className="hover:text-clay">{e.title}</Link>
              {e.featured && <span className="ml-2 text-xs text-amber-600">★ featured</span>}
              <div className="text-xs text-stone-400">{e._count.steps} steps</div>
            </td>
            <td className="p-4">{e.city.name}</td>
            <td className="p-4">{e.host?.name ?? <span className="text-stone-400">—</span>}</td>
            <td className="p-4">{e.category ? `${e.category.icon ?? ""} ${e.category.name}` : "—"}</td>
            <td className="p-4"><Rating average={e.ratingAverage} count={e.reviewCount} /></td>
            <td className="p-4 whitespace-nowrap">{priceLabel(e.price, e.currency, e.pricingType)}</td>
            <td className="p-4">{e._count.bookings}</td>
            <td className="p-4"><StatusPill published={e.published} /></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
