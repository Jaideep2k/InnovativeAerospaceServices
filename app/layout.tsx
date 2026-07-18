import type { Metadata } from "next";
import { Raleway, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/motion/Preloader";
import PageTransition from "@/components/motion/PageTransition";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "IAS Avionics | Innovative Aerospace Services Ltd. — Kelowna, BC",
    template: "%s | IAS Avionics",
  },
  description:
    "Innovative Aerospace Services Ltd. (IAS Avionics) provides avionics and electrical installations, aircraft rewiring, wiring harnesses, laser wire marking, troubleshooting, repairs and recertifications at Kelowna International Airport (CYLW).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${openSans.variable}`}>
      <body>
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
