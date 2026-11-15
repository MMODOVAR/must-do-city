export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const full = Math.round(value);
  return (
    <span className={`inline-flex text-amber-500 ${size === "lg" ? "text-xl" : "text-sm"}`} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "" : "text-stone-300"}>★</span>
      ))}
    </span>
  );
}

export function Rating({ average, count }: { average: number; count: number }) {
  if (!count) return <span className="text-sm text-stone-500">New</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-500">★</span>
      <span className="font-semibold">{average.toFixed(1)}</span>
      <span className="text-stone-500">({count})</span>
    </span>
  );
}
