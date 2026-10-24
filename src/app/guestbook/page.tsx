import { Card } from "@/components/ui/Card";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";
import GuestbookActions from "./GuestbookActions";

// Reads the session cookie and live data on every request.
export const dynamic = "force-dynamic";

export type Post = {
  id: string;
  message: string;
  created_at: number;
  signature: string;
  username: string;
  name: string;
  user_id: string;
};

// NextAuth redirects here with ?error=... (see `pages` in lib/auth.ts).
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Couldn't start GitHub sign-in. Please try again.",
  OAuthCallback: "GitHub sign-in didn't complete. Please try again.",
  Callback: "GitHub sign-in didn't complete. Please try again.",
  AccessDenied: "Couldn't finish signing you in. Please try again in a moment.",
  Configuration: "Sign-in is temporarily unavailable.",
};

async function getPosts(): Promise<Post[] | null> {
  try {
    const postResult = await db.execute({
      sql: `
        SELECT
          post.id as id,
          post.message as message,
          post.created_at as created_at,
          post.signature as signature,
          post.user_id as user_id,
          user.username as username,
          user.name as name
        FROM post
        JOIN user ON post.user_id = user.id
        ORDER BY post.created_at DESC
      `,
      args: [],
    });
    return postResult.rows as Post[];
  } catch (error) {
    console.error("[guestbook] Failed to load posts:", error);
    return null;
  }
}

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams: { error?: string | string[] };
}) {
  const [session, posts] = await Promise.all([getAuthSession(), getPosts()]);

  const userId = session?.user?.id;
  const hasPosted = Boolean(userId && posts?.some((post) => post.user_id === userId));

  const errorCode = Array.isArray(searchParams.error) ? searchParams.error[0] : searchParams.error;
  const authError = errorCode
    ? (AUTH_ERROR_MESSAGES[errorCode] ?? "Sign-in failed. Please try again.")
    : undefined;

  return (
    <div className="space-y-8">
      <GuestbookActions session={session} hasPosted={hasPosted} authError={authError} />
      <div className="mt-4">
        <PostList posts={posts} />
      </div>
    </div>
  );
}

function PostList({ posts }: { posts: Post[] | null }) {
  if (posts === null) {
    return (
      <div className="col-span-full text-center text-muted-foreground">
        <p>The guestbook couldn&apos;t be loaded right now. Please refresh in a moment.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground col-span-full">
        <p>No one has signed the guestbook yet. Be the first!</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => (
        <li key={post.id} className="flex">
          <Card className="flex h-full w-full flex-col justify-between space-y-4 p-6">
            <p className="break-words leading-6 text-card-foreground">{post.message}</p>
            <div className="mt-auto flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col justify-end text-sm text-muted-foreground">
                <p className="truncate font-bold text-card-foreground">
                  {post.name || `@${post.username}`}
                </p>
                <p>
                  {new Date(Number(post.created_at) * 1000).toLocaleString(
                    "en-US",
                    {
                      timeZone: "Asia/Kolkata",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    },
                  )}
                </p>
              </div>
              {post.signature?.startsWith("data:image/") && (
                <div className="-mb-4 -mr-4 shrink-0 dark:invert">
                  <Image
                    alt="signature"
                    src={post.signature}
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
