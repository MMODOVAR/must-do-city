"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import { TileLayerWithFallback } from "@/modules/shared/map/TileLayerWithFallback";
import Link from "next/link";
import type { MapCity } from "../domain";

export type Focus =
  | { kind: "world" }
  | { kind: "country"; points: [number, number][]; center: [number, number] | null }
  | { kind: "city"; city: MapCity };

function hotspotIcon(city: MapCity, selected: boolean) {
  const size = Math.round(Math.min(56, 26 + city.experienceCount * 5));
  const cls = ["hotspot", city.rank ? "hotspot--top" : "", selected ? "hotspot--selected" : ""].join(" ");
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<span class="${cls}" style="--size:${size}px"><span class="hotspot__pulse"></span><span class="hotspot__dot">${city.experienceCount || "•"}</span></span>`,
  });
}

/** On desktop the picker panel covers the left of the map; keep targets clear of it. */
function leftPad(map: L.Map) {
  return map.getSize().x >= 1024 ? 440 : 40;
}

/** Moves the camera whenever the selection changes. */
function CameraController({ focus, all }: { focus: Focus; all: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const pad = { paddingTopLeft: [leftPad(map), 60] as [number, number], paddingBottomRight: [60, 60] as [number, number] };
    const fly = (bounds: L.LatLngBounds, maxZoom: number) => map.flyToBounds(bounds, { ...pad, maxZoom, duration: 1.3 });
    if (focus.kind === "city") fly(L.latLng(focus.city.lat, focus.city.lng).toBounds(8000), 11);
    else if (focus.kind === "country") {
      if (focus.points.length) fly(L.latLngBounds(focus.points), focus.points.length > 1 ? 7 : 8);
      else if (focus.center) fly(L.latLng(focus.center).toBounds(600000), 6);
    } else if (all.length) fly(L.latLngBounds(all), 4);
  }, [focus, all, map]);
  return null;
}

export default function LeafletMap({
  cities,
  focus,
  selectedId,
  onSelect,
}: {
  cities: MapCity[];
  focus: Focus;
  selectedId: string | null;
  onSelect: (city: MapCity) => void;
}) {
  const all = useMemo(() => cities.map((c) => [c.lat, c.lng] as [number, number]), [cities]);
  const markers = useRef(new Map<string, L.Marker>());

  // Open the popup of the selected city once the camera starts moving there.
  useEffect(() => {
    if (selectedId) markers.current.get(selectedId)?.openPopup();
  }, [selectedId]);

  return (
    <MapContainer
      center={[25, 10]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      scrollWheelZoom={false}
      className="h-full w-full"
      zoomControl={false}
      attributionControl
    >
      <ZoomControl position="bottomright" />
      <TileLayerWithFallback />
      <CameraController focus={focus} all={all} />
      {cities.map((c) => (
        <Marker
          key={c.id}
          position={[c.lat, c.lng]}
          icon={hotspotIcon(c, c.id === selectedId)}
          zIndexOffset={c.id === selectedId ? 1000 : c.rank ? 500 : 0}
          title={`${c.name}, ${c.countryName}`}
          eventHandlers={{ click: () => onSelect(c) }}
          ref={(m) => {
            if (m) markers.current.set(c.id, m);
            else markers.current.delete(c.id);
          }}
        >
          <Popup>
            <div className="min-w-44 space-y-1 [&_p]:!m-0">
              {c.rank && <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">#{c.rank} hotspot</p>}
              <p className="font-display text-lg font-semibold leading-tight">{c.name}</p>
              <p className="!m-0 text-xs text-stone-500">{c.countryName}</p>
              {c.tagline && <p className="!m-0 text-sm text-stone-700">{c.tagline}</p>}
              <p className="!m-0 text-xs text-stone-600">
                {c.experienceCount} {c.experienceCount === 1 ? "experience" : "experiences"}
                {c.reviewCount > 0 && <> · ★ {c.ratingAverage.toFixed(1)} ({c.reviewCount})</>}
              </p>
              <Link href={c.href} className="mt-1 inline-block text-sm font-semibold !text-clay">Explore {c.name} →</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
