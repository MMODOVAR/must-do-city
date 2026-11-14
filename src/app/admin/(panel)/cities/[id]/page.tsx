import { notFound } from "next/navigation";
import { PageHeader } from "@/modules/shared/admin/PageHeader";
import { ConfirmButton } from "@/modules/shared/admin/ui";
import { deleteCity, saveCity } from "@/modules/geography/actions";
import { geographyService } from "@/modules/geography/service";
import { CityForm } from "@/modules/geography/ui/CityForm";

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [city, countries] = await Promise.all([geographyService.adminCity(id), geographyService.countryOptions()]);
  if (!city) notFound();

  return (
    <>
      <PageHeader title={city.name} subtitle={`${city.country.name} · /destinations/${city.country.slug}/${city.slug}`} back={{ href: "/admin/cities", label: "Cities" }} />
      <CityForm action={saveCity.bind(null, city.id)} city={city} countries={countries} />
      <div className="mt-10 border-t border-stone-200 pt-6">
        <ConfirmButton action={deleteCity.bind(null, city.id)} label="Delete city"
          warning={`Delete ${city.name}? This also deletes its hosts and experiences.`} />
      </div>
    </>
  );
}
