import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { CopyEmail } from "@/components/copy-email";

const CONTACT_LINKS = [
  { href: profile.linkedin, label: "LinkedIn", external: true },
  { href: profile.github, label: "GitHub", external: true },
  { href: profile.resume, label: "Resume", external: false },
];

const NAV = [
  { href: "/", label: "Work" },
  { href: "/info", label: "Info" },
];

const linkClass =
  "inline-flex min-h-6 items-center gap-1 rounded-sm text-[15px] text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline";

/** Site footer: contact (email with a copy button, LinkedIn, GitHub, Resume), nav, sign-off. */
export function SiteFooter() {
  return (
    <footer className="border-t border-frame-divider px-(--frame-inset)">
      <div className="mx-auto grid w-full max-w-[80rem] gap-12 py-14 sm:py-20 md:grid-cols-[minmax(0,1fr)_auto]">
        {/* #contact: the header's Contact link and the menu's Contact item land here.
            The html scroll-padding keeps it clear of the fixed header. */}
        <section id="contact" aria-labelledby="contact-title" className="outline-none">
          <h2 id="contact-title" className="text-3xl display-type text-foreground text-glow sm:text-4xl">
            Contact
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center rounded-sm text-lg break-all text-foreground underline decoration-current/30 underline-offset-4 transition-colors duration-150 hover:decoration-current sm:text-xl"
            >
              {profile.email}
            </a>
            <CopyEmail />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {CONTACT_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={linkClass}
                >
                  {l.label}
                  {l.external && <ArrowUpRight className="size-3.5" aria-hidden />}
                  {l.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <nav aria-label="Footer">
          <ul className="flex gap-6 md:flex-col md:items-end md:gap-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkClass}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-[80rem] border-t border-frame-divider py-6">
        <p className="text-[13px] text-subtle-foreground">
          Built by Nate Kim with Next.js, Tailwind and Motion.
        </p>
      </div>
    </footer>
  );
}
