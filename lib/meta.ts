import type { Metadata } from "next";

/**
 * Builds a page's metadata from a single source so the <title>, the canonical
 * URL and the OpenGraph/Twitter share card can never drift apart.
 *
 * `title` is the short page name — the root layout's template appends
 * "| IAS Avionics" to the document title, and we mirror that suffix onto the
 * share card, which Next does not derive automatically.
 */
export function pageMeta({
  title,
  description,
  path,
  fullTitle,
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/faq". Resolved against metadataBase. */
  path: string;
  /** Override when the page sets its own complete title (the homepage). */
  fullTitle?: string;
}): Metadata {
  const shareTitle = fullTitle ?? `${title} | IAS Avionics`;
  return {
    title: fullTitle ?? title,
    description,
    alternates: { canonical: path },
    openGraph: { title: shareTitle, description, url: path },
    twitter: { title: shareTitle, description },
  };
}
