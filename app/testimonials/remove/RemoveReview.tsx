"use client";

import { useState } from "react";
import Link from "next/link";

export default function RemoveReview({ id, token }: { id: string; token: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function remove() {
    setStatus("loading");
    try {
      const res = await fetch("/api/testimonials/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Couldn't remove the review.");
      setMessage(data?.removed ? "The review has been removed." : "That review was already removed.");
      setStatus("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Couldn't remove the review.");
      setStatus("error");
    }
  }

  if (!id || !token) {
    return (
      <p className="mt-8 text-sm font-semibold text-aerored">
        This link is incomplete. Use the full link from the notification email.
      </p>
    );
  }

  if (status === "done") {
    return (
      <div className="mt-8">
        <p role="status" className="text-sm font-semibold text-jet">
          {message}
        </p>
        <Link href="/testimonials" className="btn-ghost-dark mt-6">
          View Testimonials
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={remove}
        disabled={status === "loading"}
        className="btn-red disabled:opacity-60"
      >
        {status === "loading" ? "Removing…" : "Yes, Remove Review"}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm font-semibold text-aerored">
          {message}
        </p>
      )}
    </div>
  );
}
