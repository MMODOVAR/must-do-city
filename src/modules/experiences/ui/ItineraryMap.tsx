"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";
import { TileLayerWithFallback } from "@/modules/shared/map/TileLayerWithFallback";

export type MapStop = { key: string; label: string; title: string; lat: number; lng: number; kind: "start" | "stop" };

function icon(stop: MapStop, active: boolean) {
  const cls = `stop-pin ${stop.kind === "start" ? "stop-pin--start" : ""} ${active ? "stop-pin--active" : ""}`;
  return L.divIcon({ className: "", iconSize: [30, 30], iconAnchor: [15, 15], html: `<span class="${cls}">${stop.label}</span>` });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 15);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [30, 30], maxZoom: 16 });
  }, [map, points]);
  return null;
}

/** Recentre on the highlighted stop without changing the zoom. */
function FollowActive({ stop }: { stop?: MapStop }) {
  const map = useMap();
  useEffect(() => {
    if (stop && !map.getBounds().pad(-0.15).contains([stop.lat, stop.lng])) map.panTo([stop.lat, stop.lng]);
  }, [map, stop]);
  return null;
}

export default function ItineraryMap({ stops, active, onSelect }: { stops: MapStop[]; active: string | null; onSelect: (key: string) => void }) {
  const points = useMemo(() => stops.map((s) => [s.lat, s.lng] as [number, number]), [stops]);
  return (
    <MapContainer center={points[0]} zoom={14} scrollWheelZoom={false} className="h-full w-full">
      <TileLayerWithFallback />
      <FitBounds points={points} />
      <FollowActive stop={stops.find((s) => s.key === active)} />
      {points.length > 1 && <Polyline positions={points} pathOptions={{ color: "#c2410c", weight: 3, dashArray: "6 8", opacity: 0.8 }} />}
      {stops.map((s) => (
        <Marker key={s.key} position={[s.lat, s.lng]} icon={icon(s, s.key === active)} zIndexOffset={s.key === active ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(s.key), mouseover: () => onSelect(s.key) }}>
          <Tooltip direction="top" offset={[0, -14]}>{s.title}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
