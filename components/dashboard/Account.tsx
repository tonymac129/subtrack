"use client";

import { useMemo } from "react";
import { AccountType } from "@/types/accounts";
import Stat from "../ui/Stat";

function Account({ userAccounts }: { userAccounts: AccountType[] }) {
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
      ) / 1000,
    [userAccounts]
  );

  return (
    <div className=" border-gray-700 border-2 rounded-lg py-5 flex flex-col gap-y-5 px-10 flex-1">
      <h2 className="text-blue-600 text-xl font-bold text-center">Account Insights</h2>
      <div className="flex items-center flex-wrap w-full gap-5">
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
        <Stat
          big={Math.round((uniquePasswords?.length / userAccounts?.length) * 1000) / 10 + "%"}
          description="Password uniqueness"
        />
        <Stat
          big={Math.round((uniqueUsernames?.length / userAccounts?.length) * 1000) / 10 + "%"}
          description="Username uniqueness"
        />
      </div>
    </div>
  );
}

export default Account;
