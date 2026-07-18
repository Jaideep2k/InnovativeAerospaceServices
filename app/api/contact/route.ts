import { NextResponse } from "next/server";
import { Resend } from "resend";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !from || !to) {
    return NextResponse.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call 778-753-0250.",
      },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email address and a message." },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Website inquiry — ${name}`,
      html: `
        <h2 style="font-family:Arial,sans-serif;">Website inquiry</h2>
        <p style="font-family:Arial,sans-serif;">
          <strong>Name:</strong> ${esc(name)}<br/>
          <strong>Email:</strong> ${esc(email)}<br/>
          <strong>Phone:</strong> ${esc(phone) || "—"}
        </p>
        <p style="font-family:Arial,sans-serif;white-space:pre-wrap;">${esc(message)}</p>`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't send your message right now. Please call 778-753-0250 or try again later.",
      },
      { status: 502 }
    );
  }
}
