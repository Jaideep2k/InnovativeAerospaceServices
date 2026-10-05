import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Hero from "@/components/sections/Hero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import TestimonialCard, { Stars } from "@/components/ui/TestimonialCard";
import TestimonialForm from "@/components/forms/TestimonialForm";
import { getTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = pageMeta({
  title: "Testimonials",
  description:
    "Reviews from aircraft owners and operators who have worked with IAS Avionics at Kelowna International Airport. Share your own experience.",
  path: "/testimonials",
});

// Re-read periodically; new submissions also revalidate this page instantly.
export const revalidate = 300;

/**
 * When IAS has a Google Business Profile with reviews, set
 * NEXT_PUBLIC_GOOGLE_REVIEW_URL to its "write a review" link and the page will
 * point visitors there as well.
 */
const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const average =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / Math.max(testimonials.length, 1);

  return (
    <>
      <Hero
        compact
        image="/images/projects/212-MAR-B2-1.jpg"
        imageAlt="Bell 212 rewire project at the IAS Avionics hangar"
        words={["What", "Customers", "Say"]}
        sub="Honest feedback from the owners and operators we work with. Worked with us? We'd be grateful if you shared your experience."
      >
        <a href="#write-a-review" className="btn-red">
          Write a Review
        </a>
      </Hero>

      <section className="py-16">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Testimonials" title="Customer Reviews" />
            {testimonials.length > 0 && (
              <Reveal className="flex items-center gap-3">
                <Stars rating={Math.round(average)} />
                <p className="text-sm font-semibold text-jet">
                  {average.toFixed(1)} average from {testimonials.length} review
                  {testimonials.length === 1 ? "" : "s"}
                </p>
              </Reveal>
            )}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>

      <section id="write-a-review" className="scroll-mt-28 border-t border-silver/40 bg-white py-16">
        <div className="wrap grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading
              eyebrow="Share your experience"
              title="Write a Review"
              intro="Tell other operators what it was like working with IAS. Your review is posted on this page as soon as you submit it."
            />
            {googleReviewUrl && (
              <Reveal delay={0.1}>
                <p className="mt-6 text-sm leading-relaxed">
                  You can also review us on Google, which helps other aircraft
                  owners find us.
                </p>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark mt-4"
                >
                  Review Us on Google
                </a>
              </Reveal>
            )}
          </div>
          <Reveal delay={0.15} className="border border-silver/50 bg-white p-6 sm:p-9">
            <TestimonialForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
