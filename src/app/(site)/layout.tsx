import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-sand/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Must Do <span className="text-clay">City</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium text-stone-600">
            <Link href="/#destinations" className="hover:text-ink">Destinations</Link>
            <Link href="/#featured" className="hover:text-ink">Featured</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Must Do City ·{" "}
        <Link href="/admin" className="hover:text-ink">Admin</Link>
      </footer>
    </div>
  );
}
