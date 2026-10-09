"use client";

import { useRef, useState } from "react";
import { wireCatalog, findWire } from "@/lib/wireCatalog";
import { site } from "@/lib/site";
import Honeypot from "@/components/forms/Honeypot";

/**
 * One line of the IAS order template (WIRE CODE · LENGTH (") · WIRE TYPE · QTY).
 * markedCode is the template's WIRE CODE: free text to laser-print on the wire.
 * wireType is the catalogue code from lib/wireCatalog.ts.
 */
type Row = {
  id: number;
  markedCode: string;
  wireType: string;
  length: string;
  qty: string;
};

type Status = "idle" | "loading" | "success" | "error";

const FIELDS_HINT = "marked wire code, wire type, length and quantity";

const blankRow = (id: number): Row => ({ id, markedCode: "", wireType: "", length: "", qty: "" });

const filled = (r: Row) => ({
  markedCode: r.markedCode.trim(),
  wireType: r.wireType,
  length: r.length.trim(),
  qty: r.qty.trim(),
});

/** Grow a textarea to fit its text; rows={2} stays the minimum height. */
function fitToContent(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
}

export default function LaserWireOrderForm() {
  const nextId = useRef(1);
  const [rows, setRows] = useState<Row[]>(() => [blankRow(0)]);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [trap, setTrap] = useState("");
  const [startedAt] = useState(() => Date.now());

  const setRow = (i: number, patch: Partial<Omit<Row, "id">>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const addRow = () => setRows((r) => [...r, blankRow(nextId.current++)]);
  const removeRow = (i: number) =>
    setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    // Untouched lines are ignored; a line that is only partly filled is an error.
    const lines = rows.map(filled);
    const partial = lines.findIndex((r) => {
      const n = [r.markedCode, r.wireType, r.length, r.qty].filter(Boolean).length;
      return n > 0 && n < 4;
    });
    if (partial !== -1) {
      setStatus("error");
      setErrorMsg(`Please complete wire line ${partial + 1} (${FIELDS_HINT}).`);
      return;
    }
    const validRows = lines.filter((r) => r.markedCode && r.wireType && r.length && r.qty);
    if (validRows.length === 0) {
      setStatus("error");
      setErrorMsg(`Please complete at least one wire line (${FIELDS_HINT}).`);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/laser-wire-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          website: trap,
          startedAt,
          rows: validRows,
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
          Thank you, your laser marked wire request has been sent. IAS will
          contact you with a quotation for your order. Submitting this form is
          a request for a quotation only; it is not a purchase or a confirmed
          order.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="relative">
      <Honeypot value={trap} onChange={setTrap} />
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
          Fill out one line per marked wire you are requesting.{" "}
          <strong>Marked wire code</strong> is the text to laser-print on the
          wire, exactly as it should appear; <strong>wire type</strong> is the
          wire it is printed on (see Wire Types below). On the downloadable
          order form these are the WIRE CODE and WIRE TYPE columns.
        </p>

        <div className="space-y-4">
          {rows.map((row, i) => {
            const wire = findWire(row.wireType);
            return (
              <div
                key={row.id}
                className="grid gap-4 border border-silver/60 bg-white p-5 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_auto] sm:items-start"
              >
                <div className="sm:col-span-4">
                  <label htmlFor={`lw-marked-${i}`} className="label">
                    Marked wire code <span className="text-aerored">*</span>
                  </label>
                  <textarea
                    id={`lw-marked-${i}`}
                    rows={2}
                    className="input block resize-y"
                    value={row.markedCode}
                    onChange={(e) => {
                      fitToContent(e.currentTarget);
                      setRow(i, { markedCode: e.target.value });
                    }}
                    aria-describedby={`lw-marked-hint-${i}`}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    disabled={status === "loading"}
                  />
                  <p id={`lw-marked-hint-${i}`} className="mt-2 text-xs text-charcoal/70">
                    Exactly what to print on the wire.
                  </p>
                </div>
                <div>
                  <label htmlFor={`lw-type-${i}`} className="label">
                    Wire type <span className="text-aerored">*</span>
                  </label>
                  <select
                    id={`lw-type-${i}`}
                    className="input"
                    value={row.wireType}
                    onChange={(e) => setRow(i, { wireType: e.target.value })}
                    disabled={status === "loading"}
                  >
                    <option value="">Select a wire type…</option>
                    {wireCatalog.map((cat) => (
                      <optgroup key={cat.category} label={cat.category}>
                        {cat.wires.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code}: {w.description}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {wire && (
                    <p className="mt-2 text-xs text-charcoal/70">
                      {wire.description}
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
                {/* Top padding = label height, so the button lines up with the inputs. */}
                <div className="flex sm:pt-[1.375rem]">
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
          {!errorMsg.includes(site.laserWireEmail) &&
            ` If the problem persists, download the order form and email it to ${site.laserWireEmail}.`}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "loading"} className="btn-red disabled:opacity-60">
          {status === "loading" ? "Sending…" : "Request a Quotation"}
        </button>
        <p className="max-w-md text-xs leading-relaxed text-charcoal/70">
          Submitting this form is a request for a quotation. It is not an
          immediate purchase or a confirmed order. IAS will contact you with a
          quote.
        </p>
      </div>
    </form>
  );
}
