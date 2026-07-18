import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/services",
    "/projects",
    "/aog",
    "/laser-marked-wire-order-form",
    "/careers",
    "/contact",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
