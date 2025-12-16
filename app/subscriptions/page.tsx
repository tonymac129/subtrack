"use client";

import { IoIosAdd } from "react-icons/io";
import { useState, useMemo } from "react";
import SubscriptionCard from "./SubscriptionCard";

const subs: string[] = ["Google One", "Netflix", "Spotify", "Disney+", "Amazon", "Hulu"];

function Page() {
  const [search, setSearch] = useState<string>("");
  const displayed = useMemo(
    () => subs.filter((subscription) => subscription.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [search]
  );

  return (
    <div className=" flex flex-col gap-y-5 py-10 pl-10 overflow-auto h-[calc(100vh-61px)] pr-50">
      <div className="flex flex-col items-center border-2 border-gray-700 rounded-lg px-3 py-3 cursor-pointer text-gray-100 hover:bg-gray-900 duration-300 w-fit my-5">
        <IoIosAdd size={70} color="white" />
        Add a Subscription
      </div>
      <h2 className="text-white text-2xl font-bold">Your subscriptions</h2>
      <input
        type="text"
        placeholder="Search subscriptions"
        className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-5 flex-wrap">
        {displayed.length > 0 ? (
          displayed.map((sub, i) => {
            return <SubscriptionCard key={i} name={sub} />;
          })
        ) : (
          <div className="text-gray-100 w-100">
            No subscriptions found! Add a subscription above or submit an issue{" "}
            <a href="https://github.com/tonymac129/subtrack/issues" target="_blank" className="underline">
              here
            </a>{" "}
            for reqeusts!
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
