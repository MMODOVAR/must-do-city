"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { MapCity, MapData } from "../domain";
import type { Focus } from "./LeafletMap";

// Leaflet touches `window`, so the map is rendered on the client only.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-[#dfe9ef] text-sm text-stone-500">Loading map…</div>,
});

export function ExploreMap({ data }: { data: MapData }) {
  const byId = useMemo(() => new Map(data.cities.map((c) => [c.id, c])), [data.cities]);
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [focus, setFocus] = useState<Focus>({ kind: "world" });

  const country = data.countries.find((c) => c.id === countryId);
  const city = cityId ? byId.get(cityId) : undefined;
  const cityOptions = country ? country.cityIds.map((id) => byId.get(id)!).filter(Boolean) : data.cities;
  const top = data.topHotspots.map((id) => byId.get(id)!).filter(Boolean);

  function chooseCountry(id: string) {
    setCountryId(id);
    setCityId("");
    const c = data.countries.find((x) => x.id === id);
    setFocus(c ? { kind: "country", center: c.center, points: c.cityIds.map((cid) => byId.get(cid)!).filter(Boolean).map((x) => [x.lat, x.lng]) } : { kind: "world" });
  }

  function chooseCity(c: MapCity | undefined) {
    if (!c) return chooseCountry(countryId);
    setCountryId(c.countryId);
    setCityId(c.id);
    setFocus({ kind: "city", city: c });
  }

  function reset() {
    setCountryId("");
    setCityId("");
    setFocus({ kind: "world" });
  }

  return (
    <div className="relative">
      <div className="h-[62vh] min-h-[420px] w-full overflow-hidden lg:h-[76vh]">
        <LeafletMap cities={data.cities} focus={focus} selectedId={cityId || null} onSelect={chooseCity} />
      </div>

      {/* Picker panel: floats over the map on desktop, stacks under it on mobile */}
      <div className="relative z-[500] mx-auto mt-4 max-w-6xl px-4 lg:absolute lg:inset-y-0 lg:left-0 lg:right-auto lg:mt-0 lg:flex lg:w-[400px] lg:items-center lg:px-6">
        <div className="w-full rounded-3xl bg-white/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">Explore with locals</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight">Where do you want to go?</h1>

          <div className="mt-5 space-y-3">
            <div>
              <label htmlFor="map-country" className="label">Country</label>
              <select id="map-country" className="input" value={countryId} onChange={(e) => chooseCountry(e.target.value)}>
                <option value="">All countries</option>
                {data.countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="map-city" className="label">City</label>
              <select id="map-city" className="input" value={cityId} onChange={(e) => chooseCity(byId.get(e.target.value))}>
                <option value="">{country ? `All cities in ${country.name}` : "All cities"}</option>
                {cityOptions.map((c) => <option key={c.id} value={c.id}>{c.name}{country ? "" : `, ${c.countryName}`}</option>)}
              </select>
            </div>
          </div>

          {city ? (
            <div className="mt-5 rounded-2xl bg-sand p-4">
              <p className="font-display text-xl font-semibold">{city.name}</p>
              {city.tagline && <p className="text-sm text-stone-600">{city.tagline}</p>}
              <p className="mt-1 text-xs text-stone-500">
                {city.experienceCount} {city.experienceCount === 1 ? "experience" : "experiences"}
                {city.reviewCount > 0 && <> · ★ {city.ratingAverage.toFixed(1)}</>}
              </p>
              <div className="mt-3 flex gap-2">
                <Link href={city.href} className="btn-primary flex-1">Explore {city.name}</Link>
                <button className="btn-ghost" onClick={reset} aria-label="Reset map">↺</button>
              </div>
            </div>
          ) : country ? (
            <div className="mt-5 flex gap-2">
              <Link href={country.href} className="btn-primary flex-1">Discover {country.name}</Link>
              <button className="btn-ghost" onClick={reset} aria-label="Reset map">↺</button>
            </div>
          ) : (
            <Link href="/experiences" className="btn-primary mt-5 w-full">Browse all experiences</Link>
          )}

          {top.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">🔥 Top hotspots</p>
              <div className="flex flex-wrap gap-2">
                {top.map((c) => (
                  <button key={c.id} onClick={() => chooseCity(c)}
                    className={`rounded-full border px-3 py-1 text-sm transition ${c.id === cityId ? "border-clay bg-clay text-white" : "border-stone-200 bg-white hover:border-clay hover:text-clay"}`}>
                    <span className="mr-1 text-xs opacity-60">{c.rank}</span>{c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
