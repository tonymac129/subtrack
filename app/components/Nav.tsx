"use client";

import { CgProfile } from "react-icons/cg";
import Link from "next/link";

function Nav() {
  return (
    <nav className="flex items-center justify-between px-50 py-3 border-b-2 border-gray-700">
      <Link href="/" className="text-white font-bold text-2xl">
        Subtrack
      </Link>
      <CgProfile size={35} color="rgb(220,220,220)" title="View profile" className="cursor-pointer" />
    </nav>
  );
}

export default Nav;
