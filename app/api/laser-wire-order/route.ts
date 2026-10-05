import { NextResponse } from "next/server";
import { esc, isEmail, mailConfigured, sendMail } from "@/lib/mail";
import { looksAutomated } from "@/lib/spam";
import { findWire } from "@/lib/wireCatalog";

type OrderRow = {
  code: string;
  length: string;
  qty: string;
};

export async function POST(req: Request) {
  const to = process.env.LASER_WIRE_TO_EMAIL || "nancy@iasavionics.ca";

  if (!mailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Online ordering is temporarily unavailable. Please download the order form and email it to nancy@iasavionics.ca.",
      },
      { status: 503 }
    );
  }

  let body: {
    contact?: { name?: string; email?: string; phone?: string; notes?: string };
    rows?: OrderRow[];
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
  const rows = (body.rows ?? []).filter((r) => r.code && r.length && r.qty);

  if (!name || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email address." },
      { status: 400 }
    );
  }
  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Please complete at least one wire line." },
      { status: 400 }
    );
  }
  if (rows.length > 200) {
    return NextResponse.json(
      { error: "Too many lines in one request. Please email the order form instead." },
      { status: 400 }
    );
  }

  const tableRows = rows
    .map((r) => {
      const wire = findWire(r.code);
      return `<tr>
        <td style="padding:6px 10px;border:1px solid #BFC3C7;">${esc(r.code)}</td>
        <td style="padding:6px 10px;border:1px solid #BFC3C7;">${esc(r.length)}</td>
        <td style="padding:6px 10px;border:1px solid #BFC3C7;">${esc(wire?.description ?? "")}</td>
        <td style="padding:6px 10px;border:1px solid #BFC3C7;">${esc(wire?.milSpec ?? "")}</td>
        <td style="padding:6px 10px;border:1px solid #BFC3C7;">${esc(r.qty)}</td>
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
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">WIRE CODE</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">LENGTH (")</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">WIRE TYPE</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">MIL-SPEC</th>
          <th style="padding:6px 10px;border:1px solid #BFC3C7;">QTY</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#333;">
      This submission is a request for a quotation, not a confirmed order.
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
        error:
          "We couldn't send your request right now. Please download the order form and email it to nancy@iasavionics.ca.",
      },
      { status: 502 }
    );
  }
}
