import type { ExperienceStep } from "@prisma/client";

export function StepsTimeline({ steps }: { steps: ExperienceStep[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-dashed border-orange-200 pl-8">
      {steps.map((s) => (
        <li key={s.id} className="relative">
          <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-clay text-sm font-bold text-white">
            {s.order}
          </span>
          <h3 className="text-lg font-semibold">{s.title}</h3>
          <p className="text-sm text-stone-500">{[s.location, s.duration].filter(Boolean).join(" · ")}</p>
          {s.description && <p className="mt-2 text-stone-700">{s.description}</p>}
        </li>
      ))}
    </ol>
  );
}
