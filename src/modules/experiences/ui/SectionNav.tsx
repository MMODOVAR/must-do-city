/** Sticky in-page tabs (Overview · Meeting point · Itinerary · Reviews). */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <nav className="sticky top-[65px] z-[900] -mx-4 mb-8 overflow-x-auto border-b border-stone-200 bg-sand/95 px-4 backdrop-blur" aria-label="Sections">
      <ul className="flex gap-6 text-sm font-semibold text-stone-600">
        {sections.map((s) => (
          <li key={s.id}><a href={`#${s.id}`} className="inline-block whitespace-nowrap border-b-2 border-transparent py-3 hover:border-clay hover:text-ink">{s.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
