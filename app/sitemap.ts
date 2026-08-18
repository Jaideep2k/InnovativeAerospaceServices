import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicePages } from "@/lib/services";

const routes = [
  "",
  "/about",
  "/services",
  ...servicePages.map((s) => `/services/${s.slug}`),
  "/helicopter-avionics-electrical",
  "/garmin-dealer",
  "/projects",
  "/aog",
  "/laser-marked-wire-order-form",
  "/faq",
  "/careers",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
