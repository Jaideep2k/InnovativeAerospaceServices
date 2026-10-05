import { Resend } from "resend";

/**
 * One delivery path for every form on the site.
 *
 * The previous WordPress site sent all form mail through SendGrid (SMTP relay,
 * from no-reply@iasavionics.ca to nancy@iasavionics.ca). Using SendGrid's HTTP
 * API with the same sender means the domain authentication already set up in
 * that SendGrid account keeps working, with no DNS changes at launch.
 *
 * Resend remains supported as an alternative: whichever key is set is used,
 * SendGrid first.
 */

export const DEFAULT_FROM = "Innovative Aerospace Services Ltd <no-reply@iasavionics.ca>";
export const DEFAULT_INBOX = "nancy@iasavionics.ca";

export type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export function mailConfigured(): boolean {
  return Boolean(process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
}

/** Where general inquiries and reviews go. Same inbox the old site used. */
export function inbox(): string {
  return process.env.CONTACT_TO_EMAIL || DEFAULT_INBOX;
}

function fromAddress(): string {
  return process.env.MAIL_FROM || process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
}

/** "Name <addr>" or "addr" into SendGrid's { email, name } shape. */
function parseAddress(raw: string): { email: string; name?: string } {
  const m = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (!m) return { email: raw.trim() };
  return m[1] ? { email: m[2], name: m[1].replace(/^"|"$/g, "") } : { email: m[2] };
}

/** Throws on failure so callers can return their own fallback message. */
export async function sendMail(mail: Mail): Promise<void> {
  const from = fromAddress();

  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: mail.to.split(",").map((a) => parseAddress(a)) }],
        from: parseAddress(from),
        ...(mail.replyTo ? { reply_to: parseAddress(mail.replyTo) } : {}),
        subject: mail.subject,
        content: [{ type: "text/html", value: mail.html }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`SendGrid ${res.status}: ${detail.slice(0, 300)}`);
    }
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const { error } = await new Resend(resendKey).emails.send({
      from,
      to: mail.to.split(",").map((a) => a.trim()),
      replyTo: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
    });
    if (error) throw new Error(`Resend: ${error.message}`);
    return;
  }

  throw new Error("No mail provider configured (set SENDGRID_API_KEY or RESEND_API_KEY).");
}

export const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
