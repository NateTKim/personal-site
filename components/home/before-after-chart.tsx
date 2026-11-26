import type { Duration, TimeRow } from "@/content/work";
import { cn } from "@/lib/utils";

/** The shared scale of one chart: its end, and the minute marks on the axis. */
type Scale = { maxSeconds: number; minutes: readonly number[] };

const pctOf = (scale: Scale) => (seconds: number) => `${(seconds / scale.maxSeconds) * 100}%`;

/**
 * Before/after bars, hand-written SVG rendered on the server: no JavaScript,
 * nothing to download, visible with JS off. The words are a real <dl> (task,
 * then the before and after values as the resume states them), so screen
 * readers and no-JS readers get the data as text; the bars and the axis are
 * decoration (aria-hidden). Bars use percentage widths and fixed pixel
 * heights, so the text never shrinks on small screens.
 *
 * Honesty rules: every bar in a chart shares one scale that starts at zero; a
 * range is drawn as a range (solid to its low end, hatched to its high end), an
 * upper bound is drawn at the bound, and a removed step gets no bar and no track:
 * a marker at zero with its words on the bar's row (the step no longer exists, it
 * doesn't take "almost no time", and there is no number to draw). The accent
 * color marks the "after" state only.
 */
export function BeforeAfterChart({
  id,
  rows,
  maxSeconds = 300,
  minutes = [0, 1, 2, 3, 4, 5],
  className,
}: {
  /** Unique on the page; scopes the SVG pattern id. */
  id: string;
  rows: readonly TimeRow[];
  /** End of the shared scale, in seconds (default: 5 minutes). */
  maxSeconds?: number;
  /** Minute marks on the axis; the first is 0 and the last is the end. */
  minutes?: readonly number[];
  className?: string;
}) {
  const scale: Scale = { maxSeconds, minutes };
  const pct = pctOf(scale);
  const hatchId = `${id}-range`;
  return (
    <div className={cn("flex flex-col", className)}>
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs>
          <pattern
            id={hatchId}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="2" height="5" className="fill-(--bar-before)" />
          </pattern>
        </defs>
      </svg>

      <dl className="flex flex-col gap-6">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col gap-3">
            <dt className="text-sm leading-5 font-medium text-foreground">{row.task}</dt>
            <Measure label="Before" value={row.before} hatchId={hatchId} scale={scale} />
            <Measure label="After" value={row.after} hatchId={hatchId} scale={scale} after />
          </div>
        ))}
      </dl>

      <svg aria-hidden className="mt-3 block h-4 w-full overflow-visible label-text tabular-nums">
        {minutes.map((m, i) => (
          <text
            key={m}
            x={pct(m * 60)}
            y="11"
            textAnchor={i === 0 ? "start" : i === minutes.length - 1 ? "end" : "middle"}
            className="fill-subtle-foreground"
          >
            {i === minutes.length - 1 ? `${m} min` : m}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Measure({
  label,
  value,
  hatchId,
  scale,
  after = false,
}: {
  label: string;
  value: Duration;
  hatchId: string;
  scale: Scale;
  after?: boolean;
}) {
  const valueClass = cn(
    "text-xs leading-4 tabular-nums",
    after ? "font-medium text-data" : "text-foreground",
  );
  if (value.kind === "removed") {
    return (
      <dd className="flex flex-col gap-1.5">
        <p className="label-text text-subtle-foreground">
          {label}
          <span className="sr-only">:</span>
        </p>
        {/* In place of the bar: a marker at zero, then the words, on one row (no track). */}
        <p className="flex items-center gap-2">
          <span aria-hidden className="h-3.5 w-0.5 shrink-0 rounded-full bg-data" />
          <span className={valueClass}>{value.label}</span>
        </p>
      </dd>
    );
  }
  return (
    <dd className="flex flex-col gap-1.5">
      {/* Wraps the value under the label when both don't fit on one line. */}
      <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="label-text text-subtle-foreground">
          {label}
          <span className="sr-only">:</span>
        </span>
        <span className={valueClass}>{value.label}</span>
      </p>
      <Bar value={value} hatchId={hatchId} scale={scale} after={after} />
    </dd>
  );
}

function Bar({
  value,
  hatchId,
  scale,
  after,
}: {
  value: Exclude<Duration, { kind: "removed" }>;
  hatchId: string;
  scale: Scale;
  after: boolean;
}) {
  const pct = pctOf(scale);
  const fill = after ? "fill-data" : "fill-(--bar-before)";
  return (
    <svg aria-hidden className="block h-2 w-full overflow-visible">
      {/* The track: the whole scale, from zero. */}
      <rect width="100%" height="100%" rx="1.5" className="fill-white/[0.06]" />

      {value.kind === "range" && (
        <>
          <rect
            x={pct(value.minSeconds)}
            width={pct(value.maxSeconds - value.minSeconds)}
            height="100%"
            rx="1.5"
            fill={`url(#${hatchId})`}
          />
          <rect width={pct(value.minSeconds)} height="100%" rx="1.5" className={fill} />
        </>
      )}
      {(value.kind === "point" || value.kind === "upTo") && (
        <rect width={pct(value.seconds)} height="100%" rx="1.5" className={fill} />
      )}

      {/* Minute marks: thin gaps in the color of the window behind. */}
      {scale.minutes.slice(1, -1).map((m) => (
        <line
          key={m}
          x1={pct(m * 60)}
          x2={pct(m * 60)}
          y1="0"
          y2="100%"
          strokeWidth="2"
          className="stroke-frame-inner"
        />
      ))}
    </svg>
  );
}
