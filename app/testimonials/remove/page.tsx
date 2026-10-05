import type { Metadata } from "next";
import RemoveReview from "./RemoveReview";

export const metadata: Metadata = {
  title: "Remove a Review",
  robots: { index: false, follow: false },
};

export default async function RemoveReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id = "", token = "" } = await searchParams;
  return (
    <section className="py-24">
      <div className="wrap max-w-xl">
        <h1 className="h-display text-3xl">Remove this review?</h1>
        <span className="red-rule mt-4" />
        <p className="mt-6 text-sm leading-relaxed">
          This takes the review off the Testimonials page permanently. Use it for
          spam or anything that shouldn&rsquo;t be shown publicly.
        </p>
        <RemoveReview id={id} token={token} />
      </div>
    </section>
  );
}
