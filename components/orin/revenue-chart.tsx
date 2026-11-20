"use client";

// Ported from the Orin repo (components/revenue-chart.tsx), unchanged except imports,
// accessibilityLayer={false} (a text table sits next to it instead) and shorter
// animations: the site keeps every animation but the hero zoom under 300ms. Recharts
// skips them entirely under prefers-reduced-motion (isAnimationActive defaults to "auto").
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPerShare, formatUsd, formatUsdCompact } from "@/lib/orin/format";
import type { HistoryPoint } from "@/lib/orin/types";

interface ChartDatum {
  label: string;
  revenue: number;
  eps: number | null;
  derived: boolean;
}

export function periodLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear().toString().slice(2);
  return `${month} '${year}`;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDatum }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-card-lg">
      <p className="font-medium text-foreground">{d.label}</p>
      <p className="mt-1 text-foreground tabular-nums">
        {formatUsd(d.revenue)}
        {d.derived && <span className="text-muted-foreground"> · calculated</span>}
      </p>
      {d.eps !== null && (
        <p className="mt-0.5 text-muted-foreground tabular-nums">{formatPerShare(d.eps)} profit per share</p>
      )}
    </div>
  );
}

export default function RevenueChart({ history }: { history: HistoryPoint[] }) {
  const data: ChartDatum[] = history.map((p) => ({
    label: periodLabel(p.periodEnd),
    revenue: p.revenue,
    eps: p.eps,
    derived: p.revenueDerived,
  }));

  return (
    <div className="h-52 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart accessibilityLayer={false} data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.7} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            dy={6}
          />
          <YAxis
            width={52}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatUsdCompact(v)}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--color-sand-300)" }}
            animationDuration={200}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#revenueFill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            animationDuration={250}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
