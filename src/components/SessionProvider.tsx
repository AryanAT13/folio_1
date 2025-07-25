"use client";

import { SessionProvider as Provider } from "next-auth/react";
import type { Session } from "next-auth";

type Props = {
  session: Session | null;
  children: React.ReactNode;
};

export default function SessionProvider({ session, children }: Props) {
  return <Provider session={session}>{children}</Provider>;
}