import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { CommandTrigger } from "@/components/command/command-trigger";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "work", href: "/", label: "Work" },
  { key: "info", href: "/info", label: "Info" },
] as const;

const LINKS = [
  { href: profile.linkedin, label: "LinkedIn", external: true },
  { href: profile.github, label: "GitHub", external: true },
  { href: profile.resume, label: "Resume", external: false },
  // The footer's contact section, on every page. In the header row only from 1024px:
  // below that it would push the Work | Info pill off-center (the menu has it instead).
  { href: "#contact", label: "Contact", external: false, wideOnly: true },
];

function externalProps(external: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/**
 * Fixed header. Left: name and role. Center: the Work | Info switch.
 * Right: LinkedIn, GitHub, Resume, Contact (from 1024px) and the ⌘K menu. Below
 * 768px the links live in the menu (labelled "Menu"); with JS off a native
 * <details> menu stands in for it. Each page passes its section (null on the 404 page),
 * so the server HTML and the client always agree.
 */
export function SiteHeader({
  active,
  sectionOnly = false,
}: {
  active: (typeof SECTIONS)[number]["key"] | null;
  sectionOnly?: boolean;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-frame-divider bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-(--header-h) w-full max-w-[90rem] items-center justify-between gap-2 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-3 lg:px-8">
        <div className="min-w-0">
          <Link
            href="/"
            className="-my-0.5 inline-flex min-h-6 items-center rounded-sm text-[15px] leading-5 font-medium tracking-tight text-foreground text-glow"
          >
            {profile.name}
          </Link>
          <p className="truncate text-xs leading-4 text-muted-foreground">{profile.roleLine}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 md:contents">
          <nav aria-label="Primary" className="md:justify-self-center">
            <ul className="flex items-center gap-0.5 rounded-(--control-radius) border border-frame-border bg-white/[0.035] p-[3px]">
              {SECTIONS.map((s) => {
                const current = s.key === active;
                return (
                  <li key={s.key}>
                    <Link
                      href={s.href}
                      aria-current={current && !sectionOnly ? "page" : undefined}
                      className={cn(
                        "block rounded-[calc(var(--control-radius)-3px)] px-2.5 py-1 text-[13px] leading-5 transition-colors duration-150 md:px-3",
                        current
                          ? "bg-white/10 text-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.07)]"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:justify-self-end">
            <ul className="hidden items-center gap-0.5 md:flex">
              {LINKS.map((l) => (
                <li key={l.label} className={l.wideOnly ? "hidden lg:block" : undefined}>
                  <a
                    href={l.href}
                    {...externalProps(l.external)}
                    className="inline-flex h-8 items-center gap-0.5 rounded-(--control-radius) px-2.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {l.label}
                    {/* Arrows only from 1024px: below that they would push the pill off-center. */}
                    {l.external && (
                      <ArrowUpRight className="hidden size-3.5 opacity-70 lg:block" aria-hidden />
                    )}
                    {l.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <CommandTrigger />
            <NoJsMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Small-screen menu for when JavaScript is off (shown by the <noscript> style in the root layout). */
function NoJsMenu() {
  return (
    <details className="nojs-menu relative hidden">
      <summary className="inline-flex h-8 cursor-pointer list-none items-center rounded-(--control-radius) border border-frame-border bg-white/[0.035] px-2.5 text-[13px] text-muted-foreground [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <ul className="absolute top-full right-0 mt-2 flex w-44 flex-col rounded-(--frame-radius-sm) border border-frame-border bg-frame p-1.5 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.8)]">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...externalProps(l.external)}
              className="flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-foreground hover:bg-white/[0.06]"
            >
              {l.label}
              {l.external && <ArrowUpRight className="size-3.5 text-subtle-foreground" aria-hidden />}
              {l.external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
