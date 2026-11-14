import { ArrowUpRight, FileText } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { OrinSection } from "@/components/home/orin-section";
import { NumbersGrid } from "@/components/home/numbers-section";
import { RoleRow } from "@/components/home/role-row";
import { Section } from "@/components/home/section";
import { about, earlier, experience, leadership, person, writing } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />
      <OrinSection />

      <Section
        id="numbers"
        title="The numbers, with their fine print"
        intro="Every figure here is from my resume, and each label says exactly what it counts."
      >
        <NumbersGrid />
      </Section>

      <Section id="experience" title="Experience" className="pt-8 sm:pt-12">
        <ol className="-mx-4 flex flex-col gap-2 sm:-mx-6">
          {experience.map((r) => (
            <RoleRow key={r.company} role={r} />
          ))}
        </ol>

        <div data-reveal className="mt-12 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-x-8">
          <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Earlier</h3>
          <ul className="mt-3 flex flex-col divide-y divide-border sm:mt-0">
            {earlier.map((e) => (
              <li
                key={e.company}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 first:pt-0"
              >
                <span className="text-[15px] text-foreground">
                  {e.title} · <span className="text-sand-700">{e.company}</span>
                </span>
                <span className="text-sm text-muted-foreground tabular-nums">{e.dates}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={person.resume}
          className="mt-10 inline-flex items-center gap-2 text-[15px] font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          <FileText className="size-4" aria-hidden />
          View the full resume (PDF)
        </a>
      </Section>

      <Section id="leadership" title="Leadership" className="pt-8 sm:pt-12">
        <ol className="-mx-4 flex flex-col gap-2 sm:-mx-6">
          {leadership.map((r) => (
            <RoleRow key={r.company} role={r} />
          ))}
        </ol>
      </Section>

      <Section id="writing" title="Research and writing" className="pt-8 sm:pt-12">
        <ul className="grid gap-4 md:grid-cols-2">
          {writing.map((w) => (
            <li
              key={w.title}
              data-reveal
              className="flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-card ring-1 ring-sand-900/8 sm:p-7"
            >
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{w.kind}</p>
              <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-balance">
                {w.title}
              </h3>
              <p className="text-sm text-sand-700">{w.venue}</p>
              <p className="text-[15px] leading-7 text-foreground/90">{w.detail}</p>
              {w.href && (
                <a
                  href={w.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[15px] font-medium text-brand-700 underline-offset-4 hover:underline"
                >
                  {w.linkLabel}
                  <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only">(opens Google Drive in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="about" title="About" className="pt-8 sm:pt-12">
        <div data-reveal className="max-w-2xl text-lg leading-8 text-sand-800">
          <p>{about.join(" ")}</p>
        </div>
      </Section>
    </>
  );
}
