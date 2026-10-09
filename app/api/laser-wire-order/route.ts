import { NextResponse } from "next/server";
import { esc, isEmail, mailConfigured, sendMail } from "@/lib/mail";
import { looksAutomated } from "@/lib/spam";
import { findWire } from "@/lib/wireCatalog";
import { site } from "@/lib/site";

/**
 * One line of the IAS laser wire order template
 * (WIRE CODE · LENGTH (") · WIRE TYPE · QTY):
 * - markedCode: the text the customer wants laser-printed on the wire
 *   (the template's WIRE CODE column). Free text, no length cap.
 * - wireType: the catalogue wire code from lib/wireCatalog.ts
 *   (the template's WIRE TYPE column).
 */
type OrderRow = {
  markedCode: string;
  wireType: string;
  length: string;
  qty: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  const to = process.env.LASER_WIRE_TO_EMAIL || site.laserWireEmail;

  if (!mailConfigured()) {
    return NextResponse.json(
      {
        error: `Online ordering is temporarily unavailable. Please download the order form and email it to ${site.laserWireEmail}.`,
      },
      { status: 503 }
    );
  }

  let body: {
    contact?: { name?: string; email?: string; phone?: string; notes?: string };
    rows?: Partial<Record<keyof OrderRow, unknown>>[];
    website?: string;
    startedAt?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (looksAutomated(body)) return NextResponse.json({ ok: true });

  const name = body.contact?.name?.trim() ?? "";
  const email = body.contact?.email?.trim() ?? "";
  const phone = body.contact?.phone?.trim() ?? "";
  const notes = body.contact?.notes?.trim() ?? "";
  // Blank lines are ignored; partly filled lines are rejected, never dropped.
  const rows: OrderRow[] = (Array.isArray(body.rows) ? body.rows : [])
    .map((r) => ({
      markedCode: str(r?.markedCode),
      wireType: str(r?.wireType),
      length: str(r?.length),
      qty: str(r?.qty),
    }))
    .filter((r) => r.markedCode || r.wireType || r.length || r.qty);
  const complete = (r: OrderRow) => Boolean(r.markedCode && r.wireType && r.length && r.qty);

  if (!name || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email address." },
      { status: 400 }
    );
  }
  if (rows.length === 0 || !rows.every(complete)) {
    return NextResponse.json(
      {
        error: `Please complete ${rows.length === 0 ? "at least one wire line" : "every wire line"} (marked wire code, wire type, length and quantity).`,
      },
      { status: 400 }
    );
  }
  if (!rows.every((r) => findWire(r.wireType))) {
    return NextResponse.json(
      { error: "Please choose each wire type from the list." },
      { status: 400 }
    );
  }
  if (rows.length > 200) {
    return NextResponse.json(
      { error: "Too many lines in one request. Please email the order form instead." },
      { status: 400 }
    );
  }

  const cell = "padding:6px 10px;border:1px solid #BFC3C7;vertical-align:top;";
  const tableRows = rows
    .map((r) => {
      const wire = findWire(r.wireType);
      const wireType = wire ? `${wire.code}: ${wire.description}` : r.wireType;
      return `<tr>
        <td style="${cell}white-space:pre-wrap;word-break:break-word;font-family:Consolas,'Courier New',monospace;">${esc(r.markedCode)}</td>
        <td style="${cell}">${esc(r.length)}</td>
        <td style="${cell}">${esc(wireType)}</td>
        <td style="${cell}">${esc(wire?.milSpec ?? "")}</td>
        <td style="${cell}">${esc(r.qty)}</td>
      </tr>`;
    })
    .join("");

  const html = `
    <h2 style="font-family:Arial,sans-serif;">Laser Marked Wire Quotation Request (website)</h2>
    <p style="font-family:Arial,sans-serif;">
      <strong>Name:</strong> ${esc(name)}<br/>
      <strong>Email:</strong> ${esc(email)}<br/>
      <strong>Phone:</strong> ${esc(phone) || "Not provided"}<br/>
      <strong>Notes:</strong> ${esc(notes) || "None"}
    </p>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      <thead>
        <tr style="background:#0D0D0D;color:#fff;">
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">MARKED WIRE CODE</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">LENGTH (")</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">WIRE TYPE</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">MIL-SPEC</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">QTY</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#333;">
      MARKED WIRE CODE is the text to laser-print on the wire, exactly as the
      customer entered it. This submission is a request for a quotation, not a
      confirmed order.
    </p>`;

  try {
    await sendMail({
      to,
      replyTo: email,
      subject: `Laser Marked Wire quotation request from ${name}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[laser-wire-order] send failed:", err);
    return NextResponse.json(
      {
        error: `We couldn't send your request right now. Please download the order form and email it to ${site.laserWireEmail}.`,
      },
      { status: 502 }
    );
  }
}
