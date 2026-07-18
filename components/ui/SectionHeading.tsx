import Reveal from "@/components/motion/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  center?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  center = false,
}: SectionHeadingProps) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2
        className={`h-display text-3xl sm:text-4xl ${dark ? "text-white" : "text-jet"}`}
      >
        {title}
      </h2>
      <span className={`red-rule mt-5 ${center ? "mx-auto" : ""}`} />
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed ${dark ? "text-silver" : "text-charcoal"}`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
