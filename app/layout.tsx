import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { hero, profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import "./globals.css";

// Every route on this site must be fully static.
export const ensureStatic = "navigation";

// Hanken Grotesk for everything; Newsreader italic only for the one italic phrase.
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
// One static italic (no optical-size axis), so the file stays small. Compared at hero
// size, 400 is the closest match to the old optical-size cut; 300 reads too light.
const serif = Newsreader({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
  variable: "--font-newsreader",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name} (${profile.legalName})`, template: `%s · ${profile.name}` },
  description: hero.sub,
  openGraph: {
    title: profile.name,
    description: hero.sub,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
  colorScheme: "dark",
};

// Runs before first paint: marks scroll-linked motion as allowed, so the hero's
// tall zoom track is laid out before anything renders (no jump on hydration).
// With JS off or reduced motion the class is never added and the hero is static.
const motionFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

// With JS off: hide controls that only work with JS, show the no-JS menu on
// small screens, and turn screen-reader text fallbacks into visible content.
const noJsCss = `.js-only{display:none!important}@media (width < 48rem){.nojs-menu{display:block!important}}.nojs-visible{position:static!important;width:auto!important;height:auto!important;clip:auto!important;clip-path:none!important;overflow:visible!important;white-space:normal!important;margin:0!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(sans.variable, serif.variable, "antialiased")} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
        <noscript>
          <style>{noJsCss}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only rounded-(--control-radius) border border-frame-border bg-frame px-4 py-2 text-sm font-medium text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        {/* Each page renders the header (it knows its section) and <main id="main">. */}
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
