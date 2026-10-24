"use client";

import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SignOutIcon } from "@/components/ui/SignoutIcon";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import SignDialog from "./sign-dialog";

type GuestbookActionsProps = {
  session: Session | null;
  hasPosted: boolean;
  authError?: string;
};

export default function GuestbookActions({ session, hasPosted, authError }: GuestbookActionsProps) {
  // Immediate feedback: the redirect to GitHub can take a moment to start.
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h1 className="title text-balance text-4xl sm:text-4xl">
          sign my guestbook.
        </h1>
        {session && (
          <Button variant="ghost" type="button" onClick={() => signOut()}>
            <SignOutIcon />
            Sign out
          </Button>
        )}
      </div>

      {!session ? (
        <div className="space-y-2">
          <Button
            disabled={isRedirecting}
            onClick={() => {
              setIsRedirecting(true);
              // Clear any ?error=... from a previous attempt once we come back.
              signIn("github", { callbackUrl: "/guestbook" }).catch(() => setIsRedirecting(false));
            }}
          >
            <GithubIcon />
            {isRedirecting ? "Redirecting to GitHub..." : "Sign in with GitHub"}
          </Button>
          {authError && (
            <p role="alert" className="text-sm text-rose-400">
              {authError}
            </p>
          )}
        </div>
      ) : hasPosted ? (
        <p className="text-sm text-muted-foreground">
          Thank you for signing the guestbook!
        </p>
      ) : (
        <SignDialog user={session.user} />
      )}
    </div>
  );
}
