import Link from "next/link";

export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-block text-sm text-stone-500 hover:text-ink">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
        {action && <Link href={action.href} className="btn-primary">{action.label}</Link>}
      </div>
    </div>
  );
}

export function StatusPill({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Published</span>
  ) : (
    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">Draft</span>
  );
}
