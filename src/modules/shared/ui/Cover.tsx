"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

const GRADIENTS = [
  "from-orange-300 via-rose-300 to-amber-200",
  "from-teal-300 via-cyan-200 to-sky-200",
  "from-amber-200 via-orange-300 to-red-300",
  "from-emerald-200 via-teal-300 to-cyan-300",
  "from-fuchsia-200 via-rose-200 to-orange-200",
];

function pick(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

/** Image with a deterministic gradient fallback when no URL is set or the image fails to load. */
export function Cover({
  src,
  alt,
  className = "",
  showLabel = true,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  showLabel?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-end bg-gradient-to-br ${pick(alt)} ${className}`} role="img" aria-label={alt}>
      {showLabel && <span className="p-4 font-display text-3xl font-semibold text-white/80 drop-shadow">{alt}</span>}
    </div>
  );
}
