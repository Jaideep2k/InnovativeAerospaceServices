import { site } from "@/lib/site";
import { faq } from "@/lib/faq";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Serialised server-side from our own typed content — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Maps site.hours prose into schema.org openingHoursSpecification. */
const openingHours = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
];

/**
 * LocalBusiness schema for the single Kelowna facility.
 * Emitted once from the root layout so it is present on every page.
 */
export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${site.url}/#business`,
        name: site.legalName,
        alternateName: site.shortName,
        slogan: site.tagline,
        url: site.url,
        telephone: site.phone,
        email: site.aogEmail,
        foundingDate: String(site.established),
        description:
          "Specialized avionics and electrical services for rotary-wing and fixed-wing aircraft — installations, aircraft rewiring, wiring harnesses, laser wire marking, troubleshooting, repairs and recertifications at Kelowna International Airport (CYLW).",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          postalCode: site.address.postal,
          addressCountry: "CA",
        },
        areaServed: [
          { "@type": "Place", name: "Okanagan" },
          { "@type": "Place", name: "British Columbia" },
          { "@type": "Country", name: "Canada" },
        ],
        openingHoursSpecification: openingHours,
        knowsAbout: [
          "Aircraft rewiring services",
          "Aircraft electrical repairs",
          "Aviation electrical systems",
          "Helicopter electrical maintenance",
          "Avionics installation",
          "Avionics upgrades",
          "Laser wire marking",
          "Aircraft wiring harnesses",
          "Aircraft modification services",
        ],
      }}
    />
  );
}

/** FAQPage schema generated from lib/faq.ts — keep in sync automatically. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: { "@type": "Answer", text: entry.a },
        })),
      }}
    />
  );
}
