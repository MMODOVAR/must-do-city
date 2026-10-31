import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Cover } from "@/components/Cover";
import { formatPrice } from "@/lib/utils";

type Params = { params: Promise<{ country: string; city: string; journey: string }> };

async function load(p: Awaited<Params["params"]>) {
  return prisma.journey.findFirst({
    where: {
      slug: p.journey,
      published: true,
      city: { slug: p.city, published: true, country: { slug: p.country, published: true } },
    },
    include: { city: { include: { country: true } }, steps: { orderBy: { order: "asc" } } },
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const j = await load(await params);
  return { title: j?.title ?? "Not found", description: j?.summary ?? undefined };
}

export default async function JourneyPage({ params }: Params) {
  const j = await load(await params);
  if (!j) notFound();
  const price = formatPrice(j.price, j.currency);
  const base = `/${j.city.country.slug}/${j.city.slug}`;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-4 text-sm text-stone-500">
        <Link href="/" className="hover:text-ink">Home</Link> /{" "}
        <Link href={`/${j.city.country.slug}`} className="hover:text-ink">{j.city.country.name}</Link> /{" "}
        <Link href={base} className="hover:text-ink">{j.city.name}</Link>
      </nav>

      {j.category && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-clay">{j.category}</p>}
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{j.title}</h1>
      {j.summary && <p className="mt-4 text-xl text-stone-600">{j.summary}</p>}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        {j.durationHours != null && <Badge label="Duration" value={`${j.durationHours} hours`} />}
        {price && <Badge label="Price" value={price} />}
        <Badge label="Stops" value={String(j.steps.length)} />
      </div>

      <Cover src={j.imageUrl} alt={j.title} className="mt-8 h-72 w-full rounded-2xl sm:h-96" />

      {j.description && (
        <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-stone-700">{j.description}</div>
      )}

      {j.steps.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 font-display text-3xl font-semibold">The journey</h2>
          <ol className="relative space-y-8 border-l-2 border-dashed border-orange-200 pl-8">
            {j.steps.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-clay text-sm font-bold text-white">
                  {s.order}
                </span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-stone-500">
                  {[s.location, s.duration].filter(Boolean).join(" · ")}
                </p>
                {s.description && <p className="mt-2 text-stone-700">{s.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-14">
        <Link href={base} className="btn-ghost">← More in {j.city.name}</Link>
      </div>
    </article>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-lg border border-stone-200 bg-white px-3 py-2">
      <span className="text-stone-500">{label}: </span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}
