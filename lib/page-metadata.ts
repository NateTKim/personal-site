import type { Metadata, ResolvingMetadata } from "next";
import { hero, profile, withoutWordJoiners } from "@/content/profile";

/**
 * The site's production URL, the base for canonical links, og:url and the link-preview image:
 * Vercel's production host when it is set (it is at build time on Vercel), otherwise the
 * fallback host in content/profile.ts. Never localhost.
 */
export const siteUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || profile.siteHost}`;

/** The hero sub-line as plain text: the site's description in meta tags. */
export const siteDescription = withoutWordJoiners(hero.sub);

type PageMeta = {
  /** The route, e.g. "/info": its canonical link and og:url (metadataBase makes them absolute). */
  path: string;
  /** The <title> (the root layout's template adds " · Nate Kim"). Omitted, the layout's default. */
  title?: string;
  description: string;
  openGraph: { title: string; type: "website" | "article" | "profile" };
};

/**
 * Metadata for one page: title, description, canonical link, and Open Graph with og:url.
 * Word joiners are dropped from the description (meta tags are plain text, never wrapped).
 *
 * Metadata merges shallowly, so a page's `openGraph` replaces the layout's whole, including the
 * link-preview image that app/opengraph-image.tsx adds at the root. The image is carried over
 * from the parent here, so every page keeps it. twitter:image comes from the same image (the
 * root layout only sets the card type; Next fills the rest from Open Graph).
 */
export async function pageMetadata(parent: ResolvingMetadata, page: PageMeta): Promise<Metadata> {
  const { openGraph: parentOpenGraph } = await parent;
  const description = withoutWordJoiners(page.description);
  return {
    ...(page.title !== undefined && { title: page.title }),
    description,
    alternates: { canonical: page.path },
    openGraph: {
      ...page.openGraph,
      description,
      url: page.path,
      images: parentOpenGraph?.images,
    },
  };
}
