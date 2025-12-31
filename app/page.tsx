"use client";

import { useState, useEffect } from "react";
import { getDBSubs } from "@/app/subscriptions/page";
import { getUserAccounts } from "./accounts/page";
import { SubscriptionType } from "@/types/subscriptions";
import { AccountType } from "@/types/accounts";
import { MdAccountCircle, MdSubscriptions } from "react-icons/md";
import { VscGithubProject } from "react-icons/vsc";
import { FiLogOut } from "react-icons/fi";
import Option from "@/components/dashboard/Option";
import Subscription from "@/components/dashboard/Subscription";
import Chart from "@/components/dashboard/Chart";
import Account from "@/components/dashboard/Account";

export default function Home() {
  const [userSubs, setUserSubs] = useState<SubscriptionType[] | null>(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("subtrack-user")) {
        return null;
      } else {
        const stored = localStorage.getItem("subtrack-subs");
        return stored ? JSON.parse(stored) : [];
      }
    }
  });
  const [userAccounts, setUserAccounts] = useState<AccountType[] | null>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("subtrack-accounts")) {
      return JSON.parse(localStorage.getItem("subtrack-accounts"));
    } else if (typeof window !== "undefined" && sessionStorage.getItem("subtrack-user")) {
      return null;
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("subtrack-user")) {
      getDBSubs().then(setUserSubs);
      getUserAccounts().then(setUserAccounts);
    }
  }, []);

  function handleLogout() {
    sessionStorage.clear();
    window.location.reload();
  }

  return (
    <div className="flex-1 pr-50 overflow-auto h-[calc(100vh-57px)] pb-10">
      <h1 className="text-3xl text-white text-center font-bold py-8 pl-10">
        Welcome back to <span className="text-blue-600">Subtrack</span>
      </h1>
      <div className="flex pl-10 gap-x-3 pb-3">
        <Option text="Add a subscription" link="subscriptions" icon={<MdSubscriptions size={45} />} />
        <Option text="Add an account" link="accounts" icon={<MdAccountCircle size={45} />} />
        <Option text="Create a project" link="projects" icon={<VscGithubProject size={45} />} />
        <Option text="Log out" link="" icon={<FiLogOut color="brown" size={45} />} onClick={handleLogout} />
      </div>
      <div className="pl-10 flex flex-wrap gap-3">
        {userSubs?.length > 0 ? (
          <>
            <Subscription userSubs={userSubs} />
            <Chart userSubs={userSubs} />
          </>
        ) : (
          <div className="text-white text-lg font-bold p-5 w-full border-2 rounded-lg border-gray-700">
            Add a subscription to see subscription analytics!
          </div>
        )}
        {userAccounts?.length > 0 ? (
          <Account userAccounts={userAccounts} />
        ) : (
          <div className="text-white text-lg font-bold p-5 w-full border-2 rounded-lg border-gray-700">
            Add an account to see account analytics!
          </div>
        )}
        <div className="text-white text-lg font-bold p-5 w-full border-2 rounded-lg border-gray-700">Projects coming soon!</div>
      </div>
    </div>
  );
}
