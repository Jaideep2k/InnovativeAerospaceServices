import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { esc, inbox, isEmail, mailConfigured, sendMail } from "@/lib/mail";
import { clientIp, looksAutomated } from "@/lib/spam";
import {
  addTestimonial,
  allowSubmission,
  removalToken,
  storeAvailable,
  TESTIMONIALS_TAG,
} from "@/lib/testimonials";

const LINK_PATTERN = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|ru|xyz|io|biz|info)\b)/i;

export async function POST(req: Request) {
  let body: {
    name?: string;
    context?: string;
    email?: string;
    rating?: number;
    text?: string;
    website?: string;
    startedAt?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (looksAutomated(body)) return NextResponse.json({ ok: true, published: true });

  const name = body.name?.trim() ?? "";
  const context = body.context?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const text = body.text?.trim() ?? "";
  const rating = Number(body.rating);

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (![1, 2, 3, 4, 5].includes(rating)) {
    return NextResponse.json({ error: "Please choose a star rating." }, { status: 400 });
  }
  if (text.length < 10) {
    return NextResponse.json(
      { error: "Please write a few words about your experience." },
      { status: 400 }
    );
  }
  if (text.length > 1000 || context.length > 80) {
    return NextResponse.json({ error: "Your review is too long." }, { status: 400 });
  }
  if (email && !isEmail(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }
  if (LINK_PATTERN.test(text) || LINK_PATTERN.test(name) || LINK_PATTERN.test(context)) {
    return NextResponse.json(
      { error: "Please remove any links or web addresses from your review." },
      { status: 400 }
    );
  }

  const fields = {
    name,
    context: context || undefined,
    email: email || undefined,
    rating: rating as 1 | 2 | 3 | 4 | 5,
    text,
  };

  let published = false;
  let removeUrl = "";
  try {
    if (storeAvailable()) {
      if (!(await allowSubmission(clientIp(req)))) {
        return NextResponse.json(
          { error: "Thanks! We've already received your review." },
          { status: 429 }
        );
      }
      const saved = await addTestimonial(fields);
      published = true;
      const origin = new URL(req.url).origin;
      removeUrl = `${origin}/testimonials/remove?id=${saved.id}&token=${removalToken(saved.id)}`;
      revalidateTag(TESTIMONIALS_TAG);
      revalidatePath("/testimonials");
      revalidatePath("/");
    }
  } catch (err) {
    console.error("[testimonials] save failed:", err);
  }

  // Let IAS know either way. If saving failed, this email is the review.
  let emailed = false;
  if (mailConfigured()) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    try {
      await sendMail({
        to: inbox(),
        replyTo: email || undefined,
        subject: `New ${rating}-star review from ${name}${published ? " (now live on the website)" : ""}`,
        html: `
          <h2 style="font-family:Arial,sans-serif;">New website review</h2>
          <p style="font-family:Arial,sans-serif;font-size:20px;color:#E31B23;margin:0;">${stars}</p>
          <p style="font-family:Arial,sans-serif;white-space:pre-wrap;">${esc(text)}</p>
          <p style="font-family:Arial,sans-serif;">
            <strong>Name:</strong> ${esc(name)}<br/>
            <strong>Company / aircraft:</strong> ${esc(context) || "Not provided"}<br/>
            <strong>Email (private):</strong> ${esc(email) || "Not provided"}
          </p>
          ${
            published
              ? `<p style="font-family:Arial,sans-serif;">This review is now showing on the Testimonials page.
                 If it is spam or shouldn't be shown, remove it here:<br/>
                 <a href="${esc(removeUrl)}">${esc(removeUrl)}</a></p>`
              : `<p style="font-family:Arial,sans-serif;">This review was <strong>not</strong> published automatically
                 because review storage isn't configured. Add it to lib/testimonials.ts to show it on the site.</p>`
          }`,
      });
      emailed = true;
    } catch (err) {
      console.error("[testimonials] notify failed:", err);
    }
  }

  if (!published && !emailed) {
    return NextResponse.json(
      {
        error:
          "We couldn't save your review right now. Please try again later or call 778-753-0250.",
      },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true, published });
}
