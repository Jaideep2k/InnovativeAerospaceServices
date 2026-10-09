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
  /** Laser marked wire orders and general inquiries (contact form) go here. */
  laserWireEmail: "kim@iasavionics.ca",
  contactEmail: "kim@iasavionics.ca",
  /** Written exactly as on IAS's Google Business Profile (October 2026). */
  address: {
    facility: "Kelowna International Airport (YLW)",
    street: "6280 Lapointe Dr #1",
    city: "Kelowna",
    region: "BC",
    postal: "V1V 1S1",
    country: "Canada",
  },
  /**
   * IAS's Google Maps listing. The query (business name plus address)
   * resolves to that listing, so map embeds and directions pin the building
   * rather than a street-address guess; `cid` opens the listing itself.
   */
  mapsQuery: "Innovative Aerospace Services Ltd, 6280 Lapointe Dr #1, Kelowna, BC V1V 1S1",
  googleMapsCid: "4177433530003511892",
  geo: { lat: 49.96725, lng: -119.38379 },
  /**
   * "We've moved" notice shown once per visitor. It retires itself after
   * `until`, so it never needs to be remembered and taken down by hand.
   */
  moveNotice: {
    from: "Airport Way",
    until: "2027-06-30",
  },
  hours: [
    { days: "Monday to Friday", hours: "8:00 a.m. to 5:00 p.m." },
    { days: "Saturday", hours: "By appointment · AOG service available" },
    { days: "Sunday", hours: "By appointment · AOG service available" },
  ],
} as const;

/** Opens IAS's Google Maps listing (new tab). */
export const mapsHref = `https://maps.google.com/?cid=${site.googleMapsCid}`;

/** Turn-by-turn directions to the facility (new tab). */
export const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`;

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
      { href: "/dealers", label: "Our Dealers" },
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
      {
        href: "/fixed-wing-avionics-electrical",
        label: "Fixed-Wing Avionics & Electrical",
      },
      { href: "/garmin-dealer", label: "Authorized Garmin Dealer" },
    ],
  },
  { href: "/aog", label: "AOG" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;
