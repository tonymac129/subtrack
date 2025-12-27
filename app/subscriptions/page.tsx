"use client";

import { IoIosAdd } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { useState, useMemo, useEffect } from "react";
import { ServicesType, SubscriptionType } from "@/types/subscriptions";
import { AnimatePresence } from "framer-motion";
import SubscriptionItem from "./SubscriptionItem";
import Modal from "@/components/Modal";
import AddModal from "@/components/modals/AddModal";
import WarningModal from "@/components/modals/WarningModal";
import { UserType } from "@/types/user";
import Stat from "./Stat";

// const services: ServicesType = [
//   {
//     id: 0,
//     name: "ChatGPT",
//     plans: [
//       { name: "Plus", price: 20.0 },
//       { name: "Business", price: 25.0 },
//       { name: "Pro", price: 200.0 },
//     ],
//   },
//   {
//     id: 1,
//     name: "GitHub Pro",
//     plans: [
//       { name: "Team", price: 4.0 },
//       { name: "Enterprise", price: 21.0 },
//     ],
//   },
//   {
//     id: 2,
//     name: "HBO Max",
//     plans: [
//       { name: "Basic With Ads", price: 10.99 },
//       { name: "Standard", price: 18.49 },
//       { name: "Premium", price: 22.99 },
//       { name: "Bundles coming soon", price: 0.0 },
//       //TODO: add bundle option
//     ],
//   },
//   {
//     id: 3,
//     name: "YouTube Premium",
//     plans: [
//       { name: "Individual", price: 13.99 },
//       { name: "Family", price: 22.99 },
//       { name: "Student", price: 7.99 },
//       { name: "Premium Lite", price: 7.99 },
//     ],
//   },
//   {
//     id: 4,
//     name: "Google One",
//     plans: [
//       { name: "Basic", price: 1.99 },
//       { name: "Standard", price: 2.99 },
//       { name: "Premium", price: 9.99 },
//       { name: "Google AI Pro", price: 19.99 },
//       { name: "Google AI Ultra", price: 249.99 },
//     ],
//   },
//   {
//     id: 5,
//     name: "Netflix",
//     plans: [
//       { name: "Standard with Ads", price: 7.99 },
//       { name: "Standard", price: 17.99 },
//       { name: "Premium", price: 24.99 },
//     ],
//   },
//   {
//     id: 6,
//     name: "Disney+",
//     plans: [
//       { name: "Disney+", price: 11.99 },
//       { name: "Disney+ Premium", price: 18.99 },
//       { name: "Bundles coming soon", price: 0.0 },
//     ],
//   },
//   {
//     id: 7,
//     name: "Amazon Prime",
//     plans: [
//       { name: "Prime Monthly", price: 14.99 },
//       { name: "Prime for Young Adults", price: 7.49 },
//       { name: "Prime Access", price: 6.99 },
//     ],
//   },
//   {
//     id: 8,
//     name: "Spotify Premium",
//     plans: [
//       { name: "Individual", price: 11.99 },
//       { name: "Duo", price: 16.99 },
//       { name: "Family", price: 19.99 },
//       { name: "Student", price: 5.99 },
//     ],
//   },
//   {
//     id: 9,
//     name: "Hulu",
//     plans: [
//       { name: "Hulu", price: 11.99 },
//       { name: "Hulu Student", price: 1.99 },
//       { name: "Hulu Premium", price: 18.99 },
//     ],
//   },
// ];
//TODO: probably move the services into a separate json file in public folder

const services: ServicesType = await fetch("/data/services.json").then((res) => res.json());

async function getDBSubs() {
  const userData: UserType = JSON.parse(sessionStorage.getItem("subtrack-user"));
  const res = await fetch(`/api/user/subscriptions/${userData._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);

  return data;
}

function Page() {
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [guestMode, setGuestMode] = useState<boolean>(false);
  const [userSubs, setUserSubs] = useState<SubscriptionType[] | null>(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("subtrack-user")) {
        setGuestMode(false);
        return null;
      } else {
        setGuestMode(true);
        const stored = localStorage.getItem("subtrack-subs");
        return stored ? JSON.parse(stored) : [];
      }
    }
  });
  const displayed = useMemo(
    () => userSubs?.filter((subscription) => subscription.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [search, userSubs]
  );
  const monthlyTotal = useMemo(() => {
    const total = userSubs?.reduce((acc, sub) => {
      if (sub.duration === "month") {
        acc += Number(sub.price);
      } else {
        acc += Number(sub.price) / 12;
      }
      return acc;
    }, 0);
    return Math.round(total * 100) / 100;
  }, [userSubs]);

  async function updateDBSubs() {
    const userData = JSON.parse(sessionStorage.getItem("subtrack-user"));
    //TODO: maybe add a userdata state and fetch id from there instead of fetching session storage again
    const res = await fetch("/api/user/subscriptions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: userData._id, subs: userSubs }),
    });
    console.log(await res.json());
  }

  useEffect(() => {
    if (!guestMode) {
      getDBSubs().then(setUserSubs);
    }
  }, []);

  useEffect(() => {
    if (guestMode) {
      localStorage.setItem("subtrack-subs", JSON.stringify(userSubs));
    } else {
      if (userSubs) {
        updateDBSubs();
      }
    }
  }, [userSubs]);

  function handleSort(method: string): void {
    const newUserSubs = [...userSubs];
    switch (method) {
      case "name":
        newUserSubs.sort((a, b) => {
          const first = a.name.localeCompare(b.name);
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "description":
        newUserSubs.sort((a, b) => {
          const first = a.description.localeCompare(b.description);
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "amount":
        newUserSubs.sort((a, b) => {
          const first = Number(a.price) - Number(b.price);
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "duration":
        newUserSubs.sort((a, b) => {
          const first = b.duration.localeCompare(a.duration);
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "created":
        newUserSubs.sort((a, b) => {
          const first = new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime();
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "service":
        newUserSubs.sort((a, b) => {
          const first = a.service.localeCompare(b.service);
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      case "renews":
        newUserSubs.sort((a, b) => {
          const first = new Date(a.renews).getTime() - new Date(b.renews).getTime();
          if (first !== 0) return first;
          return a.id.localeCompare(b.id);
        });
        break;
      //TODO: DRY tie breaker logic
    }
    if (newUserSubs[0] === userSubs[0]) newUserSubs.reverse();
    setUserSubs(newUserSubs);
  }

  function handleClear(): void {
    setUserSubs([]);
    setShowWarningModal(false);
  }

  return (
    <div className=" flex flex-col flex-1 gap-y-5 py-10 pl-10 overflow-auto h-[calc(100vh-57px)] pr-50">
      <div className="flex gap-x-5 items-center">
        <div className="flex-1 border-gray-700 border-2 rounded-lg h-full flex justify-between px-5 items-center">
          <Stat
            big={"$" + monthlyTotal}
            description="Monthly total"
            info="This is just a close estimate and does not include free trials, promotions, or discounts"
          />
          <Stat
            big={"$" + Math.round(monthlyTotal * 1200) / 100}
            description="Yearly total"
            info="This is just a close estimate and does not include free trials, promotions, or discounts"
          />
          <Stat big={userSubs?.length.toString()} description={`Total subscription${userSubs?.length > 1 ? "s" : ""}`} />
        </div>
        <div
          className="flex flex-col items-center border-2 border-gray-700 rounded-lg px-3 cursor-pointer text-gray-300 text-sm
         hover:bg-gray-900 duration-300 w-fit my-5 h-full justify-center"
          onClick={() => setShowAddModal(true)}
        >
          <IoIosAdd size={60} color="#d1d5dc" />
          Add Subscription
        </div>
      </div>
      <h2 className="text-white text-2xl font-bold">Your subscriptions</h2>
      <div className="relative flex items-center">
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
        {userSubs?.length > 0 && (
          <div className="text-red-500 absolute right-0 cursor-pointer hover:underline" onClick={() => setShowWarningModal(true)}>
            Clear subscriptions
          </div>
        )}
      </div>
      <div>
        <div className="flex text-gray-400 pb-2 text-sm w-full">
          <div className="flex-3 cursor-pointer" onClick={() => handleSort("name")}>
            Subscription name
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("description")}>
            Description
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("amount")}>
            Amount
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("duration")}>
            Duration
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("created")}>
            Created
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("service")}>
            {/*TODO: derive these headers dynamically from array */}
            Service
          </div>
          <div className="flex-1 cursor-pointer" onClick={() => handleSort("renews")}>
            Renews
          </div>
          <div className="w-3.75"></div>
        </div>
        <hr className="h-0.5 bg-gray-700 border-none" />
      </div>
      <div className="flex flex-col gap-y-1">
        {displayed?.length > 0 ? (
          displayed.map((sub, i) => {
            return (
              <SubscriptionItem key={i} subscription={sub} userSubs={userSubs} setUserSubs={setUserSubs} services={services} />
            );
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
        {showWarningModal && (
          <Modal close={() => setShowWarningModal(false)} height={250} width={450}>
            <WarningModal operation={handleClear} close={() => setShowWarningModal(false)}>
              Are you sure you want to clear your subscriptions? This will <span className="text-red-500">delete</span> all of
              your subscriptions and their data! This action cannot be undone.
            </WarningModal>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Page;
