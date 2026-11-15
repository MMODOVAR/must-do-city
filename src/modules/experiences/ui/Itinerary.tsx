"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { MapStop } from "./ItineraryMap";

const ItineraryMap = dynamic(() => import("./ItineraryMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-[#dfe9ef] text-sm text-stone-500">Loading map…</div>,
});

export type ItineraryStop = {
  id: string;
  order: number;
  title: string;
  location: string | null;
  duration: string | null;
  description: string | null;
  admission: string | null;
  lat: number | null;
  lng: number | null;
};

/**
 * "What to expect": numbered stops on the left, the route on a small map on
 * the side. Hovering a stop highlights it on the map and vice versa.
 */
export function Itinerary({
  stops,
  start,
  end,
}: {
  stops: ItineraryStop[];
  start: { title: string; lat: number | null; lng: number | null } | null;
  end: string | null;
}) {
  const [active, setActive] = useState<string | null>(null);

  const mapStops = useMemo<MapStop[]>(() => {
    const out: MapStop[] = [];
    if (start?.lat != null && start.lng != null) out.push({ key: "start", label: "▶", title: `Start: ${start.title}`, lat: start.lat, lng: start.lng, kind: "start" });
    for (const s of stops) if (s.lat != null && s.lng != null) out.push({ key: s.id, label: String(s.order), title: s.title, lat: s.lat, lng: s.lng, kind: "stop" });
    return out;
  }, [stops, start]);

  const hasMap = mapStops.length > 0;
  const row = (key: string) =>
    `relative rounded-xl p-3 transition ${active === key ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-stone-50"}`;

  return (
    <div className={`grid gap-6 ${hasMap ? "md:grid-cols-[1fr_300px]" : ""}`}>
      <ol className="relative space-y-2 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:border-l-2 before:border-dashed before:border-orange-200">
        {start && (
          <li className={row("start")} onMouseEnter={() => setActive("start")}>
            <div className="flex gap-4">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-white">▶</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Start</p>
                <p className="font-semibold">{start.title}</p>
              </div>
            </div>
          </li>
        )}
        {stops.map((s) => (
          <li key={s.id} id={`stop-${s.order}`} className={row(s.id)} onMouseEnter={() => setActive(s.id)}>
            <div className="flex gap-4">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay text-sm font-bold text-white">{s.order}</span>
              <div className="min-w-0">
                <h3 className="font-semibold">{s.title}</h3>
                {s.location && <p className="text-sm text-stone-500">📍 {s.location}</p>}
                {s.description && <p className="mt-1 text-stone-700">{s.description}</p>}
                <p className="mt-1 text-xs text-stone-500">
                  {[s.duration && `⏱ ${s.duration}`, s.admission && `🎟 ${s.admission}`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </li>
        ))}
        <li className="rounded-xl p-3">
          <div className="flex gap-4">
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-white">■</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">End</p>
              <p className="font-semibold">{end ?? "This experience ends back at the meeting point"}</p>
            </div>
          </div>
        </li>
      </ol>

      {hasMap && (
        <div className="md:order-none order-first">
          <div className="sticky top-32 h-72 overflow-hidden rounded-2xl ring-1 ring-stone-200 md:h-[420px]">
            <ItineraryMap stops={mapStops} active={active} onSelect={setActive} />
          </div>
          <p className="mt-2 text-xs text-stone-500">Numbers on the map match the stops. Route shown is approximate.</p>
        </div>
      )}
    </div>
  );
}
