import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { OrinDemo } from "@/components/orin/orin-demo";
import { WorkPage, workMetadata } from "@/components/work/work-page";
import { demoSamples } from "@/lib/orin/demo-data";
import { cn } from "@/lib/utils";

// Orin's own fonts, for the demo's frame only. They are called in this page (not a
// layout), so Next preloads them on /work/orin alone. Their CSS variables are set on
// the frame's body (OrinDemo's fontClassName) and the .orin-theme rules read them
// there, so nothing outside the frame can use them.
const orinSans = Inter({ subsets: ["latin"], variable: "--font-orin-sans" });
const orinSerif = Fraunces({ subsets: ["latin"], variable: "--font-orin-serif" });

export const metadata: Metadata = workMetadata("orin");

export default function OrinPage() {
  return (
    <WorkPage
      slug="orin"
      visual={
        <section aria-labelledby="orin-demo-title">
          <h2 id="orin-demo-title" className="sr-only">
            Orin demo: real cached output for four tickers
          </h2>
          <OrinDemo samples={demoSamples} fontClassName={cn(orinSans.variable, orinSerif.variable)} />
        </section>
      }
    />
  );
}
