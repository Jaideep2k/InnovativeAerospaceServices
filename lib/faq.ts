import { site } from "@/lib/site";

export type FaqEntry = { q: string; a: string };

/**
 * Single source of truth for the FAQ page and its FAQPage structured data.
 * Answers are plain text — they are rendered as-is and also serialised into
 * JSON-LD, so keep them free of markup.
 */
export const faq: FaqEntry[] = [
  {
    q: "How do I know if my aircraft needs rewiring?",
    a: "Signs may include intermittent electrical issues, aging (yellowing) wiring, corrosion, damaged insulation, recurring avionics faults, or wiring that no longer meets operational requirements. If you are chasing the same fault more than once, a rewire is often the cheaper fix over the life of the aircraft.",
  },
  {
    q: "What is laser wire marking?",
    a: "Laser wire marking permanently identifies wires and cables with durable, legible markings that assist with maintenance, troubleshooting, system modifications and regulatory compliance. IAS marks wire in-house, both for our own projects and for customer orders.",
  },
  {
    q: "Do you work on helicopters and fixed wing?",
    a: "Yes. We provide electrical, avionics, wiring and repair support for a variety of operators and aircraft types — from light aircraft through medium and heavy helicopters, and from general aviation to corporate jets.",
  },
  {
    q: "Can you supply avionics equipment?",
    a: "Yes. We offer avionics equipment sales, installation, upgrades and integration services, and we are an authorized Garmin Aviation dealer — the only Garmin dealer in Kelowna.",
  },
  {
    q: "How long does an avionics installation take?",
    a: "Project timelines vary depending on the complexity of the installation and the aircraft type. We provide detailed estimates during consultation, and expected expenses are discussed before any work begins.",
  },
  {
    q: "Do you offer consultations?",
    a: "Yes. We offer consultations to discuss aircraft maintenance, rewiring projects, avionics upgrades and electrical troubleshooting requirements. You review and approve the proposed work before installation starts.",
  },
  {
    q: "Where are you located?",
    a: `We are located at ${site.address.facility}, at ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}.`,
  },
  {
    q: "Do you handle AOG situations?",
    a: `Yes. If your aircraft is on the ground, email ${site.aogEmail} or call ${site.phone}. Weekend work is available by appointment, and AOG support is available outside standard business hours.`,
  },
  {
    q: "Do you travel to the aircraft, or does it have to come to you?",
    a: "Both. We assist customers at our Kelowna facility, at your hangar or location, in the field, and at remote operating locations when arrangements can be made.",
  },
  {
    q: "Do you perform the engineering for a modification?",
    a: "IAS does not perform regulated engineering work directly. Where a project requires it, engineering is supplied by registered third-party engineering firms — we help you plan, coordinate, document, install and complete the project.",
  },
];
