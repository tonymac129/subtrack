"use client";

import { useState, useEffect, useMemo } from "react";
import { SubscriptionType } from "@/types/subscriptions";
import { getDBSubs } from "@/app/subscriptions/page";
import Stat from "../ui/Stat";

type CompareObject = {
  name: string;
  price: number;
};

const cheap: CompareObject[] = [
  { name: "Big Macs", price: 0.579 },
  { name: "movie tickets", price: 1.6 },
  { name: "books", price: 3.1 },
  { name: "boba teas", price: 0.65 },
  { name: "Costco hot dogs", price: 0.15 },
  { name: "Steam games on sale", price: 0.5 },
  { name: "cups of instant ramen", price: 0.12 },
  { name: "bananas", price: 0.05 },
];

const expensive: CompareObject[] = [
  { name: "iPhones", price: 79.9 },
  { name: "laptops", price: 55.5 },
  { name: "Nintendo Switches", price: 29.9 },
  { name: "high-end GPUs", price: 120.0 },
  { name: "pairs of Jordans", price: 18.5 },
  { name: "Logitech mice", price: 7.99 },
];

function Subscription() {
  const [selectedCheap, setSelectedCheap] = useState<number>(0);
  const [selectedExpensive, setSelectedExpensive] = useState<number>(0);
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

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("subtrack-user")) {
      getDBSubs().then(setUserSubs);
    }
    setSelectedCheap(Math.floor(Math.random() * cheap.length));
    setSelectedExpensive(Math.floor(Math.random() * expensive.length));
  }, []);

  return (
    <div className="w-full border-gray-700 border-2 rounded-lg py-5 flex flex-col gap-y-5 px-10">
      <h2 className="text-blue-600 text-xl font-bold text-center">Subscription Insights</h2>
      <div className="flex justify-between items-center">
        {!Number.isNaN(monthlyTotal) && (
          <>
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
          </>
        )}
        <Stat big={userSubs?.length.toString()} description={`Total subscription${userSubs?.length > 1 ? "s" : ""}`} />
      </div>
      <div className="text-gray-300 text-sm text-center">
        That&apos;s{" "}
        <span className="underline cursor-pointer" onClick={() => setSelectedCheap((prev) => prev + 1)}>
          {Math.round(monthlyTotal / cheap[selectedCheap % cheap.length].price) / 10} {cheap[selectedCheap % cheap.length].name}
        </span>{" "}
        you could&apos;ve gotten this month and{" "}
        <span className="underline cursor-pointer" onClick={() => setSelectedExpensive((prev) => prev + 1)}>
          {Math.round(monthlyTotal / expensive[selectedExpensive % expensive.length].price) / 10}{" "}
          {expensive[selectedExpensive % expensive.length].name}
        </span>{" "}
        you could&apos;ve bought this year.
        <br />
        Really puts things into perspective, huh. Maybe cancel a subscription or two that you barely use?
      </div>
    </div>
  );
}

export default Subscription;
