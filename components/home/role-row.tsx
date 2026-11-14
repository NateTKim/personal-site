import { Plus } from "lucide-react";
import type { Role } from "@/content/site";

/**
 * Brittany Chiang-style experience row that expands in place (family.co).
 * Native <details>, so it opens with a keyboard, a screen reader, or JS off.
 */
export function RoleRow({ role }: { role: Role }) {
  return (
    <li data-reveal>
      <details className="expand group rounded-2xl ring-1 ring-transparent transition-[background-color,box-shadow] duration-200 open:bg-card open:shadow-card open:ring-sand-900/8 hover:bg-card hover:shadow-card hover:ring-sand-900/8">
        <summary className="grid gap-x-8 gap-y-2 rounded-2xl p-4 sm:grid-cols-[9.5rem_1fr] sm:p-6">
          <p className="pt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {role.dates}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
                {role.title} · <span className="text-brand-700">{role.company}</span>
                <span className="block text-sm font-normal text-muted-foreground">{role.location}</span>
              </h3>
              <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-sand-600">
                <span className="hidden group-open:inline">Less</span>
                <span className="group-open:hidden">Details</span>
                <Plus className="expand-icon size-4" aria-hidden />
              </span>
            </div>
            <p className="max-w-[65ch] text-[15px] leading-7 text-sand-700">{role.summary}</p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Tools">
              {role.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </summary>
        <div className="px-4 pb-5 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-x-8 sm:px-6 sm:pb-6">
          <ul className="flex flex-col gap-3 border-t border-border pt-4 sm:col-start-2">
            {role.bullets.map((b) => (
              <li key={b} className="flex max-w-[70ch] gap-3 text-[15px] leading-7 text-foreground/90">
                <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}
