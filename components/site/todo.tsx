import { cn } from "@/lib/utils";

/**
 * A visible marker for a fact Nate still has to confirm or update. Dashed and
 * neutral (never the accent), so it reads as a placeholder, not as data.
 */
export function Todo({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-(--tag-radius) border border-dashed border-current/50 px-2 py-px align-middle text-[11px] leading-4 font-medium text-subtle-foreground",
        className,
      )}
    >
      <span>TODO: {children}</span>
    </span>
  );
}
