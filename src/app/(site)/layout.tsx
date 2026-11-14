import Link from "next/link";
import { routes } from "@/modules/shared/routes";

const NAV = [
  { href: routes.experiences(), label: "Experiences" },
  { href: routes.destinations(), label: "Destinations" },
  { href: routes.hosts(), label: "Hosts" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[1000] border-b border-stone-200/70 bg-sand/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="whitespace-nowrap font-display text-xl font-bold tracking-tight sm:text-2xl">
            Must Do <span className="text-clay">City</span>
          </Link>
          <nav className="flex items-center gap-3 text-xs font-medium text-stone-600 sm:gap-6 sm:text-sm">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="hover:text-ink">{n.label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-stone-600 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold text-ink">Must Do <span className="text-clay">City</span></p>
            <p className="mt-2">Private, personal experiences with locals who love their city.</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-ink">Explore</p>
            {NAV.map((n) => <Link key={n.href} href={n.href} className="block hover:text-ink">{n.label}</Link>)}
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-ink">Company</p>
            <Link href="/admin" className="block hover:text-ink">Admin</Link>
            <p className="pt-2 text-xs text-stone-400">© {new Date().getFullYear()} Must Do City</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
