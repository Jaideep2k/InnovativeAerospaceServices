import type { Metadata } from "next";
import { Raleway, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/motion/Preloader";
import PageTransition from "@/components/motion/PageTransition";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const description =
  "Innovative Aerospace Services Ltd. (IAS Avionics) provides avionics and electrical installations, aircraft rewiring, wiring harnesses, laser wire marking, troubleshooting, repairs and recertifications at Kelowna International Airport (CYLW).";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "IAS Avionics | Innovative Aerospace Services Ltd. — Kelowna, BC",
    template: "%s | IAS Avionics",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.shortName,
    locale: "en_CA",
    description,
  },
  twitter: {
    card: "summary_large_image",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${openSans.variable}`}>
      <body>
        <LocalBusinessJsonLd />
        <Preloader />
        <Header />
        <PageTransition>
          <main>{children}</main>
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
