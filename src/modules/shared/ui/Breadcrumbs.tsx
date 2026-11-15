import Link from "next/link";

export function Breadcrumbs({ items, light }: { items: { href?: string; label: string }[]; light?: boolean }) {
  return (
    <nav className={`mb-3 text-sm ${light ? "text-white/80" : "text-stone-500"}`} aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && " / "}
          {it.href ? <Link href={it.href} className={light ? "hover:text-white" : "hover:text-ink"}>{it.label}</Link> : it.label}
        </span>
      ))}
    </nav>
  );
}
