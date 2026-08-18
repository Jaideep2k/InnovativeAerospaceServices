import { servicePages } from "@/lib/services";

export const site = {
  legalName: "Innovative Aerospace Services Ltd.",
  shortName: "IAS Avionics",
  tagline: "Quality. Because it matters.",
  established: 2010,
  phone: "778-753-0250",
  phoneHref: "tel:+17787530250",
  domain: "iasavionics.ca",
  url: "https://iasavionics.ca",
  aogEmail: "aog@iasavionics.ca",
  laserWireEmail: "nancy@iasavionics.ca",
  address: {
    facility: "CYLW Kelowna International Airport",
    street: "1-6280 Airport Way",
    city: "Kelowna",
    region: "BC",
    postal: "V1V 1S1",
    country: "Canada",
  },
  hours: [
    { days: "Monday – Friday", hours: "8:00 a.m. – 5:00 p.m." },
    { days: "Saturday", hours: "By appointment · AOG service available" },
    { days: "Sunday", hours: "By appointment · AOG service available" },
  ],
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** When present, the item opens a dropdown instead of being a plain link. */
  children?: readonly { href: string; label: string }[];
};

/**
 * Header navigation. Items with `children` render as dropdowns; the parent
 * `href` stays a real destination so the group is still reachable directly
 * (and remains usable if JavaScript fails).
 *
 * Service children are generated from lib/services.ts so the menu can never
 * drift from the services that actually exist.
 */
export const nav: readonly NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/projects", label: "Our Projects" },
      { href: "/careers", label: "Careers" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services", label: "All Services" },
      ...servicePages.map((s) => ({
        href: `/services/${s.slug}`,
        label: s.navLabel ?? s.title,
      })),
      {
        href: "/helicopter-avionics-electrical",
        label: "Helicopter Avionics & Electrical",
      },
      { href: "/garmin-dealer", label: "Authorized Garmin Dealer" },
    ],
  },
  { href: "/aog", label: "AOG" },
  { href: "/contact", label: "Contact" },
] as const;
