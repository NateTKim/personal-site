import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * One section of the label-column layout the /work pages and /info share: from
 * 768px the heading sits in a narrow left column beside the content; below that
 * it sits above it. A hairline separates sections.
 */
export function LabelSection({
  id,
  title,
  children,
  className,
}: {
  /** The heading's id (unique on the page); the section is labelled by it. */
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      as="section"
      aria-labelledby={id}
      className={cn(
        "grid gap-x-10 gap-y-4 border-t border-frame-divider py-8 sm:py-10 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-baseline lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]",
        className,
      )}
    >
      <h2 id={id} className="text-xl leading-tight display-type text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="max-w-[46rem] min-w-0">{children}</div>
    </Reveal>
  );
}
