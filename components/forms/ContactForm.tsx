"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong sending your message.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong sending your message."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-4 border-aerored bg-white p-8 shadow-sm">
        <h3 className="font-heading text-xl font-extrabold uppercase text-jet">
          Message sent
        </h3>
        <p className="mt-3 text-sm leading-relaxed">
          Thank you — we&rsquo;ve received your inquiry and will get back to
          you. For Aircraft on Ground emergencies, email{" "}
          <a href="mailto:aog@iasavionics.ca" className="font-semibold text-aerored">
            aog@iasavionics.ca
          </a>{" "}
          or call{" "}
          <a href="tel:+17787530250" className="font-semibold text-aerored">
            778-753-0250
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            Name <span className="text-aerored">*</span>
          </label>
          <input
            id="c-name"
            required
            className="input"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            Email <span className="text-aerored">*</span>
          </label>
          <input
            id="c-email"
            type="email"
            required
            className="input"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-phone" className="label">
          Phone
        </label>
        <input
          id="c-phone"
          type="tel"
          className="input"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          disabled={status === "loading"}
        />
      </div>
      <div>
        <label htmlFor="c-message" className="label">
          Message <span className="text-aerored">*</span>
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          className="input resize-y"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="border-l-4 border-aerored bg-aerored/5 p-4 text-sm font-semibold text-aerored">
          {errorMsg}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "loading"} className="btn-red disabled:opacity-60">
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-charcoal/70">
          Aircraft on Ground? Don&rsquo;t use this form — email{" "}
          <a href="mailto:aog@iasavionics.ca" className="font-semibold text-aerored">
            aog@iasavionics.ca
          </a>{" "}
          or call{" "}
          <a href="tel:+17787530250" className="font-semibold text-aerored">
            778-753-0250
          </a>
          .
        </p>
      </div>
    </form>
  );
}
