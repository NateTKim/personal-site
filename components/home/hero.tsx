import { ArrowDown, FileText } from "lucide-react";
import { education, heroIntro, person } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      <div className="sunrise -z-10" aria-hidden />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24 sm:pb-16">
        <h1
          id="hero-title"
          className="font-display text-6xl font-medium tracking-tight text-foreground sm:text-8xl"
        >
          {person.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-balance text-sand-800 sm:text-xl sm:leading-9">
          {heroIntro}
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-balance text-sand-700">
          {education.degree} + {education.secondMajor} · {education.schoolShort}, {education.grad} · GPA{" "}
          {education.gpa} · {education.honors}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={person.resume}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-medium text-primary-foreground shadow-[0_8px_20px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
          >
            <FileText className="size-4" aria-hidden />
            Resume
          </a>
          <a
            href="#contact"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sand-900/10 bg-card/80 px-6 text-[15px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-card"
          >
            Contact
          </a>
        </div>
        <a
          href="#orin"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-sand-700 underline-offset-4 hover:text-foreground hover:underline"
        >
          Try Orin, my SEC filings app, right on this page
          <ArrowDown className="size-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
