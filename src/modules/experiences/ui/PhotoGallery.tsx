"use client";

import { useCallback, useEffect, useState } from "react";
import { Cover } from "@/modules/shared/ui/Cover";

type Photo = { url: string; caption: string | null };

/**
 * Viator-style gallery: one large photo plus a 2×2 grid, with a full-screen
 * viewer (arrows, keyboard, thumbnails) for all photos.
 */
export function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const count = photos.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + count) % count)), [count]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  if (count === 0) return <Cover alt={title} className="h-72 w-full rounded-3xl sm:h-[26rem]" />;

  const grid = photos.slice(1, 5);
  // Fill the space whatever the photo count: 1 thumb spans both rows, 3 thumbs → the last spans both columns.
  const cols = grid.length === 0 ? "" : grid.length <= 2 ? "md:grid-cols-[2fr_1fr]" : "md:grid-cols-[2fr_1fr_1fr]";
  const thumbSpan = (i: number) => (grid.length === 1 ? "md:row-span-2" : grid.length === 3 && i === 2 ? "md:col-span-2" : "");
  return (
    <>
      <div className={`relative grid h-72 gap-2 overflow-hidden rounded-3xl sm:h-[26rem] md:grid-rows-2 ${cols}`}>
        <button className="group relative h-full overflow-hidden md:row-span-2" onClick={() => setOpen(0)} aria-label="Open photo 1">
          <Cover src={photos[0].url} alt={photos[0].caption ?? title} showLabel={false} className="h-full w-full transition duration-500 group-hover:scale-105" />
        </button>
        {grid.map((p, i) => (
          <button key={p.url} className={`group relative hidden overflow-hidden md:block ${thumbSpan(i)}`} onClick={() => setOpen(i + 1)} aria-label={`Open photo ${i + 2}`}>
            <Cover src={p.url} alt={p.caption ?? title} showLabel={false} className="h-full w-full transition duration-500 group-hover:scale-105" />
          </button>
        ))}
        <button onClick={() => setOpen(0)} className="absolute bottom-4 right-4 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold shadow-md hover:bg-white">
          ▦ See all {count} {count === 1 ? "photo" : "photos"}
        </button>
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-black/95 text-white" role="dialog" aria-modal aria-label={`${title} photos`}>
          <div className="flex items-center justify-between p-4 text-sm">
            <span>{open + 1} / {count}</span>
            <button onClick={() => setOpen(null)} className="rounded-full px-3 py-1 text-2xl hover:bg-white/10" aria-label="Close">✕</button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
            <Cover key={photos[open].url} src={photos[open].url} alt={photos[open].caption ?? title} className="max-h-full max-w-full rounded-lg object-contain" />
            {count > 1 && (
              <>
                <button onClick={() => go(-1)} className="absolute left-4 rounded-full bg-white/15 px-4 py-3 text-2xl hover:bg-white/25" aria-label="Previous photo">‹</button>
                <button onClick={() => go(1)} className="absolute right-4 rounded-full bg-white/15 px-4 py-3 text-2xl hover:bg-white/25" aria-label="Next photo">›</button>
              </>
            )}
          </div>
          {photos[open].caption && <p className="px-4 pt-3 text-center text-sm text-white/80">{photos[open].caption}</p>}
          <div className="flex justify-center gap-2 overflow-x-auto p-4">
            {photos.map((p, i) => (
              <button key={p.url} onClick={() => setOpen(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 ${i === open ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100"}`} aria-label={`Show photo ${i + 1}`}>
                <Cover src={p.url} alt={p.caption ?? title} showLabel={false} className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
