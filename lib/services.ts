/**
 * Single source of truth for the services offering.
 *
 * The `/services` hub renders `card` (a short teaser) for every entry.
 * Entries with a `slug` get their own detail page at that route, which renders
 * `intro` / `items` / `benefits` / `note`. Entries without a `slug` keep their
 * detail on the hub itself, anchored by `id`.
 *
 * `card.text` is deliberately written to differ from `intro` — the hub must not
 * restate the detail pages, or the two compete as duplicate content.
 */

export type Service = {
  /** Anchor id on the hub page. */
  id: string;
  /** Route segment under /services. Omit to keep this service hub-only. */
  slug?: string;
  eyebrow: string;
  title: string;
  /** Short label for nav dropdowns. Falls back to `title`. */
  navLabel?: string;
  /** Hub card copy — a teaser, never a copy of `intro`. */
  card: { text: string; image: string; alt: string };
  /** Detail copy. Lives on the child page when `slug` is set. */
  intro: string;
  items?: string[];
  benefits?: string[];
  benefitsTitle?: string;
  note?: string;
  image: string;
  imageAlt: string;
  cta: string;
  ctaHref: string;
  /** Page-level SEO for services that have their own route. */
  meta?: { title: string; description: string };
};

export const services: Service[] = [
  {
    id: "avionics",
    slug: "avionics",
    eyebrow: "Service 01",
    title: "Avionics Installations & Upgrades",
    navLabel: "Avionics & Installations",
    card: {
      text: "Equipment sales, installation and integration — from a single radio to a full glass-cockpit modernization, including scheduled recertifications.",
      image: "/images/services/avionics-services-kelowna.jpg",
      alt: "Helicopter instrument panel with avionics test connectors attached",
    },
    intro:
      "We install systems from leading avionics manufacturers and integrate new equipment properly with your aircraft's existing systems — improving reliability, functionality, compliance and operational capability. We also perform scheduled avionics recertifications, including work involving RVSM-capable aircraft.",
    items: [
      "Avionics installations",
      "Avionics equipment sales",
      "Integration with existing aircraft systems",
      "Systems from leading avionics manufacturers",
      "Garmin aviation equipment and installations",
      "Scheduled recertifications",
      "Avionics troubleshooting",
      "Electrical troubleshooting",
      "Avionics repairs",
      "Electrical repairs",
    ],
    benefits: [
      "GPS navigation systems",
      "Flight displays",
      "Communication radios",
      "Transponders",
      "ADS-B solutions",
      "Audio panels",
      "Emergency locator equipment",
      "Aircraft lighting systems",
    ],
    benefitsTitle: "Products & systems we supply",
    note: "Every installation is completed to manufacturer specifications and applicable regulatory requirements. We work with owners and operators to recommend solutions that align with mission requirements and budget.",
    image: "/images/home/Innovative-Aerospace-rewire-services.jpg",
    imageAlt: "Helicopter cockpit instrument panel serviced by IAS",
    cta: "Discuss an Avionics Project",
    ctaHref: "/contact#estimate",
    meta: {
      title: "Avionics Installations & Upgrades",
      description:
        "Avionics sales, installation, integration and upgrades for helicopters and fixed-wing aircraft — GPS navigation, flight displays, radios, transponders, ADS-B and audio panels. Kelowna International Airport, BC.",
    },
  },
  {
    id: "rewiring",
    slug: "aircraft-rewiring",
    eyebrow: "Service 02",
    title: "Aircraft Rewiring",
    navLabel: "Aircraft Rewiring",
    card: {
      text: "Complete and partial rewires that end recurring electrical faults at the source, rather than chasing the same squawk twice.",
      image: "/images/projects/212-MAR-B2-1.jpg",
      alt: "Bell 212 airframe with new wiring being routed at the IAS facility",
    },
    intro:
      "We specialize in complete and partial aircraft rewiring. If your aircraft suffers intermittent electrical problems, unreliable systems, aging wiring, obsolete installations or repeated electrical faults — the 'gremlins' every operator knows — a rewire may be the right fix.",
    items: [
      "Complete aircraft rewiring",
      "Partial wiring replacement",
      "Replacement of aging or unreliable electrical wiring",
      "Identification and correction of intermittent electrical problems",
      "Connector replacement",
      "Circuit protection upgrades",
      "Corrosion and damage remediation",
      "Wiring cleanup and reorganization",
      "Custom electrical upgrades",
      "Custom avionics upgrades",
      "Instrument upgrades",
      "Laser wire marking",
      "Harness construction",
      "Supporting documentation",
      "Coordination with third-party engineering firms where regulated engineering is required",
    ],
    benefits: [
      "Improved system reliability",
      "Enhanced safety",
      "Reduced maintenance downtime",
      "Better avionics performance",
      "Increased aircraft value",
      "Compliance with current standards",
    ],
    benefitsTitle: "Benefits of a rewire",
    note: "We offer the fastest rewire in the industry, so your aircraft spends less time on the ground. Note that IAS does not perform regulated engineering work directly — where engineering is required, it is supplied by registered third-party engineering firms.",
    image: "/images/home/Innovative-Aerospace-rewire-services.jpg",
    imageAlt: "Helicopter cockpit instrument panel rebuilt during a rewire",
    cta: "Discuss a Rewiring Project",
    ctaHref: "/contact#estimate",
    meta: {
      title: "Aircraft Rewiring Services",
      description:
        "Complete and partial aircraft rewiring for helicopters and fixed-wing aircraft — replacing aging wiring, connectors and circuit protection, remediating corrosion and correcting intermittent electrical faults. Kelowna, BC.",
    },
  },
  {
    id: "harnesses",
    slug: "wiring-harnesses",
    eyebrow: "Service 03",
    title: "Wiring Harnesses",
    navLabel: "Wiring Harnesses",
    card: {
      text: "Custom, replacement, standard and accessory harnesses — built and installed with laser-marked wire and full documentation.",
      image: "/images/laser-wire/wire-2.jpg",
      alt: "Completed aircraft harness terminal board at the IAS facility",
    },
    intro:
      "Experienced aircraft wiring-harness construction and installation — with laser-marked aircraft wire, stocked options where available, and expedited shipping of harnesses and avionics equipment where available.",
    items: [
      "Custom aircraft wiring harnesses",
      "Replacement wiring harnesses",
      "Standard replacement harnesses",
      "Accessory harnesses",
      "Harness building",
      "Harness installation",
      "Laser-marked aircraft wire",
      "Stocked wiring-harness options where available",
      "Expedited shipping where available",
    ],
    note: "Every harness we build is marked in-house, so the aircraft leaves with wiring that the next technician can actually trace.",
    image: "/images/projects/212-MAR-B2-1.jpg",
    imageAlt: "Aircraft harness routing during a Bell 212 rewire",
    cta: "Ask About a Harness",
    ctaHref: "/contact",
    meta: {
      title: "Aircraft Wiring Harnesses",
      description:
        "Custom, replacement, standard and accessory aircraft wiring harnesses — built, installed and documented with laser-marked wire by IAS Avionics in Kelowna, BC.",
    },
  },
  {
    id: "laser-marking",
    slug: "laser-wire-marking",
    eyebrow: "Service 04",
    title: "Laser Wire Marking",
    navLabel: "Laser Wire Marking",
    card: {
      text: "Permanent, legible wire identification marked in-house — for our own projects and for customer orders shipped out.",
      image: "/images/laser-wire/laser-marked-wire.jpg",
      alt: "Laser-marked aircraft wire with printed identification",
    },
    intro:
      "In-house laser wire marking for aircraft wiring projects and customer orders — supporting clear wire identification, installation consistency, maintenance efficiency and professional aircraft wiring practices. Proper wire identification is critical for maintenance, troubleshooting, system modifications and regulatory compliance.",
    items: [
      "Permanent wire identification",
      "High-durability markings",
      "Clear, legible markings",
      "Compliance with aerospace industry specifications",
    ],
    benefits: [
      "New aircraft installations",
      "Aircraft rewiring projects",
      "Avionics upgrades",
      "Wiring harnesses",
      "Fleet maintenance programs",
    ],
    benefitsTitle: "Applications",
    note: "Accurate wire identification reduces troubleshooting time and improves maintenance efficiency throughout the life of the aircraft.",
    image: "/images/laser-wire/wire-2.jpg",
    imageAlt:
      "The IAS laser wire marking machine and a completed aircraft harness terminal board",
    cta: "Order Laser Marked Wire",
    ctaHref: "/laser-marked-wire-order-form",
    meta: {
      title: "Laser Wire Marking",
      description:
        "Precision laser wire marking for aerospace applications — permanent, high-durability, legible wire identification meeting aerospace industry specifications. Order marked wire from IAS Avionics in Kelowna, BC.",
    },
  },

  // --- Hub-only services: too little distinct content to sustain their own page. ---
  {
    id: "solutions",
    eyebrow: "Service 05",
    title: "Aircraft Solutions & Upgrades",
    card: {
      text: "Custom retrofit and modernization projects — IFR and VFR cockpit layouts, documentation and AutoCAD drawings.",
      image: "/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg",
      alt: "Corporate jet in flight",
    },
    intro:
      "Custom electrical, avionics and instrument projects built around your aircraft and its operational requirements — from IFR and VFR cockpit layouts to full retrofit and modernization projects.",
    items: [
      "Custom electrical upgrades",
      "Custom avionics upgrades",
      "Instrument upgrades",
      "Aircraft retrofit projects",
      "IFR cockpit layouts",
      "VFR cockpit layouts",
      "Aircraft modernization",
      "Integration of existing and new systems",
      "Project documentation",
      "AutoCAD drawings",
      "Coordination of design and engineering documentation",
      "Installation, testing and troubleshooting",
    ],
    note: "IAS does not perform regulated engineering work directly. Where engineering is required, it is supplied by registered third-party engineering firms — we plan, coordinate, document, install and complete the project with you.",
    image: "/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg",
    imageAlt: "Corporate jet in flight",
    cta: "Plan a Custom Project",
    ctaHref: "/contact#estimate",
  },
  {
    id: "troubleshooting",
    eyebrow: "Service 06",
    title: "Troubleshooting & Repairs",
    card: {
      text: "Avionics and electrical fault diagnosis, wiring inspections and repairs — at our facility or, where arranged, at yours.",
      image: "/images/home/Innovative-Aerospace-Services-helicopter-electrical.jpg",
      alt: "Helicopter in flight",
    },
    intro:
      "Strong diagnostic capability across avionics and electrical systems — at the IAS facility or, where arranged, at customer locations.",
    items: [
      "Avionics fault diagnosis",
      "Electrical fault diagnosis",
      "Intermittent-system troubleshooting",
      "Wiring inspections",
      "Repair of damaged or unreliable wiring",
      "Correction of installation issues",
      "Avionics equipment troubleshooting",
      "Aircraft electrical-system repairs",
    ],
    image: "/images/projects/ias-avionics-212-MAY-A1-1.jpg",
    imageAlt: "Bell 212 in the IAS hangar for electrical work",
    cta: "Book Troubleshooting",
    ctaHref: "/contact",
  },
  {
    id: "recertifications",
    eyebrow: "Service 07",
    title: "Inspections & Recertifications",
    card: {
      text: "Altimeter, transponder, encoder and ATE 24-month recertifications, plus ELT 12-month — planned around your deadlines.",
      image: "/images/services/avionics-services-kelowna.jpg",
      alt: "Helicopter instrument panel during recertification testing",
    },
    intro:
      "Scheduled recertification services to keep your aircraft compliant — and help planning around recertification deadlines and seasonal maintenance requirements.",
    items: [
      "Altimeter, transponder and encoder 24-month recertifications",
      "ATE 24-month recertifications",
      "ELT 12-month recertification",
      "Scheduled avionics recertifications",
      "Recertification support for RVSM-capable aircraft",
    ],
    image: "/images/services/avionics-services-kelowna.jpg",
    imageAlt: "Helicopter instrument panel with test connectors during recertification",
    cta: "Ask About Recertification",
    ctaHref: "/contact",
  },
  {
    id: "adsb",
    eyebrow: "Service 08",
    title: "ADS-B Upgrades & Installations",
    card: {
      text: "ADS-B In and Out upgrades, installation and integration — including support for U.S. operating requirements.",
      image: "/images/home/Garmin-GR500.jpg",
      alt: "Garmin avionics display installed in an aircraft panel",
    },
    intro:
      "ADS-B upgrades, installations and equipment integration — including support for aircraft that need to meet applicable United States ADS-B operating requirements.",
    items: [
      "ADS-B upgrades",
      "ADS-B installations",
      "Equipment integration",
      "Support for U.S. ADS-B operating requirements",
    ],
    image: "/images/home/Garmin-GR500.jpg",
    imageAlt: "Garmin avionics display installed in an aircraft panel",
    cta: "Ask About ADS-B",
    ctaHref: "/contact",
  },
  {
    id: "efficiency",
    eyebrow: "Service 09",
    title: "Aircraft Efficiency & Weight Review",
    card: {
      text: "As part of a rewire or retrofit, we identify obsolete equipment and unnecessary wiring that can come out.",
      image: "/images/home/Innovative-Aerospace-rewire-projects.jpg",
      alt: "Aircraft wiring reviewed during a retrofit project",
    },
    intro:
      "As part of a rewire or retrofit — with an IFR or VFR layout — we can review your aircraft's wiring and installed equipment to identify obsolete equipment, unnecessary wiring and outdated installations that can be removed where legally and technically appropriate.",
    image: "/images/home/Innovative-Aerospace-rewire-projects.jpg",
    imageAlt: "Aircraft wiring reviewed during a retrofit project",
    cta: "Ask About an Efficiency Review",
    ctaHref: "/contact",
  },
];

/** Services that have their own route under /services. */
export const servicePages = services.filter(
  (s): s is Service & { slug: string } => Boolean(s.slug),
);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Link target for a service: its own page, or an anchor on the hub. */
export function serviceHref(s: Service): string {
  return s.slug ? `/services/${s.slug}` : `/services#${s.id}`;
}
