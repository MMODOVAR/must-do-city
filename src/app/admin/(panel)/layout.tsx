import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/countries", label: "Countries" },
  { href: "/admin/cities", label: "Cities" },
  { href: "/admin/journeys", label: "Journeys" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-stone-100 md:flex">
      <aside className="border-b border-stone-200 bg-white md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="p-5">
          <Link href="/admin" className="font-display text-xl font-bold">
            Must Do <span className="text-clay">City</span>
          </Link>
          <p className="text-xs text-stone-500">Back office</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
              {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100">
            View site ↗
          </Link>
        </nav>
        <div className="border-t border-stone-200 p-4 text-xs text-stone-500">
          <p className="truncate">{admin.email}</p>
          <form action={logout}>
            <button className="mt-2 font-medium text-clay hover:underline">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
