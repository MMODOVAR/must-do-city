import { notFound } from "next/navigation";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { deleteCategory, saveCategory } from "@/modules/categories/actions";
import { categoriesService } from "@/modules/categories/service";
import { CategoryForm } from "@/modules/categories/ui/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const category = await categoriesService.get((await params).id);
  if (!category) notFound();
  return (
    <>
      <PageHeader title={`${category.icon ?? ""} ${category.name}`} back={{ href: "/admin/categories", label: "Categories" }} />
      <CategoryForm action={saveCategory.bind(null, category.id)} category={category} />
      <div className="mt-10 border-t border-stone-200 pt-6">
        <ConfirmButton action={deleteCategory.bind(null, category.id)} label="Delete category" warning={`Delete ${category.name}? Its experiences become uncategorised.`} />
      </div>
    </>
  );
}
