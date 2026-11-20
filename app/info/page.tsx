import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import {
  about,
  coursework,
  education,
  experience,
  headline,
  infoDescription,
  leadership,
  photoSlots,
  projects,
  skills,
  writing,
} from "@/content/info";
import { profile } from "@/content/profile";
import { EntryHeader, EntryList, PhotoSlots, infoBody } from "@/components/info/info-parts";
import { LabelSection } from "@/components/site/label-section";
import { SiteHeader } from "@/components/site/site-header";
import { Todo } from "@/components/site/todo";
import { MetaSep } from "@/components/work/work-card";

export const metadata: Metadata = {
  title: "Info",
  description: infoDescription,
  openGraph: { title: `Info · ${profile.name}`, description: infoDescription, type: "profile" },
};

/**
 * /info: who Nate is, then the resume in the label-column layout the /work pages
 * use (one column below 768px). Contact is the site footer, on every page.
 */
export default function InfoPage() {
  return (
    <>
      <SiteHeader active="info" />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 px-(--frame-inset) pt-[calc(var(--header-h)+2.5rem)] pb-20 outline-none sm:pt-[calc(var(--header-h)+4.5rem)] sm:pb-28"
      >
        <div className="mx-auto w-full max-w-[80rem]">
          <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-end lg:gap-16">
            <h1 className="text-[clamp(2.25rem,1.2rem+3.6vw,4.5rem)] leading-[1.04] display-type text-balance text-foreground text-glow">
              {headline.lead}
              <span className="serif-italic">{headline.italic}</span>
            </h1>
            <PhotoSlots count={photoSlots.length} />
          </header>

          <div className="mt-14 sm:mt-20">
            <LabelSection id="info-about" title="About">
              <div className="flex flex-col items-start gap-4">
                <Todo>{about.todo}</Todo>
                <p className={infoBody}>{about.text.join(" ")}</p>
              </div>
            </LabelSection>

            <LabelSection id="info-experience" title="Experience">
              <EntryList entries={experience} />
            </LabelSection>

            <LabelSection id="info-projects" title="Projects">
              <EntryList entries={projects} />
            </LabelSection>

            <LabelSection id="info-leadership" title="Leadership">
              <EntryList entries={leadership} />
            </LabelSection>

            <LabelSection id="info-education" title="Education">
              <article aria-labelledby="info-school" className="flex flex-col gap-4">
                <EntryHeader id="info-school" title={education.school} dates={education.dates}>
                  {education.location}
                </EntryHeader>
                <ul className="flex flex-col gap-2">
                  {education.lines.map((line, i) => (
                    <li
                      key={line}
                      className={
                        i === 0 ? "text-[16px] leading-relaxed text-foreground sm:text-[17px]" : infoBody
                      }
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </LabelSection>

            <LabelSection id="info-coursework" title="Coursework">
              <div className="grid gap-8 sm:grid-cols-2">
                {coursework.map((group) => (
                  <div key={group.key}>
                    <h3 className="text-sm leading-6 text-muted-foreground">{group.label}</h3>
                    <ul className="mt-2 flex flex-col gap-2">
                      {group.courses.map((c) => (
                        <li key={c} className="text-[16px] leading-snug text-foreground/90">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </LabelSection>

            <LabelSection id="info-writing" title="Writing">
              {writing.map((w) => (
                <article
                  key={w.key}
                  aria-labelledby={`info-${w.key}`}
                  className="flex flex-col items-start gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3
                      id={`info-${w.key}`}
                      className="text-lg leading-snug font-medium text-foreground sm:text-xl"
                    >
                      {w.title}
                    </h3>
                    <p className="text-[15px] leading-6 text-muted-foreground">
                      {w.coAuthor}
                      <MetaSep />
                      {w.venue}
                      <MetaSep />
                      {w.issue}
                    </p>
                  </div>
                  <a
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-white/[0.07]"
                  >
                    {w.linkLabel}
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </article>
              ))}
            </LabelSection>

            <LabelSection id="info-skills" title="Skills">
              {/* Label above its items below 640px; from there a label column as wide as needed. */}
              <dl className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-3">
                {skills.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col sm:col-span-2 sm:grid sm:grid-cols-subgrid sm:items-baseline"
                  >
                    <dt className="text-sm leading-6 text-muted-foreground">{s.label}</dt>
                    <dd className="text-[16px] leading-7 text-foreground/90">{s.items}</dd>
                  </div>
                ))}
              </dl>
            </LabelSection>
          </div>
        </div>
      </main>
    </>
  );
}
