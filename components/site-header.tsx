import Link from "next/link";
import { person } from "@/content/site";
import { CommandTrigger } from "@/components/command/command-trigger";

const NAV = [
  { href: "/#orin", label: "Orin" },
  { href: "/#experience", label: "Experience" },
  { href: "/#writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-900/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {person.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm text-sand-700 transition-colors hover:bg-sand-100 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={person.resume}
            className="rounded-full px-3 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
          >
            Resume
          </a>
          <CommandTrigger />
        </nav>
      </div>
    </header>
  );
}
