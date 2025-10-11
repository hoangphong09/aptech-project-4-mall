"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface ProvidersWrapperProps {
  children: ReactNode;
  session: any; 
}

export function SessionContext({ children, session }: ProvidersWrapperProps) {

  return (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
  );
}

