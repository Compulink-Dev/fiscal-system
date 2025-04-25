// app/auth/redirect/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push(session.user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      router.push("/auth/signin");
    }
  }, [session, router]);

  return <div>Redirecting...</div>;
}
