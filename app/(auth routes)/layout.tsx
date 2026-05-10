"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();

    startTransition(() => {
      setLoading(false);
    });
  }, [router]);

  return <>{loading ? <div>Loading...</div> : children}</>;
}
