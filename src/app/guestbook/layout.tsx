import { getAuthSession } from "@/lib/auth"; // <-- Import from our new helper
import { db } from "@/lib/db";
import GuestbookActions from "./GuestbookActions";

export default async function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession(); // <-- Use our new helper
  let hasPosted = false;

  if (session?.user?.id) {
    const postResult = await db.execute({
      sql: "SELECT id FROM post WHERE user_id = ? LIMIT 1",
      args: [session.user.id],
    });
    hasPosted = postResult.rows.length > 0;
  }

  return (
    <div className="space-y-8">
      <GuestbookActions session={session} hasPosted={hasPosted} />
      <div className="mt-4">{children}</div>
    </div>
  );
}