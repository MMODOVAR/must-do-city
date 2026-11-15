"use client";

import { useRef, useState } from "react";
import { TileLayer } from "react-leaflet";

/**
 * Map tiles. Defaults need no API key: OpenStreetMap, with Esri as an automatic
 * fallback if OSM tiles fail to load. Set NEXT_PUBLIC_MAP_TILE_URL (and
 * NEXT_PUBLIC_MAP_ATTRIBUTION) to use your own provider in production.
 */
const OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
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

export function TileLayerWithFallback() {
  const [source, setSource] = useState(0);
  const errors = useRef(0);
  const tiles = TILE_SOURCES[source];
  return (
    <TileLayer
      key={tiles.url}
      url={tiles.url}
      attribution={tiles.attribution}
      maxZoom={19}
      eventHandlers={{
        tileerror: () => {
          if (++errors.current >= MAX_TILE_ERRORS && source < TILE_SOURCES.length - 1) {
            errors.current = 0;
            setSource((s) => s + 1);
          }
        },
      }}
    />
  );
}
