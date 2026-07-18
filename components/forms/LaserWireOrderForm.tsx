"use client";

import { useState } from "react";
import { wireCatalog, findWire } from "@/lib/wireCatalog";

type Row = {
  code: string;
  length: string;
  qty: string;
};

type Status = "idle" | "loading" | "success" | "error";

const emptyRow: Row = { code: "", length: "", qty: "" };

export default function LaserWireOrderForm() {
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const addRow = () => setRows((r) => [...r, { ...emptyRow }]);
  const removeRow = (i: number) =>
    setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const validRows = rows.filter((r) => r.code && r.length && r.qty);
    if (validRows.length === 0) {
      setStatus("error");
      setErrorMsg(
        "Please complete at least one wire line (wire code, length and quantity)."
      );
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/laser-wire-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          rows: validRows.map((r) => ({
            ...r,
            wireType: findWire(r.code)?.description ?? "",
            milSpec: findWire(r.code)?.milSpec ?? "",
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong sending your request.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong sending your request."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border-l-4 border-aerored bg-white p-8 shadow-sm">
        <h3 className="font-heading text-xl font-extrabold uppercase text-jet">
          Quotation request received
        </h3>
        <p className="mt-3 text-sm leading-relaxed">
          Thank you — your laser marked wire request has been sent. IAS will
          contact you with a quotation for your order. Submitting this form is
          a request for a quotation only; it is not a purchase or a confirmed
          order.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      {/* Contact block */}
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-heading text-lg font-extrabold uppercase text-jet">
          Your contact information
        </legend>
        <div>
          <label htmlFor="lw-name" className="label">
            Name <span className="text-aerored">*</span>
          </label>
          <input
            id="lw-name"
            required
            className="input"
            autoComplete="name"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="lw-email" className="label">
            Email <span className="text-aerored">*</span>
          </label>
          <input
            id="lw-email"
            type="email"
            required
            className="input"
            autoComplete="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="lw-phone" className="label">
            Phone
          </label>
          <input
            id="lw-phone"
            type="tel"
            className="input"
            autoComplete="tel"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="lw-notes" className="label">
            Order notes (optional)
          </label>
          <input
            id="lw-notes"
            className="input"
            value={contact.notes}
            onChange={(e) => setContact({ ...contact, notes: e.target.value })}
            disabled={status === "loading"}
          />
        </div>
      </fieldset>

      {/* Wire rows */}
      <fieldset className="mt-10">
        <legend className="mb-1 font-heading text-lg font-extrabold uppercase text-jet">
          Marked wire requested
        </legend>
        <p className="mb-5 text-sm text-charcoal/80">
          Fill out each field per marked wire you are requesting. Field names
          match the IAS laser wire order form: WIRE CODE · LENGTH (&quot;) ·
          WIRE TYPE · QTY.
        </p>

        <div className="space-y-4">
          {rows.map((row, i) => {
            const wire = findWire(row.code);
            return (
              <div
                key={i}
                className="grid gap-4 border border-silver/60 bg-white p-5 sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <div>
                  <label htmlFor={`lw-code-${i}`} className="label">
                    Wire code <span className="text-aerored">*</span>
                  </label>
                  <select
                    id={`lw-code-${i}`}
                    className="input"
                    value={row.code}
                    onChange={(e) => setRow(i, { code: e.target.value })}
                    disabled={status === "loading"}
                  >
                    <option value="">Select a wire code…</option>
                    {wireCatalog.map((cat) => (
                      <optgroup key={cat.category} label={cat.category}>
                        {cat.wires.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} — {w.description}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {wire && (
                    <p className="mt-2 text-xs text-charcoal/70">
                      WIRE TYPE: {wire.description}
                      {wire.milSpec ? ` · ${wire.milSpec}` : ""}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`lw-length-${i}`} className="label">
                    Length (&quot;) <span className="text-aerored">*</span>
                  </label>
                  <input
                    id={`lw-length-${i}`}
                    inputMode="decimal"
                    className="input"
                    value={row.length}
                    onChange={(e) => setRow(i, { length: e.target.value })}
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label htmlFor={`lw-qty-${i}`} className="label">
                    Qty <span className="text-aerored">*</span>
                  </label>
                  <input
                    id={`lw-qty-${i}`}
                    inputMode="numeric"
                    className="input"
                    value={row.qty}
                    onChange={(e) => setRow(i, { qty: e.target.value })}
                    disabled={status === "loading"}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1 || status === "loading"}
                    className="btn-ghost-dark !min-h-[46px] !px-4 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Remove wire line ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addRow}
          disabled={status === "loading"}
          className="btn-ghost-dark mt-5"
        >
          + Add Another Wire
        </button>
      </fieldset>

      {status === "error" && (
        <p role="alert" className="mt-6 border-l-4 border-aerored bg-aerored/5 p-4 text-sm font-semibold text-aerored">
          {errorMsg}
          {!errorMsg.includes("nancy@iasavionics.ca") &&
            " If the problem persists, download the order form below and email it to nancy@iasavionics.ca."}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "loading"} className="btn-red disabled:opacity-60">
          {status === "loading" ? "Sending…" : "Request a Quotation"}
        </button>
        <p className="max-w-md text-xs leading-relaxed text-charcoal/70">
          Submitting this form is a request for a quotation — it is not an
          immediate purchase or a confirmed order. IAS will contact you with a
          quote.
        </p>
      </div>
    </form>
  );
}
