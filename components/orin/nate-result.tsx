// Easter egg: ticker NATE. Same layout as an Orin result, but every figure comes
// from the master resume, through content/nate-egg.ts (each one tagged there).
// It is labeled as a joke everywhere it appears. Add facts there, not here.
import { Card, CardContent } from "@/components/ui/card";
import { HEALTH_COLORS } from "@/lib/orin/colors";
import { nateEgg } from "@/content/nate-egg";
import { profile } from "@/content/profile";
import {
  Analysis,
  Bento,
  HealthCard,
  MissCard,
  MoreNumbers,
  PlainEnglish,
  ResultHeader,
  StatCard,
  cardShell,
} from "./result-parts";

export function NateResult({ analysisInert }: { analysisInert: boolean }) {
  const { notice, header, health, miss, stats, timeline, numbers, summary } = nateEgg;
  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-xl bg-[oklch(0.96_0.04_78)] px-4 py-3 text-sm leading-6 text-[oklch(0.42_0.1_68)] ring-1 ring-[oklch(0.86_0.07_75)]">
        <strong className="font-semibold">{notice.lead}</strong> {notice.rest}
      </p>

      <ResultHeader
        title={header.title}
        ticker={header.ticker}
        meta={header.meta}
        href={profile.resume}
        hrefLabel={header.hrefLabel}
      />

      <HealthCard
        score={health.score}
        outOf={health.outOf}
        label={health.label}
        accent={HEALTH_COLORS.Steady}
        timeframe={health.timeframe}
        why={health.why}
        factors={health.factors}
        disclaimer={health.disclaimer}
      />

      <Analysis inert={analysisInert}>
        <Bento
          miss={<MissCard items={miss.items} caption={miss.caption} />}
          side={
            <>
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    explain={s.explain}
                    value={s.value}
                    change={s.change}
                    emphasizeChangeColor={s.change !== null}
                  />
                ))}
              </div>
              <Card className={cardShell}>
                <CardContent className="flex flex-col gap-3 py-2">
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-base font-semibold tracking-tight">Track record</h4>
                    <p className="text-xs text-muted-foreground">Roles listed oldest first</p>
                  </div>
                  <ol className="flex flex-col divide-y divide-border/70">
                    {timeline.map((t) => (
                      <li key={t.what} className="flex flex-col gap-0.5 py-2">
                        <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                          {t.dates}
                        </span>
                        <span className="text-sm text-foreground/90">{t.what}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <MoreNumbers rows={numbers} />
            </>
          }
          summary={<PlainEnglish intro={summary.intro} notable={summary.notable} />}
        />
        <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          {nateEgg.footer}
        </p>
      </Analysis>
    </div>
  );
}
