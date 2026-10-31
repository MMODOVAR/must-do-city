import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { deleteJourney, saveJourney } from "@/app/admin/actions";
import { JourneyForm } from "@/components/admin/JourneyForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditJourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [journey, cities] = await Promise.all([
    prisma.journey.findUnique({
      where: { id },
      include: { steps: { orderBy: { order: "asc" } }, city: { include: { country: true } } },
    }),
    prisma.city.findMany({
      orderBy: [{ country: { name: "asc" } }, { name: "asc" }],
      select: { id: true, name: true, country: { select: { name: true } } },
    }),
  ]);
  if (!journey) notFound();
  const publicUrl = `/${journey.city.country.slug}/${journey.city.slug}/${journey.slug}`;

  return (
    <>
      <PageHeader title={journey.title} subtitle={`${journey.city.name}, ${journey.city.country.name}`} back={{ href: "/admin/journeys", label: "Journeys" }} />
      {journey.published && (
        <Link href={publicUrl} target="_blank" className="-mt-3 mb-5 inline-block text-sm text-sea hover:underline">
          View on site ↗
        </Link>
      )}
      <JourneyForm action={saveJourney.bind(null, journey.id)} journey={journey} cities={cities} />
      <div className="mt-10 border-t border-stone-200 pt-6">
        <DeleteButton action={deleteJourney.bind(null, journey.id)} label="Delete journey" warning={`Delete "${journey.title}"?`} />
      </div>
    </>
  );
}
