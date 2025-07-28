import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db";
import Image from "next/image";

export type Post = {
  id: string;
  message: string;
  created_at: number;
  signature: string;
  username: string;
  name: string;
};

// This component now fetches its own data directly
export default async function GuestbookPage() {
  const postResult = await db.execute({
    sql: `
      SELECT 
        post.id as id, 
        post.message as message, 
        post.created_at as created_at, 
        post.signature as signature, 
        user.username as username, 
        user.name as name 
      FROM post 
      JOIN user ON post.user_id = user.id 
      ORDER BY post.created_at DESC
    `,
    args: [],
  });

  const posts = postResult.rows as Post[];

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
            <p className="leading-6 text-card-foreground">{post.message}</p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex flex-col justify-end text-sm text-muted-foreground">
                <p className="font-bold text-card-foreground">
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
              {post.signature && (
                <div className="-mb-4 -mr-4 dark:invert">
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