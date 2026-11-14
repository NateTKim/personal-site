import { ArrowUpRight, Mail } from "lucide-react";
import { person } from "@/content/site";
import { CopyEmail } from "@/components/copy-email";

const LINKS = [
  { href: person.linkedin, label: "LinkedIn", external: true },
  { href: person.github, label: "GitHub", external: true },
  { href: person.resume, label: "Resume (PDF)", external: false },
  { href: person.orin, label: "Orin", external: true },
];

/** Contact block, shared by every page (anchor: #contact). */
export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-card/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Contact</h2>
          <p className="max-w-xl text-base leading-7 text-sand-700">
            Recruiting for software, fintech, product, consulting or finance? Email me.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${person.email}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-medium text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-brand-600)] transition-colors hover:bg-brand-700"
            >
              <Mail className="size-4" aria-hidden />
              {person.email}
            </a>
            <CopyEmail />
          </div>
        </div>
        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-1 text-sand-700 underline-offset-4 hover:text-foreground hover:underline"
                >
                  {l.label}
                  {l.external && <ArrowUpRight className="size-3.5" aria-hidden />}
                  {l.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs leading-5 text-muted-foreground">
          Built with Next.js, Tailwind and Motion. Colors and type are borrowed from Orin.
        </p>
      </div>
    </footer>
  );
}
