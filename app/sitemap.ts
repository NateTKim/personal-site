import type { MetadataRoute } from "next";
import { workOrder } from "@/content/work";
import { siteUrl } from "@/lib/page-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/info", ...workOrder.map(({ href }) => href)].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
