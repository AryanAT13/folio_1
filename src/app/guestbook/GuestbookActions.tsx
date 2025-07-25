"use client";

import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SignOutIcon } from "@/components/ui/SignoutIcon";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import SignDialog from "./sign-dialog";

type GuestbookActionsProps = {
  session: Session | null;
  hasPosted: boolean;
};

export default function GuestbookActions({ session, hasPosted }: GuestbookActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tighter">
          Sign my guestbook
        </h1>
        {session && (
          <Button variant="ghost" type="button" onClick={() => signOut()}>
            <SignOutIcon />
            Sign out
          </Button>
        )}
      </div>

      {!session ? (
        <Button onClick={() => signIn("github")}>
          <GithubIcon />
          Sign in with GitHub
        </Button>
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