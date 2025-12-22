"use client";

import { useState, useEffect } from "react";
import Landing from "./Landing";
import { useRouter } from "next/navigation";

export default function Gate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const logged = sessionStorage.getItem("subtrack-logged");
    setIsLoggedIn(logged ? JSON.parse(logged) : false);
  }, []);

  useEffect(() => {
    if (mounted) {
      sessionStorage.setItem("subtrack-logged", JSON.stringify(isLoggedIn));
    }
  }, [isLoggedIn, mounted]);

  if (!mounted) return null;

  if (!isLoggedIn) {
    if (mounted) router.push("/");
    return <Landing setIsLoggedIn={setIsLoggedIn} />;
  }

  return <>{children}</>;
}
