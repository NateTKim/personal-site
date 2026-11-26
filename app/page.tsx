import type { ResolvingMetadata } from "next";
import { StatsRow } from "@/components/home/stats-row";
import { Hero } from "@/components/site/hero";
import { SiteHeader } from "@/components/site/site-header";
import { AlphaeonCard } from "@/components/work/alphaeon-card";
import { BusinessSoftwareCard } from "@/components/work/business-software-card";
import { ChewyCard } from "@/components/work/chewy-card";
import { CodeForGoodCard } from "@/components/work/codeforgood-card";
import { OrinCard } from "@/components/work/orin-card";
import { profile } from "@/content/profile";
import { pageMetadata, siteDescription } from "@/lib/page-metadata";

// The layout's title and description, plus this page's canonical link and og:url.
export function generateMetadata(_: PageProps<"/">, parent: ResolvingMetadata) {
  return pageMetadata(parent, {
    path: "/",
    description: siteDescription,
    openGraph: { title: profile.name, type: "website" },
  });
}

export default function Home() {
  return (
    <>
      <SiteHeader active="work" />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <StatsRow />
        <section
          id="work"
          aria-labelledby="work-title"
          className="scroll-mt-(--header-h) px-(--frame-inset) pt-16 pb-28 outline-none sm:pt-24 sm:pb-36"
        >
          <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 sm:gap-12">
            <h2 id="work-title" className="label-text text-subtle-foreground">
              Work
            </h2>
            <AlphaeonCard />
            <CodeForGoodCard />
            <OrinCard />
            <ChewyCard />
            <BusinessSoftwareCard />
          </div>
        </section>
      </main>
    </>
  );
}
