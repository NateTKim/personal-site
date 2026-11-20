/**
 * A big "N× faster" figure above a before/after chart, with the before and
 * after in words beside it. The accent is on the number only. Shared by the
 * Alphaeon and Business-Software cards so both callouts look the same.
 */
export function SpeedupCallout({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className="text-5xl leading-none display-type text-data tabular-nums">{value}</span>
      <span className="text-sm leading-5 text-muted-foreground">{label}</span>
    </p>
  );
}
