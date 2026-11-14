import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { deleteExperience, saveExperience } from "@/modules/experiences/actions";
import { experiencesService } from "@/modules/experiences/service";
import { ExperienceForm } from "@/modules/experiences/ui/ExperienceForm";
import { geographyService } from "@/modules/geography/service";
import { hostsService } from "@/modules/hosts/service";
import { categoriesService } from "@/modules/categories/service";
import { routes } from "@/modules/shared/routes";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [e, cities, hosts, categories] = await Promise.all([
    experiencesService.adminGet(id),
    geographyService.cityOptions(),
    hostsService.options(),
    categoriesService.options(),
  ]);
  if (!e) notFound();

  return (
    <>
      <PageHeader title={e.title} subtitle={`${e.city.name}, ${e.city.country.name}`} back={{ href: "/admin/experiences", label: "Experiences" }} />
      <div className="-mt-3 mb-5 flex gap-4 text-sm">
        {e.published && <Link href={routes.experience(e.slug)} target="_blank" className="text-sea hover:underline">View on site ↗</Link>}
        <Link href={`/admin/reviews?experience=${e.id}`} className="text-stone-500 hover:underline">Reviews ({e.reviewCount})</Link>
      </div>
      <ExperienceForm action={saveExperience.bind(null, e.id)} experience={e} cities={cities} hosts={hosts} categories={categories} />
      <div className="mt-10 border-t border-stone-200 pt-6">
        <ConfirmButton action={deleteExperience.bind(null, e.id)} label="Delete experience" warning={`Delete "${e.title}"? Its bookings and reviews are deleted too.`} />
      </div>
    </>
  );
}
