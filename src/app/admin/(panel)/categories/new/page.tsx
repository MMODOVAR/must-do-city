import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { saveCategory } from "@/modules/categories/actions";
import { CategoryForm } from "@/modules/categories/ui/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader title="New category" back={{ href: "/admin/categories", label: "Categories" }} />
      <CategoryForm action={saveCategory.bind(null, null)} />
    </>
  );
}
