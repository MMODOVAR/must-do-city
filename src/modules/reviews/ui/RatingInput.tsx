"use client";

import { useState } from "react";

export function RatingInput({ name = "rating", defaultValue = 0 }: { name?: string; defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setValue(n)}
          className={`text-3xl transition ${(hover || value) >= n ? "text-amber-500" : "text-stone-300"}`}>
          ★
        </button>
      ))}
      <input type="hidden" name={name} value={value || ""} />
    </div>
  );
}
