"use client";

import { useState, useEffect, useMemo } from "react";
import { IoIosAdd } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import Stat from "@/components/ui/Stat";
import Account from "./Account";
import Modal from "@/components/Modal";
import WarningModal from "@/components/modals/WarningModal";
import AddAccount from "@/components/modals/AddAccount";
import { AccountsType, AccountType } from "@/types/accounts";
import { UserType } from "@/types/user";

const services: AccountsType = await fetch("/data/accounts.json").then((res) => res.json());

export async function getUserAccounts() {
  const userData: UserType = JSON.parse(sessionStorage.getItem("subtrack-user"));
  const res = await fetch(`/api/accounts?id=${userData._id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ createdAt: userData.createdAt }),
  });
  const data = await res.json();
  return data;
}

function Page() {
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("subtrack-user")) {
        return false;
      } else {
        return true;
      }
    }
  });
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [userAccounts, setUserAccounts] = useState<AccountType[] | null>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("subtrack-accounts")) {
      return JSON.parse(localStorage.getItem("subtrack-accounts"));
    } else if (typeof window !== "undefined" && sessionStorage.getItem("subtrack-user")) {
      return null;
    } else {
      return [];
    }
  });
  const displayed = useMemo<AccountType[]>(() => {
    const query = search.trim().toLocaleLowerCase();
    return userAccounts?.filter(
      (account) =>
        account.service.toLocaleLowerCase().includes(query) ||
        account.username.toLocaleLowerCase().includes(query) ||
        account.notes.toLocaleLowerCase().includes(query)
    );
  }, [search, userAccounts]);
  const uniquePasswords = useMemo<string[]>(
    () =>
      userAccounts?.reduce((acc: string[], account: AccountType) => {
        if (!acc.includes(account.password)) acc.push(account.password);
        return acc;
      }, []),
    [userAccounts]
  );
  const uniqueUsernames = useMemo<string[]>(
    () =>
      userAccounts?.reduce((acc: string[], account: AccountType) => {
        if (!acc.includes(account.username)) acc.push(account.username);
        return acc;
      }, []),
    [userAccounts]
  );
  const averagePasswordLength = useMemo<number>(
    () =>
      Math.round(
        (userAccounts?.reduce((acc: number, account: AccountType) => (acc += account.password.length), 0) /
          userAccounts?.length) *
          1000
      ) / 1000, //super fancy smart calculation that keeps 3 points of precision
    [userAccounts]
  );

  async function updateUserAccounts() {
    const userData: UserType = JSON.parse(sessionStorage.getItem("subtrack-user"));
    const res = await fetch("/api/accounts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: userData._id, accounts: userAccounts }),
    });
    const log = await res.json();
    console.log(log);
  }

  useEffect(() => {
    if (!guestMode) {
      getUserAccounts().then(setUserAccounts);
    }
  }, []);

  useEffect(() => {
    if (guestMode) {
      localStorage.setItem("subtrack-accounts", JSON.stringify(userAccounts));
    } else {
      if (userAccounts) {
        updateUserAccounts();
      }
    }
  }, [userAccounts, guestMode]);

  function handleSort(method: string): void {
    const newUserAccounts = [...userAccounts];
    if (method !== "created") {
      newUserAccounts.sort((a, b) => a[method].localeCompare(b[method]));
    } else {
      newUserAccounts.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
    }
    if (newUserAccounts[0] === userAccounts[0]) newUserAccounts.reverse();
    setUserAccounts(newUserAccounts);
  }

  function handleClear() {
    setUserAccounts([]);
    setShowWarningModal(false);
  }

  return (
    <div className=" flex flex-col flex-1 gap-y-5 py-10 pl-10 overflow-auto h-[calc(100vh-57px)] pr-50">
      <title>Accounts | Subtrack</title>
      <div className="flex gap-x-5 items-center">
        <div className="flex-1 border-gray-700 border-2 rounded-lg h-full flex justify-between px-5 items-center">
          <Stat big={userAccounts?.length.toString()} description={`Total account${userAccounts?.length === 1 ? "" : "s"}`} />
          <Stat
            big={uniquePasswords?.length.toString()}
            description={`Unique password${uniquePasswords?.length === 1 ? "" : "s"}`}
          />
          <Stat
            big={uniqueUsernames?.length.toString()}
            description={`Unique username${uniqueUsernames?.length === 1 ? "" : "s"}`}
          />
          {!Number.isNaN(averagePasswordLength) && (
            <Stat big={averagePasswordLength?.toString()} description="Average password length" />
          )}
        </div>
        <div
          className="flex flex-col items-center border-2 border-gray-700 rounded-lg px-3 cursor-pointer text-gray-300 text-sm
         hover:bg-gray-900 duration-300 w-fit my-5 h-full justify-center"
          onClick={() => setShowAddModal(true)}
        >
          <IoIosAdd size={60} color="#d1d5dc" />
          Add Account
        </div>
      </div>
      <h2 className="text-white text-2xl font-bold">Your accounts</h2>
      <div className="relative flex items-center">
        <div className="border-2 border-gray-700 rounded-lg w-100 relative">
          <input
            type="text"
            placeholder="Search accounts"
            className="text-gray-100 text-lg outline-none w-full px-5 py-1 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search.length > 0 && (
            <CgClose
              size={30}
              color="white"
              className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer rounded-md hover:bg-gray-900 p-1 duration-300"
              title="Clear search"
              onClick={() => setSearch("")}
            />
          )}
        </div>
        <div className="text-red-500 absolute right-0 cursor-pointer hover:underline" onClick={() => setShowWarningModal(true)}>
          Clear accounts
        </div>
      </div>
      <div>
        <div className="flex text-gray-400 pb-2 text-sm w-full">
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("service")}>
            Service
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("username")}>
            Username/email
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("password")}>
            Password
          </div>
          <div className="flex-2 cursor-pointer" onClick={() => handleSort("notes")}>
            Notes
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("created")}>
            Created
          </div>
          <div className="w-3.75"></div> {/*This is necessary for spacing don't delete this*/}
        </div>
        <hr className="h-0.5 bg-gray-700 border-none" />
      </div>
      <div className="flex flex-col gap-y-1">
        {displayed?.length > 0 ? (
          displayed.map((account: AccountType) => {
            return <Account key={account.id} account={account} services={services} setUserAccounts={setUserAccounts} />;
          })
        ) : (
          <div className="text-gray-100">No accounts found! Add an account above.</div>
        )}
      </div>
      {showAddModal && (
        <Modal close={() => setShowAddModal(false)}>
          <AddAccount close={() => setShowAddModal(false)} services={services} setUserAccounts={setUserAccounts} />
        </Modal>
      )}
      {showWarningModal && (
        <Modal close={() => setShowWarningModal(false)} height={250} width={450}>
          <WarningModal operation={handleClear} close={() => setShowWarningModal(false)}>
            Are you sure you want to clear your accounts? This will <span className="text-red-500">delete</span> all the accounts
            and their data you added to Subtrack! This action cannot be undone.
          </WarningModal>
        </Modal>
      )}
    </div>
  );
}

export default Page;
