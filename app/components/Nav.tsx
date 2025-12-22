"use client";

import { CgProfile } from "react-icons/cg";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Modal from "./Modal";
import ProfileModal from "./ui/ProfileModal";
import { UserType } from "@/types/user";

function Nav() {
  const [userOpen, setUserOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserType>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("subtrack-user")) {
      return JSON.parse(localStorage.getItem("subtrack-user"));
    } else {
      return {
        username: "Guest",
        password: "",
      };
    }
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("subtrack-user", JSON.stringify(userData));
    //TODO: add database & guest mode conditional
  }, [userData]);

  return (
    <nav className="flex items-center justify-between px-50 py-1 border-b-2 border-gray-700">
      <Link href="/" className="text-white font-bold text-2xl">
        Subtrack
      </Link>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex text-gray-100 items-center gap-x-3 font-bold hover:bg-gray-900 rounded-full px-4 py-1.5 cursor-pointer duration-300"
          onClick={() => setUserOpen(!userOpen)}
        >
          <CgProfile size={35} color="rgb(220,220,220)" /> {userData.username}
        </div>
        <AnimatePresence>
          {userOpen && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="w-full bg-gray-950 overflow-hidden flex flex-col absolute top-[calc(100%+10px)] rounded-md shadow-gray-900 shadow-lg"
            >
              <div className="dropdown-item" onClick={() => setProfileOpen(true)}>
                Profile
              </div>
              {/* <div className="dropdown-item">Account</div> */}
              <a href="https://github.com/tonymac129/subtrack/issues" target="_blank" className="dropdown-item">
                Feedback
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {profileOpen && (
          <Modal close={() => setProfileOpen(false)} width={450} height={450}>
            <ProfileModal userData={userData} setUserData={setUserData} close={() => setProfileOpen(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Nav;
