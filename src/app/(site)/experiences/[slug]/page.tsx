import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experiencesService } from "@/modules/experiences/service";
import { admissionLabel, badges, durationLabel, galleryPhotos, priceLabel } from "@/modules/experiences/domain";
import { PhotoGallery } from "@/modules/experiences/ui/PhotoGallery";
import { Itinerary } from "@/modules/experiences/ui/Itinerary";
import { SectionNav } from "@/modules/experiences/ui/SectionNav";
import { ExperienceGrid } from "@/modules/experiences/ui/ExperienceCard";
import { reviewsService } from "@/modules/reviews/service";
import { parseReviewQuery } from "@/modules/reviews/domain";
import { ReviewList } from "@/modules/reviews/ui/ReviewList";
import { RatingFilter, ReviewSortBar, ShowMoreReviews } from "@/modules/reviews/ui/ReviewControls";
import { GuestReviewForm } from "@/modules/reviews/ui/GuestReviewForm";
import { BookingForm } from "@/modules/bookings/ui/BookingForm";
import { Avatar } from "@/modules/shared/ui/Avatar";
import { Rating } from "@/modules/shared/ui/Stars";
import { Breadcrumbs } from "@/modules/shared/ui/Breadcrumbs";
import { routes } from "@/modules/shared/routes";
import { splitLines, splitList } from "@/modules/shared/text";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const e = await experiencesService.findPublished((await params).slug);
  return { title: e?.title ?? "Not found", description: e?.summary ?? undefined };
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-stone-200 pt-8">
      <h2 className="mb-5 font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default async function ExperiencePage({ params, searchParams }: Props) {
  const e = await experiencesService.findPublished((await params).slug);
  if (!e) notFound();

  const reviewQuery = parseReviewQuery(await searchParams);
  const [reviews, related] = await Promise.all([
    reviewsService.forExperience(e.id, reviewQuery),
    experiencesService.inCity(e.city.slug, e.city.country.slug, 4),
  ]);

  const base = routes.experience(e.slug);
  const price = priceLabel(e.price, e.currency, e.pricingType);
  const photos = galleryPhotos(e);
  const earned = badges(e);
  const languages = splitList(e.languages);
  const highlights = splitLines(e.highlights);
  const included = splitLines(e.included);
  const notIncluded = splitLines(e.notIncluded);
  const additionalInfo = splitLines(e.additionalInfo);
  const meetLat = e.latitude ?? e.city.latitude;
  const meetLng = e.longitude ?? e.city.longitude;
  const freeCancellation = earned.includes("Free cancellation");
  const others = related.filter((r) => r.id !== e.id).slice(0, 3);

  const facts = [
    { icon: "⏱", label: durationLabel(e.durationHours) },
    { icon: "🕘", label: e.startTime ? `Starts ${e.startTime}` : null },
    { icon: "👥", label: e.maxGroupSize ? `Up to ${e.maxGroupSize} people` : null },
    { icon: "🗣", label: languages.length ? `Offered in ${languages.join(", ")}` : null },
    { icon: "🔒", label: e.isPrivate ? "Private tour" : "Small group" },
    { icon: "📱", label: "Mobile confirmation" },
  ].filter((f) => f.label);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[
        { href: "/", label: "Home" },
        { href: routes.country(e.city.country.slug), label: e.city.country.name },
        { href: routes.city(e.city.country.slug, e.city.slug), label: e.city.name },
        { label: e.title },
      ]} />

      {/* ---------- Header ---------- */}
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{e.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-600">
          {earned.map((b) => (
            <span key={b} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b === "Top rated" ? "bg-amber-100 text-amber-800" : "bg-stone-200/70 text-stone-700"}`}>{b}</span>
          ))}
          <a href="#reviews" className="hover:text-ink"><Rating average={e.ratingAverage} count={e.reviewCount} /></a>
          <span>📍 {e.city.name}, {e.city.country.name}</span>
          {e.category && (
            <Link href={routes.experiences({ category: e.category.slug })} className="hover:text-clay">{e.category.icon} {e.category.name}</Link>
          )}
        </div>
      </header>

      {/* ---------- Photos ---------- */}
      <PhotoGallery photos={photos} title={e.title} />

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <SectionNav sections={[
            { id: "overview", label: "Overview" },
            { id: "included", label: "What's included" },
            { id: "meeting", label: "Meeting point" },
            { id: "itinerary", label: "What to expect" },
            { id: "info", label: "Additional info" },
            { id: "reviews", label: `Reviews (${reviews.count})` },
          ]} />

          <div className="space-y-10">
            {/* ---------- Overview ---------- */}
            <section id="overview" className="scroll-mt-32 space-y-6">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-stone-700">
                {facts.map((f) => <li key={f.icon}>{f.icon} {f.label}</li>)}
              </ul>
              {e.summary && <p className="text-xl text-stone-800">{e.summary}</p>}
              {e.description && <div className="whitespace-pre-line text-lg leading-relaxed text-stone-700">{e.description}</div>}
              {highlights.length > 0 && (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
                  <h3 className="mb-3 font-semibold">Highlights</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-clay">✦</span>{h}</li>)}
                  </ul>
                </div>
              )}
            </section>

            {/* ---------- Included ---------- */}
            {(included.length > 0 || notIncluded.length > 0) && (
              <Section id="included" title="What's included">
                <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {included.map((x) => <li key={x} className="flex gap-2"><span className="text-emerald-600">✓</span>{x}</li>)}
                  {notIncluded.map((x) => <li key={x} className="flex gap-2 text-stone-600"><span className="text-stone-400">✕</span>{x}</li>)}
                </ul>
              </Section>
            )}

            {/* ---------- Meeting point ---------- */}
            <Section id="meeting" title="Meeting and pickup">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold">📍 Meeting point</h3>
                  <p className="mt-1 text-stone-700">{e.meetingPoint ?? `Your host will share the exact spot in ${e.city.name} after booking.`}</p>
                  {meetLat !== null && meetLng !== null && (
                    <a className="mt-2 inline-block text-sm font-semibold text-sea hover:underline" target="_blank" rel="noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${meetLat},${meetLng}`}>Open in Google Maps ↗</a>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">🏁 End point</h3>
                  <p className="mt-1 text-stone-700">{e.endPoint ?? "This experience ends back at the meeting point."}</p>
                </div>
                {e.startTime && (
                  <div>
                    <h3 className="font-semibold">🕘 Start time</h3>
                    <p className="mt-1 text-stone-700">{e.startTime} — times can be adjusted with your host for private tours.</p>
                  </div>
                )}
              </div>
            </Section>

            {/* ---------- Itinerary ---------- */}
            {e.steps.length > 0 && (
              <Section id="itinerary" title="What to expect">
                <Itinerary
                  start={e.meetingPoint ? { title: e.meetingPoint, lat: e.latitude, lng: e.longitude } : null}
                  end={e.endPoint}
                  stops={e.steps.map((s) => ({
                    id: s.id, order: s.order, title: s.title, location: s.location, duration: s.duration,
                    description: s.description, admission: admissionLabel(s.admission), lat: s.latitude, lng: s.longitude,
                  }))}
                />
              </Section>
            )}

            {/* ---------- Additional info & policy ---------- */}
            {(additionalInfo.length > 0 || e.cancellationPolicy) && (
              <Section id="info" title="Additional info">
                {additionalInfo.length > 0 && (
                  <ul className="grid list-disc gap-2 pl-5 text-stone-700 sm:grid-cols-2">
                    {additionalInfo.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                )}
                {e.cancellationPolicy && (
                  <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
                    <h3 className="font-semibold">↩︎ Cancellation policy</h3>
                    <p className="mt-1 text-stone-700">{e.cancellationPolicy}</p>
                  </div>
                )}
              </Section>
            )}

            {/* ---------- Host ---------- */}
            {e.host && (
              <Section title="Meet your host">
                <div className="flex gap-4">
                  <Avatar name={e.host.name} src={e.host.avatarUrl} size={72} />
                  <div>
                    <p className="text-lg font-semibold">{e.host.name} {e.host.verified && <span className="text-sm text-sea">✔ Verified</span>}</p>
                    {e.host.tagline && <p className="text-stone-600">{e.host.tagline}</p>}
                    {e.host.bio && <p className="mt-2 line-clamp-4 text-stone-700">{e.host.bio}</p>}
                    <Link href={routes.host(e.host.slug)} className="mt-2 inline-block text-sm font-semibold text-clay">View profile →</Link>
                  </div>
                </div>
              </Section>
            )}

            {/* ---------- Reviews ---------- */}
            <Section id="reviews" title="Reviews">
              <div className="space-y-6">
                <RatingFilter base={base} query={reviews.query} distribution={reviews.distribution} average={reviews.average} count={reviews.count} />
                {reviews.count > 0 && <ReviewSortBar base={base} query={reviews.query} shown={reviews.reviews.length} total={reviews.total} />}
                <ReviewList reviews={reviews.reviews} />
                <div className="flex flex-wrap gap-3">
                  <ShowMoreReviews base={base} query={reviews.query} shown={reviews.reviews.length} total={reviews.total} />
                  <GuestReviewForm experienceId={e.id} />
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* ---------- Booking ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm experienceId={e.id} price={e.price} currency={e.currency} pricingType={e.pricingType}
            maxGroupSize={e.maxGroupSize} priceText={price} freeCancellation={freeCancellation} />
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold">You might also like in {e.city.name}</h2>
          <ExperienceGrid items={others} showPlace={false} />
        </section>
      )}
    </article>
  );
}
