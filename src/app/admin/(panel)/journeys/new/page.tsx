import Link from "next/link";
import { prisma } from "@/lib/db";
import { saveJourney } from "@/app/admin/actions";
import { JourneyForm } from "@/components/admin/JourneyForm";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function NewJourneyPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city } = await searchParams;
  const cities = await prisma.city.findMany({
    orderBy: [{ country: { name: "asc" } }, { name: "asc" }],
    select: { id: true, name: true, country: { select: { name: true } } },
  });

  return (
    <>
      <PageHeader title="New journey" back={{ href: "/admin/journeys", label: "Journeys" }} />
      {cities.length === 0 ? (
        <p className="card p-6 text-sm">
          Create a city first. <Link href="/admin/cities/new" className="font-medium text-clay">New city →</Link>
        </p>
      ) : (
        <JourneyForm action={saveJourney.bind(null, null)} cities={cities} defaultCityId={city} />
      )}
    </>
  );
}
