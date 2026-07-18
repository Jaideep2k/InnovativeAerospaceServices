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
    street: "1-6280 Lapointe Drive",
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

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/aog", label: "AOG" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;
