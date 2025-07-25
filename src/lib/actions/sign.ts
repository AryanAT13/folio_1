"use server";

import { getAuthSession } from "@/lib/auth"; // <-- Import from our new helper
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sign(formData: FormData) {
  const session = await getAuthSession(); // <-- Use our new helper

  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to sign.");
  }
  
  const userId = session.user.id;
  const message = formData.get("message") as string;
  const signature = formData.get("signature") as string;

  if (!message || message.trim().length === 0) {
    throw new Error("Please enter a message.");
  }

  const hasMadePostQuery = await db.execute({
    sql: "SELECT id FROM post WHERE user_id = ?",
    args: [userId],
  });

  if (hasMadePostQuery.rows.length > 0) {
    throw new Error("You have already signed the guestbook.");
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

  revalidatePath("/guestbook");
}