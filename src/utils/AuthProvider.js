"use client";
import { SessionProvider, session } from "next-auth/react";
export default function AuthProvider({ children }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
