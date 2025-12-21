"use client";

import { useState } from "react";
import Landing from "./Landing";

export default function Gate({ children }: { children: React.ReactNode }) {
  const [isLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("subtrack-logged");
      return logged ? JSON.parse(logged) : false;
    }
    return false;
  });

  if (!isLoggedIn) {
    return <Landing />;
  }

  return <>{children}</>;
}
