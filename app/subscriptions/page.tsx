"use client";

import { IoIosAdd } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { useState, useMemo, useEffect } from "react";
import { ServicesType, SubscriptionType } from "@/types/subscriptions";
import { AnimatePresence } from "framer-motion";
import SubscriptionItem from "./SubscriptionItem";
import Modal from "../components/Modal";
import AddModal from "./AddModal";

// const subs: string[] = [
//   "ChatGPT Plus",
//   "GitHub Pro",
//   "HBO Max",
//   "YouTube Premium",
//   "Google One",
//   "Netflix",
//   "Spotify Premium",
//   "Disney+",
//   "Amazon Prime",
//   "Hulu",
// ];

const services: ServicesType = [
  {
    id: 0,
    name: "ChatGPT Plus",
    plans: [{ name: "Individual", price: 10.0 }],
  },
  {
    id: 1,
    name: "Spotify Premium",
    plans: [
      { name: "Individual", price: 11.99 },
      { name: "Duo", price: 16.99 },
      { name: "Family", price: 19.99 },
      { name: "Student", price: 5.99 },
    ],
  },
];

function Page() {
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [userSubs, setUserSubs] = useState<SubscriptionType[]>(() => {
    const stored = localStorage.getItem("subtrack-subs");
    return stored ? JSON.parse(stored) : [];
  });
  const displayed = useMemo(
    () => userSubs.filter((subscription) => subscription.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [search, userSubs]
  );

  useEffect(() => {
    localStorage.setItem("subtrack-subs", JSON.stringify(userSubs));
  }, [userSubs]);

  return (
    <div className=" flex flex-col flex-1 gap-y-5 py-10 pl-10 overflow-auto h-[calc(100vh-57px)] pr-50">
      <div
        className="flex flex-col items-center border-2 border-gray-700 rounded-lg px-3 py-3 cursor-pointer text-gray-100
         hover:bg-gray-900 duration-300 w-fit my-5"
        onClick={() => setShowAddModal(true)}
      >
        <IoIosAdd size={70} color="white" />
        Add a Subscription
      </div>
      <h2 className="text-white text-2xl font-bold">Your subscriptions</h2>
      <div className="border-2 border-gray-700 rounded-lg w-100 relative">
        <input
          type="text"
          placeholder="Search subscriptions"
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
      <div>
        <div className="flex text-gray-400 pb-2 text-sm w-full">
          <div className="flex-2">Subscription name</div>
          <div className="flex-1">Description</div>
          <div className="flex-1">Amount</div>
          <div className="flex-1">Service</div>
          <div className="w-3.75"></div>
        </div>
        <hr className="h-0.5 bg-gray-700 border-none" />
      </div>
      <div className="flex flex-col gap-y-1">
        {displayed.length > 0 ? (
          displayed.map((sub, i) => {
            return <SubscriptionItem key={i} subscription={sub} userSubs={userSubs} setUserSubs={setUserSubs} />;
          })
        ) : (
          <div className="text-gray-100">
            No subscriptions found! Add a subscription above or submit an issue{" "}
            <a href="https://github.com/tonymac129/subtrack/issues" target="_blank" className="underline">
              here
            </a>{" "}
            for reqeusts!
          </div>
        )}
      </div>
      <AnimatePresence>
        {showAddModal && (
          <Modal close={() => setShowAddModal(false)}>
            <AddModal close={() => setShowAddModal(false)} services={services} userSubs={userSubs} setUserSubs={setUserSubs} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Page;
