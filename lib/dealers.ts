/**
 * Manufacturer lines IAS is a dealer for, shown on /dealers ("Brands We
 * Carry"). The list was dictated by the client; uncertain spellings were
 * resolved against the product-line page of another BC avionics shop.
 *
 * Logos live in /public/images/dealers: transparent PNGs, trimmed and sized
 * to fit 640x160 (2x). `width`/`height` are the file's real pixel size.
 * A brand without a `logo` renders as a typographic wordmark tile.
 *
 * `url` is set only where the manufacturer's site was confirmed. It is kept
 * for reference and is not linked from the page, so visitors stay on the site.
 */
export type Dealer = {
  name: string;
  slug: string;
  logo?: { src: string; width: number; height: number };
  url?: string;
  /** Short secondary line under the name, e.g. the full company name. */
  note?: string;
  /** Internal IAS page for this brand, if one exists. */
  page?: string;
  /** Shown as the featured line above the grid instead of inside it. */
  featured?: boolean;
};

const logo = (slug: string, width: number, height: number) => ({
  src: `/images/dealers/${slug}.png`,
  width,
  height,
});

export const dealers: Dealer[] = [
  {
    name: "AEM",
    slug: "aem",
    logo: logo("aem", 402, 164),
    url: "https://www.aem-corp.com/",
  },
  {
    name: "Artex",
    slug: "artex",
    logo: logo("artex", 547, 164),
    url: "https://www.acrartex.com/",
    note: "ACR Electronics",
  },
  {
    name: "Avidyne",
    slug: "avidyne",
    logo: logo("avidyne", 644, 86),
    url: "https://www.avidyne.com/",
  },
  {
    name: "Becker Avionics",
    slug: "becker-avionics",
    logo: logo("becker-avionics", 596, 164),
    url: "https://becker-avionics.com/",
  },
  {
    name: "BendixKing",
    slug: "bendixking",
    logo: logo("bendixking", 644, 141),
  },
  {
    name: "Bose",
    slug: "bose",
    logo: logo("bose", 644, 82),
    url: "https://www.bose.com/aviation",
  },
  {
    name: "Canyon AeroConnect",
    slug: "canyon-aeroconnect",
    logo: logo("canyon-aeroconnect", 644, 147),
    url: "https://www.canyonaeroconnect.com/",
  },
  {
    name: "Cobham",
    slug: "cobham",
    logo: logo("cobham", 644, 73),
  },
  {
    name: "David Clark",
    slug: "david-clark",
    logo: logo("david-clark", 428, 164),
    url: "https://www.davidclarkcompany.com/",
  },
  {
    name: "Electronics International",
    slug: "electronics-international",
    logo: logo("electronics-international", 644, 142),
    url: "https://iflyei.com/",
  },
  {
    name: "Flight Data Systems",
    slug: "flight-data-systems",
    logo: logo("flight-data-systems", 644, 108),
    url: "https://www.fdatasystems.com/",
  },
  {
    name: "FreeFlight Systems",
    slug: "freeflight-systems",
    logo: logo("freeflight-systems", 473, 164),
    url: "https://freeflightsystems.com/",
  },
  {
    name: "Garmin",
    slug: "garmin",
    logo: { src: "/brand/garmin-logo.png", width: 1200, height: 173 },
    url: "https://www.garmin.com/en-CA/",
    note: "Authorized dealer",
    page: "/garmin-dealer",
    featured: true,
  },
  {
    name: "J.P. Instruments",
    slug: "jp-instruments",
    logo: logo("jp-instruments", 576, 164),
    url: "https://www.jpinstruments.com/",
    note: "JPI",
  },
  {
    name: "Jupiter Avionics",
    slug: "jupiter-avionics",
    logo: logo("jupiter-avionics", 644, 113),
    url: "https://jupiteravionics.com/",
  },
  {
    name: "Kannad",
    slug: "kannad",
    logo: logo("kannad", 644, 151),
  },
  {
    name: "L3Harris",
    slug: "l3harris",
    logo: logo("l3harris", 600, 164),
    url: "https://www.l3harris.com/",
  },
  {
    name: "Latitude Technologies",
    slug: "latitude-technologies",
    logo: logo("latitude-technologies", 373, 164),
    url: "https://www.latitudetech.com/",
  },
  {
    name: "Lightspeed",
    slug: "lightspeed",
    logo: logo("lightspeed", 644, 99),
    url: "https://www.lightspeedaviation.com/",
  },
  {
    name: "Mid-Continent",
    slug: "mid-continent",
    logo: logo("mid-continent", 644, 106),
    url: "https://www.mcico.com/",
    note: "Instruments & Avionics",
  },
  {
    name: "NAT",
    slug: "nat",
    logo: logo("nat", 408, 164),
    note: "Northern Airborne Technology",
  },
  {
    name: "PS Engineering",
    slug: "ps-engineering",
    logo: logo("ps-engineering", 644, 160),
    url: "https://www.ps-engineering.com/",
  },
  {
    name: "RC Allen Instruments",
    slug: "rc-allen",
    logo: logo("rc-allen", 544, 164),
    url: "https://www.kellymfg.com/",
  },
  {
    name: "Sandel",
    slug: "sandel",
    logo: logo("sandel", 644, 94),
  },
  {
    name: "SiriusXM Aviation",
    slug: "siriusxm",
    logo: logo("siriusxm", 644, 160),
    url: "https://www.siriusxm.com/aviation",
  },
  {
    name: "SKYTRAC",
    slug: "skytrac",
    url: "https://www.skytrac.ca/",
  },
  {
    name: "Technisonic",
    slug: "technisonic",
    logo: logo("technisonic", 644, 86),
    url: "https://til.ca/",
  },
  {
    name: "uAvionix",
    slug: "uavionix",
    logo: logo("uavionix", 410, 164),
    url: "https://uavionix.com/",
  },
  {
    name: "Universal Avionics",
    slug: "universal-avionics",
    logo: logo("universal-avionics", 644, 113),
    url: "https://universalavionics.com/",
  },
];
