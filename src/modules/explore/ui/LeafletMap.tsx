"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";
import Link from "next/link";
import type { MapCity } from "../domain";

/**
 * Map tiles. Defaults need no API key: OpenStreetMap, with Esri as an automatic
 * fallback if OSM tiles fail to load. Set NEXT_PUBLIC_MAP_TILE_URL (and
 * NEXT_PUBLIC_MAP_ATTRIBUTION) to use your own provider in production.
 */
const OSM = "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors";
const TILE_SOURCES = process.env.NEXT_PUBLIC_MAP_TILE_URL
  ? [{ url: process.env.NEXT_PUBLIC_MAP_TILE_URL, attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || OSM }]
  : [
      { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: OSM },
      {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
      },
    ];
const MAX_TILE_ERRORS = 4;

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
  const [source, setSource] = useState(0);
  const tileErrors = useRef(0);
  const tiles = TILE_SOURCES[source];

  // Switch to the next tile provider if the current one keeps failing.
  const onTileError = () => {
    if (++tileErrors.current >= MAX_TILE_ERRORS && source < TILE_SOURCES.length - 1) {
      tileErrors.current = 0;
      setSource((s) => s + 1);
    }
  };

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
      <TileLayer key={tiles.url} url={tiles.url} attribution={tiles.attribution} maxZoom={19} eventHandlers={{ tileerror: onTileError }} />
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
