import { NextResponse } from "next/server";
import { esc, inbox, isEmail, mailConfigured, sendMail } from "@/lib/mail";
import { looksAutomated } from "@/lib/spam";

export async function POST(req: Request) {
  if (!mailConfigured()) {
    return NextResponse.json(
      {
        error:
          "The contact form is temporarily unavailable. Please call 778-753-0250.",
      },
      { status: 503 }
    );
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    website?: string;
    startedAt?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (looksAutomated(body)) return NextResponse.json({ ok: true });

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !isEmail(email) || !message) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email address and a message." },
      { status: 400 }
    );
  }
  if (name.length > 200 || phone.length > 50 || message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  try {
    await sendMail({
      to: inbox(),
      replyTo: email,
      subject: `Website inquiry from ${name}`,
      html: `
        <h2 style="font-family:Arial,sans-serif;">Website inquiry</h2>
        <p style="font-family:Arial,sans-serif;">
          <strong>Name:</strong> ${esc(name)}<br/>
          <strong>Email:</strong> ${esc(email)}<br/>
          <strong>Phone:</strong> ${esc(phone) || "Not provided"}
        </p>
        <p style="font-family:Arial,sans-serif;white-space:pre-wrap;">${esc(message)}</p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#666;">
          Sent from the contact form on iasavionics.ca. Reply to this email to answer ${esc(name)} directly.
        </p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't send your message right now. Please call 778-753-0250 or try again later.",
      },
      { status: 502 }
    );
  }
}
