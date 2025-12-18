"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SubscriptionCard from "./SubscriptionCard";

type AddModalProps = {
  close: () => void;
  subs: string[];
};

type Plan = {
  name: string;
  price: number;
};

type Service = {
  name: string;
  plans: Plan[];
};

type ServicesType = Record<string, Service>;

const services: ServicesType = {
  spotifypremium: {
    name: "Spotify Premium",
    plans: [
      { name: "Individual", price: 11.99 },
      { name: "Duo", price: 16.99 },
      { name: "Family", price: 19.99 },
      { name: "Student", price: 5.99 },
    ],
  },
};

function AddModal({ close, subs }: AddModalProps) {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(true);
  const displayed = useMemo(
    () => subs.filter((subscription) => subscription.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [subs, search]
  );
  const [selected, setSelected] = useState<null | number>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number | string>(0);
  //compress the states into one object

  useEffect(() => {
    if (index === 3) {
      close();
    }
  }, [index, close]);

  useEffect(() => {
    setSelectedPrice(services[selectedService]?.plans[selectedPlan]?.price || 0);
  }, [selectedPlan, selectedService]);

  return (
    <div className="flex flex-col gap-y-5 relative h-full">
      <h2 className="text-white text-2xl font-bold">Add Subscription</h2>
      <AnimatePresence mode="popLayout" initial={false}>
        {index === 0 && (
          <motion.div
            key={0}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <input
              type="text"
              placeholder="Search subscriptions"
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="text-white text-lg flex flex-wrap gap-5">
              {displayed.length > 0 ? (
                displayed.map((sub, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelected(selected === i ? null : i);
                        setSelectedService(sub.toLowerCase().replaceAll("+", "").replace(" ", ""));
                      }}
                    >
                      <SubscriptionCard name={sub} selected={i === selected} />
                    </div>
                  );
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
          </motion.div>
        )}
        {index === 1 && (
          <motion.div
            key={1}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">{services[selectedService].name}</div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Select a plan
              <select name="Available plans" className="modal-select" onChange={(e) => setSelectedPlan(Number(e.target.value))}>
                {services[selectedService].plans.map((plan, i) => {
                  return (
                    <option key={i} value={i} className="bg-gray-900">
                      {plan.name}
                    </option>
                  );
                })}
                <option value={services[selectedService].plans.length} className="bg-gray-900">
                  Custom
                </option>
              </select>
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Price
              <input
                type="text"
                placeholder="Amount"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              How often
              <select className="modal-select">
                <option value="month" className="bg-gray-900">
                  Monthly
                </option>
                <option value="year" className="bg-gray-900">
                  Annually
                </option>
              </select>
            </label>
          </motion.div>
        )}
        {index === 2 && (
          <motion.div
            key={2}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <input
              type="text"
              placeholder="Name"
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
            />
            <input
              type="text"
              placeholder="Description"
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`absolute bottom-0 flex justify-${index === 0 ? "end" : "between"} w-full`}>
        {index !== 0 && (
          <button
            className="rounded-lg text-gray-100 px-5 py-2 border-2 border-gray-700 cursor-pointer"
            onClick={() => {
              setIndex(index - 1);
              setDir(false);
            }}
          >
            Back
          </button>
        )}
        <button
          className="rounded-lg bg-blue-700 text-white px-5 py-2 border-2 border-blue-700 cursor-pointer
          hover:shadow-[0_0_10px_#4040ff] duration-300"
          onClick={() => {
            setIndex(index + 1);
            setDir(true);
          }}
        >
          {index === 2 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default AddModal;
