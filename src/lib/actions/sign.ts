"use server";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const MAX_MESSAGE_CHARS = 100;
// A drawn signature is a PNG data URL of a few KB; anything else would break the page that
// renders it (next/image only accepts data URLs or configured hosts).
const MAX_SIGNATURE_CHARS = 300_000;

export type SignResult = { ok: true } | { ok: false; error: string };

// Errors are returned rather than thrown: Next.js replaces thrown server action messages with
// a generic one in production, so the user would never see why signing failed.
export async function sign(formData: FormData): Promise<SignResult> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to sign the guestbook." };
  }

  const userId = session.user.id;
  const message = String(formData.get("message") ?? "").trim();
  const signature = String(formData.get("signature") ?? "");

  if (message.length === 0) {
    return { ok: false, error: "Please enter a message." };
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return { ok: false, error: `Please keep your message under ${MAX_MESSAGE_CHARS} characters.` };
  }
  if (
    signature &&
    (!signature.startsWith("data:image/png;base64,") || signature.length > MAX_SIGNATURE_CHARS)
  ) {
    return { ok: false, error: "That signature couldn't be saved. Please clear it and try again." };
  }

  try {
    const hasMadePostQuery = await db.execute({
      sql: "SELECT id FROM post WHERE user_id = ? LIMIT 1",
      args: [userId],
    });

    if (hasMadePostQuery.rows.length > 0) {
      return { ok: false, error: "You have already signed the guestbook." };
    }

    await db.execute({
      sql: "INSERT INTO post (id, created_at, message, user_id, signature) VALUES (?, ?, ?, ?, ?)",
      args: [
        "post_" + crypto.randomUUID(),
        Math.floor(Date.now() / 1000),
        message,
        userId,
        signature,
      ],
    });
  } catch (error) {
    console.error("[guestbook] Failed to save post:", error);
    return { ok: false, error: "Couldn't save your message right now. Please try again." };
  }

  revalidatePath("/guestbook");
  return { ok: true };
}
