/**
 * Permanent redirects from the old WordPress site's URLs, so bookmarks,
 * links customers have saved and existing Google results keep working.
 * Pages whose path didn't change (/about, /services, /projects, /contact,
 * /aog, /careers, /laser-marked-wire-order-form) need no entry; WordPress's
 * trailing slashes are handled by Next's default trailing-slash redirect.
 */
const oldSiteRedirects = [
  ["/aircraft-rewiring-services", "/services/aircraft-rewiring"],
  ["/laser-wire-marking", "/services/laser-wire-marking"],
  ["/avionics-equipment-sales-installation", "/services/avionics"],
  ["/helicopter-repair-services", "/helicopter-avionics-electrical"],
  ["/frequently-asked-questions-faq", "/faq"],
  ["/blog", "/"],
  ["/project/:slug*", "/projects"],
  ["/project_category/:slug*", "/projects"],
  ["/feed", "/"],
  ["/comments/feed", "/"],
  ["/wp-login.php", "/"],
  ["/wp-admin/:path*", "/"],
  // Documents customers and auditors may have saved links to.
  ["/wp-content/uploads/IAS-WWW-LASER-WIRE-MARKING-ORDER-TEMPLATE.xlsx", "/files/IAS-LASER-WIRE-MARKING-ORDER-TEMPLATE.xlsx"],
  ["/wp-content/uploads/:file(IAS-AMO-[A-Z-]+\\.pdf)", "/files/:file"],
].map(([source, destination]) => ({ source, destination, permanent: true }));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return oldSiteRedirects;
  },
};

export default nextConfig;
