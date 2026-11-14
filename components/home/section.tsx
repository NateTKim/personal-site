import { cn } from "@/lib/utils";

/** One headline, one block of content (Fey-style). */
export function Section({
  id,
  kicker,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28", className)}
    >
      <div data-reveal className="max-w-2xl">
        {kicker && <p className="text-sm font-medium text-brand-700">{kicker}</p>}
        <h2
          id={`${id}-title`}
          className="mt-2 font-display text-4xl font-medium tracking-tight text-balance text-foreground sm:text-5xl"
        >
          {title}
        </h2>
        {intro && (
          <div className="mt-4 text-base leading-7 text-sand-700 sm:text-lg sm:leading-8">{intro}</div>
        )}
      </div>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}
