// Easter egg: ticker NATE. Same layout as an Orin result, but every figure
// comes from Nate's resume (content/Nathanael_Kim_Resume_Public.pdf). It is
// labeled as a joke everywhere it appears. Do not add facts that aren't on
// the resume.
import { Card, CardContent } from "@/components/ui/card";
import { HEALTH_COLORS } from "@/lib/orin/colors";
import { person } from "@/content/site";
import {
  Bento,
  HealthCard,
  MissCard,
  MoreNumbers,
  PlainEnglish,
  ResultHeader,
  StatCard,
  cardShell,
} from "./result-parts";

const TIMELINE = [
  { dates: "Sep 2024 – present", what: "CodeForGood, President" },
  { dates: "May – Sep 2025", what: "Business-Software, Full Stack Developer Intern" },
  { dates: "Jan 2026 – present", what: "Capital Management Club, Associate Member" },
  { dates: "May 2026 – present", what: "Orin, Founder & Full-Stack Developer" },
  { dates: "May – Aug 2026", what: "Alphaeon Credit, Software Engineer Intern" },
];

export function NateResult() {
  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-xl bg-[oklch(0.96_0.04_78)] px-4 py-3 text-sm leading-6 text-[oklch(0.42_0.1_68)] ring-1 ring-[oklch(0.86_0.07_75)]">
        <strong className="font-semibold">You found the easter egg. This one is a joke.</strong> Same layout
        as Orin, built only from my resume instead of an SEC filing. NATE is not a stock.
      </p>

      <ResultHeader
        title="Nathanael Kim"
        ticker="NATE"
        meta="Latest report (one-page resume) · covers September 2024 to present"
        href={person.resume}
        hrefLabel="Read the official resume"
      />

      <HealthCard
        score="3.7"
        outOf="/4.0"
        label="Dean's List"
        accent={HEALTH_COLORS.Steady}
        timeframe="Based on this resume. GPA from UW-Madison."
        why="Nate is a finance and computer science student at UW-Madison: a BBA in Finance, Investment and Banking with an additional major in Computer Science, graduating May 2028."
        factors={[
          {
            key: "e2e",
            direction: "up",
            sentiment: "positive",
            label: "Playwright E2E suite",
            detail: "+67%",
          },
          {
            key: "otp",
            direction: "up",
            sentiment: "positive",
            label: "Unblocked E2E tests",
            detail: "20+, every 2 hours",
          },
          {
            key: "fraud",
            direction: "down",
            sentiment: "positive",
            label: "Fraud request time",
            detail: "~5 min → under 15 s",
          },
          {
            key: "admin",
            direction: "down",
            sentiment: "positive",
            label: "Admin task time",
            detail: "10 min → 1 min",
          },
          {
            key: "cfg",
            direction: "up",
            sentiment: "positive",
            label: "CodeForGood",
            detail: "115 signups → 60+ members",
          },
        ]}
        disclaimer="Not a stock rating, a prediction, or a recommendation to buy, sell, or hold. A recommendation to hire is fine."
      />

      <Bento
        miss={
          <MissCard
            items={[
              "CodeForGood had been inactive for two years before Nate founded it again from zero. 115 signups turned into 60+ members in one semester.",
              "The demo you're looking at runs on Orin, which Nate built and deployed: Next.js and TypeScript, Supabase, Clerk, with CI/CD through GitHub and Vercel.",
              "At Alphaeon Credit, one Grape API endpoint for OTP retrieval unblocked 20+ E2E tests that now run every 2 hours. It also masks SSNs.",
            ]}
            caption="Orin's reading of its own builder. A starting point for questions, not a verdict."
          />
        }
        side={
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Tickets" explain="production, 4 repos" value="30+" change={null} />
              <StatCard
                label="Growth"
                explain="Playwright E2E suite"
                value="+67%"
                change={0.67}
                emphasizeChangeColor
              />
              <StatCard label="GPA" explain="out of 4.0" value="3.7" change={null} />
            </div>
            <Card className={cardShell}>
              <CardContent className="flex flex-col gap-3 py-2">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-base font-semibold tracking-tight">Track record</h4>
                  <p className="text-xs text-muted-foreground">Roles on the resume, oldest first</p>
                </div>
                <ol className="flex flex-col divide-y divide-border/70">
                  {TIMELINE.map((t) => (
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
            <MoreNumbers
              rows={[
                {
                  label: "Platform credit sales",
                  explain: "Alphaeon's platform, not Nate's",
                  value: "$560M+ a year",
                },
                { label: "Provider locations", explain: "on that platform", value: "12,500+" },
                { label: "Platform downloads", explain: "Business-Software's platform", value: "1M+" },
                { label: "Partner projects secured", explain: "CodeForGood", value: "9" },
                { label: "Organizations emailed", explain: "to find them", value: "30+" },
                { label: "Attendance", explain: "tracked weekly", value: "90%" },
                { label: "Chewy pitch audience", explain: "Capital Management Club", value: "100+" },
              ]}
            />
          </>
        }
        summary={
          <PlainEnglish
            intro={[
              "Nate studies finance and computer science at UW-Madison: a BBA in Finance, Investment and Banking with an additional major in Computer Science, graduating May 2028 with a 3.7/4.0 GPA and Dean's List.",
              "This report covers two software internships, a club rebuilt from zero, an equity research pitch, and Orin. The work runs on TypeScript, JavaScript, Python, Ruby, SQL and Java, mostly through React, Next.js and Ruby on Rails.",
            ]}
            notable={[
              "Joined Capital Management Club in January 2026 and pitched Chewy (NYSE: CHWY) to 100+ members",
              "Built and deployed Orin, starting May 2026",
              "Software Engineer Intern at Alphaeon Credit, May to August 2026",
            ]}
          />
        }
      />
    </div>
  );
}
