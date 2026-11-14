"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { beforeAfter } from "@/content/site";

type Row = {
  task: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
  resumeText: string;
  detail: string;
};

const data: Row[] = beforeAfter.map((b) => ({
  task: b.task,
  before: b.before.seconds,
  after: b.after.seconds,
  beforeLabel: b.before.label,
  afterLabel: b.after.label,
  resumeText: b.resumeText,
  detail: b.detail,
}));

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Row }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="max-w-72 rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-5 shadow-card-lg">
      <p className="font-medium text-foreground">{d.task}</p>
      <p className="text-muted-foreground">{d.detail}</p>
      <p className="mt-1 text-foreground tabular-nums">
        {d.beforeLabel} → {d.afterLabel}
      </p>
      <p className="mt-1 text-muted-foreground">Resume: “{d.resumeText}”</p>
    </div>
  );
}

const minutes = (s: number) => (s === 0 ? "0" : `${s / 60} min`);

export default function BeforeAfterChart() {
  return (
    <div className="h-64 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer={false}
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 72, bottom: 4, left: 4 }}
          barGap={4}
          barCategoryGap="28%"
        >
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeOpacity={0.7} />
          <XAxis
            type="number"
            domain={[0, 600]}
            ticks={[0, 120, 240, 360, 480, 600]}
            tickFormatter={minutes}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="task"
            width={112}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-sand-800)", fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-brand-50)" }} />
          <Bar
            dataKey="before"
            name="Before"
            fill="var(--color-sand-300)"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          >
            <LabelList dataKey="beforeLabel" position="right" fill="var(--color-sand-700)" fontSize={12} />
          </Bar>
          <Bar
            dataKey="after"
            name="After"
            fill="var(--color-brand-600)"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="afterLabel"
              position="right"
              fill="var(--color-brand-700)"
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
