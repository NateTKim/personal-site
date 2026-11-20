import { cn } from "@/lib/utils";

type Size = "lg" | "sm";

/** The three title-bar dots. Their colors come from the direction (--dot-1..3). */
export function WindowDots({ size = "lg", className }: { size?: Size; className?: string }) {
  const dot = cn(
    "rounded-full shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.08)]",
    size === "sm" ? "size-2" : "size-2.5",
  );
  return (
    <span aria-hidden className={cn("flex shrink-0", size === "sm" ? "gap-1.5" : "gap-2", className)}>
      <span className={cn(dot, "bg-(--dot-1)")} />
      <span className={cn(dot, "bg-(--dot-2)")} />
      <span className={cn(dot, "bg-(--dot-3)")} />
    </span>
  );
}

/**
 * The site's recurring container: a dark window with a title bar (three dots,
 * optional centered title), a thin translucent border and a faint top highlight.
 * `sm` is the nested, smaller window used inside cards.
 */
export function WindowFrame({
  title,
  size = "lg",
  className,
  bodyClassName,
  children,
}: {
  title?: string;
  size?: Size;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const sm = size === "sm";
  return (
    <div
      className={cn(
        "overflow-clip border border-frame-border",
        "shadow-[inset_0_1px_0_0_var(--frame-highlight)]",
        sm
          ? "rounded-(--frame-radius-sm) bg-frame-inner"
          : "rounded-(--frame-radius) bg-frame shadow-[inset_0_1px_0_0_var(--frame-highlight),0_40px_80px_-40px_rgb(0_0_0/0.75)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center border-b border-frame-divider bg-frame-bar",
          sm ? "h-7 px-2.5" : "h-9 px-3.5",
        )}
      >
        <WindowDots size={size} />
        {title && (
          <p
            className={cn(
              "pointer-events-none absolute inset-x-16 truncate text-center label-text text-subtle-foreground",
            )}
          >
            {title}
          </p>
        )}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
