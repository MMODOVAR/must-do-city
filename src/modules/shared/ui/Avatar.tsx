/* eslint-disable @next/next/no-img-element */
import { initials } from "../text";

const COLORS = ["bg-clay", "bg-sea", "bg-amber-600", "bg-rose-600", "bg-indigo-600", "bg-emerald-700"];

export function Avatar({ name, src, size = 48 }: { name: string; src?: string | null; size?: number }) {
  const style = { width: size, height: size };
  if (src) return <img src={src} alt={name} style={style} className="shrink-0 rounded-full object-cover" />;
  const color = COLORS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % COLORS.length];
  return (
    <span
      style={{ ...style, fontSize: size * 0.38 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color}`}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
