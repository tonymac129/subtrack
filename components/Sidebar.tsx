"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tabs: string[] = ["", "Subscriptions", "Accounts", "Projects"];

function Sidebar() {
  const [selected, setSelected] = useState<number>(0);
  const pathName = usePathname();

  useEffect(() => {
    tabs.forEach((tab, i) => {
      if (pathName.includes(tab.toLowerCase())) {
        setSelected(i);
      }
    });
  }, [pathName]);

  return (
    <div className="flex flex-col gap-y-3 py-5 w-50 pr-5 border-r-2 border-gray-700 h-[calc(100vh-57px)]">
      {tabs.map((tab, i) => {
        return (
          <Link
            key={i}
            href={`/${tab.toLowerCase()}`}
            className={`sidebar-item ${selected === i ? "sidebar-item-selected" : ""}`}
          >
            {tab === "" ? "Dashboard" : tab}
          </Link>
        );
      })}
    </div>
  );
}

export default Sidebar;
