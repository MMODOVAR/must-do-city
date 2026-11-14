import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experiencesService } from "@/modules/experiences/service";
import { durationLabel, priceLabel } from "@/modules/experiences/domain";
import { StepsTimeline } from "@/modules/experiences/ui/StepsTimeline";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { reviewsService } from "@/modules/reviews/service";
import { ReviewList, ReviewSummary } from "@/modules/reviews/ui/ReviewList";
import { GuestReviewForm } from "@/modules/reviews/ui/GuestReviewForm";
import { BookingForm } from "@/modules/bookings/ui/BookingForm";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Cover } from "@/modules/shared/ui/Cover";
import { Rating } from "@/modules/shared/ui/Stars";
import { Breadcrumbs } from "@/modules/shared/ui/Breadcrumbs";
import { routes } from "@/modules/shared/routes";
import { splitLines, splitList } from "@/modules/shared/text";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await experiencesService.findPublished((await params).slug);
  return { title: e?.title ?? "Not found", description: e?.summary ?? undefined };
}

export default async function ExperiencePage({ params }: Params) {
  const e = await experiencesService.findPublished((await params).slug);
  if (!e) notFound();

  const [reviews, related] = await Promise.all([
    reviewsService.forExperience(e.id),
    experiencesService.inCity(e.city.slug, e.city.country.slug, 4),
  ]);
  const price = priceLabel(e.price, e.currency, e.pricingType);
  const languages = splitList(e.languages);
  const highlights = splitLines(e.highlights);
  const included = splitLines(e.included);
  const notIncluded = splitLines(e.notIncluded);
  const lat = e.latitude ?? e.city.latitude;
  const lng = e.longitude ?? e.city.longitude;

  const facts = [
    { icon: "⏱", label: "Duration", value: durationLabel(e.durationHours) },
    { icon: "👥", label: "Group size", value: e.maxGroupSize ? `Up to ${e.maxGroupSize} people` : null },
    { icon: "🗣", label: "Languages", value: languages.join(", ") || null },
    { icon: "🔒", label: "Format", value: e.isPrivate ? "Private — just your group" : "Small group" },
  ].filter((f) => f.value);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[
        { href: "/", label: "Home" },
        { href: routes.country(e.city.country.slug), label: e.city.country.name },
        { href: routes.city(e.city.country.slug, e.city.slug), label: e.city.name },
        { label: e.title },
      ]} />

      {e.category && (
        <Link href={routes.experiences({ category: e.category.slug })} className="text-sm font-semibold uppercase tracking-widest text-clay">
          {e.category.icon} {e.category.name}
        </Link>
      )}
      <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{e.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-600">
        <Rating average={e.ratingAverage} count={e.reviewCount} />
        <span>·</span>
        <span>{e.city.name}, {e.city.country.name}</span>
        {e.host && <><span>·</span><Link href={routes.host(e.host.slug)} className="hover:text-clay">Hosted by {e.host.name}</Link></>}
      </div>

      <Cover src={e.imageUrl} alt={e.title} className="mt-6 h-72 w-full rounded-3xl sm:h-[28rem]" />

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-12">
          {e.summary && <p className="text-xl text-stone-700">{e.summary}</p>}

          {facts.length > 0 && (
            <dl className="grid gap-4 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                  <span className="text-xl">{f.icon}</span>
                  <div><dt className="text-xs text-stone-500">{f.label}</dt><dd className="font-semibold">{f.value}</dd></div>
                </div>
              ))}
            </dl>
          )}

          {highlights.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold">Highlights</h2>
              <ul className="space-y-2">
                {highlights.map((h) => <li key={h} className="flex gap-3"><span className="text-clay">✦</span>{h}</li>)}
              </ul>
            </section>
          )}

          {e.description && (
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold">About this experience</h2>
              <div className="whitespace-pre-line text-lg leading-relaxed text-stone-700">{e.description}</div>
            </section>
          )}

          {e.steps.length > 0 && (
            <section>
              <h2 className="mb-6 font-display text-2xl font-semibold">Itinerary</h2>
              <StepsTimeline steps={e.steps} />
            </section>
          )}

          {(included.length > 0 || notIncluded.length > 0) && (
            <section className="grid gap-6 sm:grid-cols-2">
              {included.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold">What&apos;s included</h2>
                  <ul className="space-y-1">{included.map((x) => <li key={x}><span className="text-emerald-600">✓</span> {x}</li>)}</ul>
                </div>
              )}
              {notIncluded.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold">Not included</h2>
                  <ul className="space-y-1 text-stone-600">{notIncluded.map((x) => <li key={x}><span className="text-stone-400">✕</span> {x}</li>)}</ul>
                </div>
              )}
            </section>
          )}

          {(e.meetingPoint || e.cancellationPolicy) && (
            <section className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-stone-200">
              {e.meetingPoint && (
                <div>
                  <h2 className="font-semibold">📍 Meeting point</h2>
                  <p className="text-stone-700">{e.meetingPoint}</p>
                  {lat !== null && lng !== null && (
                    <a className="text-sm text-sea hover:underline" target="_blank" rel="noreferrer"
                      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}>Open in map ↗</a>
                  )}
                </div>
              )}
              {e.cancellationPolicy && (
                <div><h2 className="font-semibold">↩︎ Cancellation</h2><p className="text-stone-700">{e.cancellationPolicy}</p></div>
              )}
            </section>
          )}

          {e.host && (
            <section className="rounded-2xl bg-sand p-6 ring-1 ring-stone-200">
              <h2 className="mb-4 font-display text-2xl font-semibold">Meet your host</h2>
              <div className="flex gap-4">
                <Avatar name={e.host.name} src={e.host.avatarUrl} size={72} />
                <div>
                  <p className="text-lg font-semibold">{e.host.name} {e.host.verified && <span className="text-sm text-sea">✔ Verified</span>}</p>
                  {e.host.tagline && <p className="text-stone-600">{e.host.tagline}</p>}
                  {e.host.bio && <p className="mt-2 line-clamp-4 text-stone-700">{e.host.bio}</p>}
                  <Link href={routes.host(e.host.slug)} className="mt-2 inline-block text-sm font-semibold text-clay">View profile →</Link>
                </div>
              </div>
            </section>
          )}

          <section id="reviews" className="scroll-mt-24 space-y-8">
            <h2 className="font-display text-2xl font-semibold">Reviews</h2>
            <ReviewSummary average={reviews.average} count={reviews.count} distribution={reviews.distribution} />
            <ReviewList reviews={reviews.reviews} />
            <GuestReviewForm experienceId={e.id} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm experienceId={e.id} price={e.price} currency={e.currency} pricingType={e.pricingType} maxGroupSize={e.maxGroupSize} priceText={price} />
        </aside>
      </div>

      {related.filter((r) => r.id !== e.id).length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold">More in {e.city.name}</h2>
          <ExperienceGrid items={related.filter((r) => r.id !== e.id).slice(0, 3)} showPlace={false} />
        </section>
      )}
    </article>
  );
}
