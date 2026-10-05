import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { removeTestimonial, TESTIMONIALS_TAG, verifyRemovalToken } from "@/lib/testimonials";

/**
 * Removes a submitted review. Called from the confirmation page linked in the
 * notification email. Deliberately POST-only: email security scanners open
 * links in advance, and a GET that deleted would silently take reviews down.
 */
export async function POST(req: Request) {
  let body: { id?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = body.id ?? "";
  const token = body.token ?? "";
  if (!id || !token || !verifyRemovalToken(id, token)) {
    return NextResponse.json({ error: "This removal link isn't valid." }, { status: 403 });
  }

  try {
    const removed = await removeTestimonial(id);
    revalidateTag(TESTIMONIALS_TAG);
    revalidatePath("/testimonials");
    revalidatePath("/");
    return NextResponse.json({ ok: true, removed });
  } catch (err) {
    console.error("[testimonials] remove failed:", err);
    return NextResponse.json(
      { error: "Couldn't remove the review right now. Please try again." },
      { status: 502 }
    );
  }
}
