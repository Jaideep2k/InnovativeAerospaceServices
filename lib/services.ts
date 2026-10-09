/**
 * Single source of truth for the services offering.
 *
 * The `/services` hub renders `card` (a short teaser) for every entry.
 * Entries with a `slug` get their own detail page at that route, which renders
 * `intro` / `items` / `benefits` / `note`. Entries without a `slug` keep their
 * detail on the hub itself, anchored by `id`.
 *
 * `card.text` is deliberately written to differ from `intro`: the hub must not
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
  /** Hub card copy: a teaser, never a copy of `intro`. */
  card: { text: string; image: string; alt: string };
  /** Detail-page hero image. Falls back to the card image. */
  hero?: { image: string; alt: string };
  /**
   * Hero tagline on the service's own page. Falls back to `card.text`; set it
   * only where the page needs a different tagline than its hub card.
   */
  heroSub?: string;
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
      text: "Got “Gremlins?” Modern avionics, properly installed and integrated: from a single radio to a full glass-cockpit modernization.",
      image: "/images/garmin/garmin-glass-cockpit-turboprop.jpg",
      alt: "Garmin glass-cockpit displays installed in a twin turboprop panel",
    },
    hero: {
      image: "/images/garmin/garmin-business-jet-flight-deck.jpg",
      alt: "Garmin glass-cockpit flight deck in a business jet",
    },
    heroSub:
      "Kelowna's only authorized Garmin dealer. We design, supply, install and integrate modern avionics, from a single radio to a full glass-cockpit modernization.",
    intro:
      "We install systems from leading avionics manufacturers and integrate new equipment properly with your aircraft's existing systems, improving reliability, functionality, compliance and operational capability.",
    items: [
      "Garmin aviation equipment and installations",
      "Avionics installations",
      "Avionics equipment sales",
      "Integration with existing aircraft systems",
      "Systems from leading avionics manufacturers",
      "Glass-cockpit modernizations",
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
    image: "/images/garmin/garmin-helicopter-flight-displays.jpg",
    imageAlt: "Helicopter pilot flying with Garmin flight displays",
    cta: "Discuss an Avionics Project",
    ctaHref: "/contact#estimate",
    meta: {
      title: "Avionics Installations & Upgrades",
      description:
        "Avionics installations and upgrades from Kelowna's only authorized Garmin dealer: GPS navigation, flight displays, radios, transponders, ADS-B and audio panels for helicopters and fixed-wing aircraft.",
    },
  },
  {
    id: "rewiring",
    slug: "aircraft-rewiring",
    eyebrow: "Service 02",
    title: "Aircraft Rewiring",
    navLabel: "Aircraft Rewiring",
    card: {
      text: "Complete and partial rewires that terminate the “gremlins.”",
      image: "/images/b412/b412-cabin-rewire.jpg",
      alt: "IAS technician routing new wiring through a Bell 412 cabin during a complete rewire",
    },
    hero: {
      image: "/images/projects/212-MAR-B2-1.jpg",
      alt: "Bell 212 airframe with new wiring being routed at the IAS facility",
    },
    intro:
      "We specialize in complete and partial aircraft rewiring. If your aircraft suffers intermittent electrical problems, unreliable systems, aging wiring, obsolete installations or repeated electrical faults (the “gremlins” every operator knows), a rewire may be the right fix.",
    items: [
      "Complete aircraft rewiring",
      "Fastest downtime in the industry",
      "Replacement of aging or unreliable electrical wiring",
      "Identification and correction of intermittent electrical problems",
      "Connector replacement",
      "Circuit protection upgrades",
      "Corrosion and damage remediation",
      "“Weight loss” program",
      "Custom avionics and electrical upgrades",
      "Instrument upgrades",
      "Laser wire marking",
      "Harness assembly",
      "Supporting documentation",
      "Coordination with third-party engineering firms when regulated engineering is required",
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
    note: "We offer the fastest rewire in the industry, so your aircraft spends less time on the ground. Note that IAS does not perform regulated engineering work directly. When engineering is required, it is supplied by registered third-party engineering firms.",
    image: "/images/b412/b412-harness-team.jpg",
    imageAlt: "IAS team members looking through a newly built wiring harness during a Bell 412 rewire",
    cta: "Discuss a Rewiring Project",
    ctaHref: "/contact#estimate",
    meta: {
      title: "Aircraft Rewiring Services",
      description:
        "Complete and partial aircraft rewiring for helicopters and fixed-wing aircraft, replacing aging wiring, connectors and circuit protection, remediating corrosion and correcting intermittent electrical faults. Kelowna, BC.",
    },
  },
  {
    id: "harnesses",
    slug: "wiring-harnesses",
    eyebrow: "Service 03",
    title: "Wiring Harnesses",
    navLabel: "Wiring Harnesses",
    card: {
      text: "Top-quality custom wiring harnesses, assembled in-house and ready for pickup or shipment on an expedited timeline.",
      image: "/images/laser-wire/wire-2.jpg",
      alt: "Completed aircraft harness terminal board at the IAS facility",
    },
    intro:
      "Experienced aircraft wiring-harness assembly using laser-marked wire, with most standard harnesses in stock and expedited shipping of harnesses and avionics equipment where available.",
    items: [
      "Custom aircraft wiring harnesses",
      "Standard harnesses",
      "Accessory harnesses",
      "Harness assembly",
      "Laser-marked wire",
      "Most standard harnesses in stock",
      "Expedited shipping where available",
    ],
    note: "IAS wires are built and assembled with the highest quality to ensure safety and reliability.",
    image: "/images/projects/212-MAR-B2-1.jpg",
    imageAlt: "Aircraft harness routing during a Bell 212 rewire",
    cta: "Ask About a Harness",
    ctaHref: "/contact",
    meta: {
      title: "Aircraft Wiring Harnesses",
      description:
        "Custom, standard and accessory aircraft wiring harnesses assembled in-house with laser-marked wire, most standard harnesses in stock and expedited shipping where available. IAS Avionics, Kelowna, BC.",
    },
  },
  {
    id: "laser-marking",
    slug: "laser-wire-marking",
    eyebrow: "Service 04",
    title: "Laser Wire Marking",
    navLabel: "Laser Wire Marking",
    card: {
      text: "Permanent, legible wire identification, marked in-house.",
      image: "/images/laser-wire/laser-marked-wire.jpg",
      alt: "Laser-marked wire with printed identification",
    },
    intro:
      "In-house laser wire marking for aircraft wiring projects, supporting clear wire identification, installation consistency, maintenance efficiency and professional aircraft wiring practices. Proper wire identification is critical for maintenance, troubleshooting, system modifications and regulatory compliance.",
    items: [
      "Permanent wire identification",
      "High-durability markings",
      "Clear, legible markings",
      "Compliance with aerospace industry specifications",
      "Customizable wire markings",
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
        "Precision laser wire marking for aerospace applications: permanent, high-durability, legible wire identification meeting aerospace industry specifications. Order marked wire from IAS Avionics in Kelowna, BC.",
    },
  },

  // --- Hub-only services: too little distinct content to sustain their own page. ---
  {
    id: "solutions",
    eyebrow: "Service 05",
    title: "Aircraft Solutions & Upgrades",
    card: {
      text: "Custom retrofit and modernization projects: IFR and VFR cockpit layouts, documentation and AutoCAD drawings.",
      image: "/images/home/Innovative-Aerospace-Services-jets-rewiring.jpg",
      alt: "Corporate jet in flight",
    },
    intro:
      "Custom electrical, avionics and instrument projects built around your aircraft and its operational requirements, from IFR and VFR cockpit layouts to full retrofit and modernization projects.",
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
    note: "IAS does not perform regulated engineering work directly. When engineering is required, it is supplied by registered third-party engineering firms. We plan, coordinate, document, install and complete the project with you.",
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
      text: "Avionics and electrical fault diagnosis, wiring inspections and repairs.",
      image: "/images/home/Innovative-Aerospace-Services-helicopter-electrical.jpg",
      alt: "Helicopter in flight",
    },
    intro:
      "Strong diagnostic capability across avionics and electrical systems, at the IAS facility or, when arrangements are made, at customer locations.",
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
      text: "Altimeter, transponder and encoder 24-month recertifications and more.",
      image: "/images/garmin/garmin-audio-panel-radio-stack.jpg",
      alt: "Technician operating a Garmin audio panel and radio stack",
    },
    intro:
      "Scheduled recertification services to keep your aircraft compliant, and help planning around recertification deadlines and seasonal maintenance requirements.",
    items: [
      "Altimeter, transponder and encoder 24-month recertifications",
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
    title: "Potential Future Requirements: ADS-B",
    card: {
      text: "ADS-B installation and integration, including support for Canadian operating requirements.",
      image: "/images/garmin/garmin-helicopter-adsb-cockpit.jpg",
      alt: "Garmin navigator and transponders showing ADS-B traffic and weather in a helicopter cockpit",
    },
    intro:
      "Canada is phasing in ADS-B Out performance requirements. We provide ADS-B upgrades, installations and equipment integration to help your aircraft meet applicable Canadian operating requirements as they take effect.",
    items: [
      "ADS-B upgrades",
      "ADS-B installations",
      "Equipment integration",
      "Support for Canadian ADS-B operating requirements",
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
      text: "Our “weight loss” program: during a rewire or retrofit, we identify obsolete equipment and unnecessary wiring that can come out.",
      image: "/images/home/Innovative-Aerospace-rewire-projects.jpg",
      alt: "Aircraft wiring reviewed during a retrofit project",
    },
    intro:
      "Think of it as a “weight loss” program for your aircraft. As part of a rewire or retrofit (with an IFR or VFR layout), we can review your aircraft's wiring and installed equipment to identify obsolete equipment, unnecessary wiring and outdated installations that can be removed where legally and technically appropriate.",
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
