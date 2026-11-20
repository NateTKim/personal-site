import { FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The production repositories as one bordered group, captioned with the ticket
 * count: the tickets were spread across all of them. The master gives how many
 * repos there were and their stacks, but not their names, which stack is in
 * which repo, per-repo counts or links between them. So the repos are drawn as
 * identical, unlabeled glyphs (decoration: the caption already says how many)
 * and the stacks are listed on their own. The group's border is neutral; the
 * accent is on the number only.
 *
 * Given extra height (e.g. `lg:flex-1` beside a taller chart), the caption stays
 * at the top, the stacks at the bottom, and the glyphs center between them.
 */
export function RepoDiagram({
  id,
  count,
  label,
  repoCount,
  stacks,
  className,
}: {
  /** Unique on the page; ties the group to its caption. */
  id: string;
  count: string;
  label: string;
  repoCount: number;
  stacks: readonly string[];
  className?: string;
}) {
  const captionId = `${id}-caption`;
  const stacksId = `${id}-stacks`;
  return (
    <div
      role="group"
      aria-labelledby={captionId}
      className={cn(
        "flex flex-col rounded-(--frame-radius-sm) border border-frame-border p-3 sm:p-4",
        className,
      )}
    >
      <p id={captionId} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 px-0.5">
        <span className="text-[2rem] leading-none display-type text-data tabular-nums">{count}</span>
        <span className="text-sm leading-5 text-muted-foreground">{label}</span>
      </p>
      <div className="flex flex-1 flex-col justify-center py-4">
        <div
          aria-hidden
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${repoCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: repoCount }, (_, i) => (
            <span
              key={i}
              className="grid h-14 place-items-center rounded-[calc(var(--frame-radius-sm)*0.6)] bg-white/[0.035] sm:h-20 lg:h-24"
            >
              <FolderGit2 className="size-5 text-subtle-foreground lg:size-6" />
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-0.5">
        <p id={stacksId} className="label-text text-subtle-foreground">
          Stacks
        </p>
        <ul aria-labelledby={stacksId} className="flex flex-wrap gap-1.5">
          {stacks.map((s) => (
            <li
              key={s}
              className="rounded-(--tag-radius) border border-frame-border bg-white/[0.02] px-2.5 py-1 text-[13px] leading-5 text-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
