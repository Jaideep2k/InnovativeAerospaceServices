import { NextResponse } from "next/server";
import { Resend } from "resend";
import { findWire } from "@/lib/wireCatalog";

type OrderRow = {
  code: string;
  length: string;
  qty: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.LASER_WIRE_TO_EMAIL || "nancy@iasavionics.ca";

  if (!apiKey || !from) {
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
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.contact?.name?.trim() ?? "";
  const email = body.contact?.email?.trim() ?? "";
  const phone = body.contact?.phone?.trim() ?? "";
  const notes = body.contact?.notes?.trim() ?? "";
  const rows = (body.rows ?? []).filter((r) => r.code && r.length && r.qty);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      { error: "Too many lines in one request — please email the order form instead." },
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
    <h2 style="font-family:Arial,sans-serif;">Laser Marked Wire — Quotation Request (website)</h2>
    <p style="font-family:Arial,sans-serif;">
      <strong>Name:</strong> ${esc(name)}<br/>
      <strong>Email:</strong> ${esc(email)}<br/>
      <strong>Phone:</strong> ${esc(phone) || "—"}<br/>
      <strong>Notes:</strong> ${esc(notes) || "—"}
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
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Laser Marked Wire quotation request — ${name}`,
      html,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't send your request right now. Please download the order form and email it to nancy@iasavionics.ca.",
      },
      { status: 502 }
    );
  }
}
