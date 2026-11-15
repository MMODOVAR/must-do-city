import Link from "next/link";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { saveExperience } from "@/modules/experiences/actions";
import { ExperienceForm } from "@/modules/experiences/ui/ExperienceForm";
import { geographyService } from "@/modules/geography/service";
import { hostsService } from "@/modules/hosts/service";
import { categoriesService } from "@/modules/categories/service";

export default async function NewExperiencePage({ searchParams }: { searchParams: Promise<{ city?: string; host?: string }> }) {
  const { city } = await searchParams;
  const [cities, hosts, categories] = await Promise.all([geographyService.cityOptions(), hostsService.options(), categoriesService.options()]);
  return (
    <>
      <PageHeader title="New experience" back={{ href: "/admin/experiences", label: "Experiences" }} />
      {cities.length === 0 ? (
        <p className="card p-6 text-sm">Create a city first. <Link href="/admin/cities/new" className="font-medium text-clay">New city →</Link></p>
      ) : (
        <ExperienceForm action={saveExperience.bind(null, null)} cities={cities} hosts={hosts} categories={categories} defaultCityId={city} />
      )}
    </>
  );
}
