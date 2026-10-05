"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Honeypot from "@/components/forms/Honeypot";

type Status = "idle" | "loading" | "success" | "error";

const ratingWords = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function TestimonialForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", context: "", email: "", text: "" });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [published, setPublished] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trap, setTrap] = useState("");
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!rating) {
      setStatus("error");
      setErrorMsg("Please choose a star rating.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating, website: trap, startedAt }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong sending your review.");
      setPublished(Boolean(data?.published));
      setStatus("success");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong sending your review."
      );
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border-l-4 border-aerored bg-white p-8 shadow-sm">
        <h3 className="font-heading text-xl font-extrabold uppercase text-jet">
          Thank you for your review!
        </h3>
        <p className="mt-3 text-sm leading-relaxed">
          {published
            ? "Your review is now posted on this page. We appreciate you taking the time."
            : "We've received your review and will post it shortly. We appreciate you taking the time."}
        </p>
      </div>
    );
  }

  const shown = hover || rating;
  const busy = status === "loading";

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5">
      <Honeypot value={trap} onChange={setTrap} />

      <fieldset>
        <legend className="label">
          Your rating <span className="text-aerored">*</span>
        </legend>
        <div className="flex items-center gap-3" onMouseLeave={() => setHover(0)}>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <label
                key={n}
                className="cursor-pointer p-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-aerored"
                onMouseEnter={() => setHover(n)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  disabled={busy}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className="sr-only"
                />
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`h-8 w-8 transition-colors ${
                    n <= shown ? "fill-aerored" : "fill-silver/60"
                  }`}
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L10 14.9l-5.25 2.7 1-5.8L1.5 7.7l5.9-.9z" />
                </svg>
              </label>
            ))}
          </div>
          <span className="min-w-[6rem] text-sm font-semibold text-charcoal/80" aria-hidden="true">
            {ratingWords[shown]}
          </span>
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="t-name" className="label">
            Name <span className="text-aerored">*</span>
          </label>
          <input
            id="t-name"
            required
            maxLength={80}
            className="input"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={busy}
          />
        </div>
        <div>
          <label htmlFor="t-context" className="label">
            Company or aircraft
          </label>
          <input
            id="t-context"
            maxLength={80}
            className="input"
            placeholder="e.g. PC-12 owner, Calgary"
            autoComplete="organization"
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
            disabled={busy}
          />
        </div>
      </div>

      <div>
        <label htmlFor="t-text" className="label">
          Your review <span className="text-aerored">*</span>
        </label>
        <textarea
          id="t-text"
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          className="input resize-y"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          disabled={busy}
        />
        <p className="mt-1 text-right text-xs text-charcoal/60">{form.text.length}/1000</p>
      </div>

      <div>
        <label htmlFor="t-email" className="label">
          Email
        </label>
        <input
          id="t-email"
          type="email"
          className="input"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={busy}
        />
        <p className="mt-1.5 text-xs text-charcoal/70">
          Optional. Only IAS sees this, in case we&rsquo;d like to thank you or follow up.
          It is never shown on the website.
        </p>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="border-l-4 border-aerored bg-aerored/5 p-4 text-sm font-semibold text-aerored"
        >
          {errorMsg}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={busy} className="btn-red disabled:opacity-60">
          {busy ? "Posting…" : "Post My Review"}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-charcoal/70">
          Your name, rating and review will appear publicly on this page.
        </p>
      </div>
    </form>
  );
}
