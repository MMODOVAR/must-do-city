import type { Metadata } from "next";
import { hostsService } from "@/modules/hosts/service";
import { HostCard } from "@/modules/hosts/ui/HostCard";

export const metadata: Metadata = { title: "Local hosts" };

export default async function HostsPage() {
  const hosts = await hostsService.listPublished();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Meet the locals</h1>
      <p className="mt-3 text-lg text-stone-600">The people who make every experience personal.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hosts.map((h) => <HostCard key={h.id} host={h} />)}
      </div>
      {hosts.length === 0 && <p className="text-stone-500">No hosts yet.</p>}
    </div>
  );
}
