import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { servicePages } from "@/lib/services";

const routes = [
  "",
  "/about",
  "/services",
  ...servicePages.map((s) => `/services/${s.slug}`),
  "/helicopter-avionics-electrical",
  "/fixed-wing-avionics-electrical",
  "/garmin-dealer",
  "/projects",
  "/dealers",
  "/aog",
  "/laser-marked-wire-order-form",
  "/faq",
  "/testimonials",
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
