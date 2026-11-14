import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { DataTable } from "@/modules/shared/admin/DataTable";
import { categoriesService } from "@/modules/categories/service";

export default async function CategoriesPage() {
  const categories = await categoriesService.listAll();
  return (
    <>
      <PageHeader title="Categories" subtitle="Themes visitors browse by" action={{ href: "/admin/categories/new", label: "+ New category" }} />
      <DataTable head={["Category", "Slug", "Experiences", "Order", ""]} empty="No categories yet." isEmpty={categories.length === 0}>
        {categories.map((c) => (
          <tr key={c.id} className="hover:bg-stone-50">
            <td className="p-4 font-medium"><Link href={`/admin/categories/${c.id}`} className="hover:text-clay">{c.icon} {c.name}</Link></td>
            <td className="p-4 text-stone-500">{c.slug}</td>
            <td className="p-4">{c._count.experiences}</td>
            <td className="p-4">{c.sortOrder}</td>
            <td className="p-4 text-right"><Link href={`/admin/categories/${c.id}`} className="font-medium text-clay">Edit</Link></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
