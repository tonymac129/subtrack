"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SubscriptionType, ServicesType, Service } from "@/types/subscriptions";
import SubscriptionCard from "@/app/subscriptions/SubscriptionCard";
import { CgClose } from "react-icons/cg";
import { BiAddToQueue } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from "date-fns";

type TExcludeDateIntervals = Array<{
  start: Date;
  end: Date;
}>;

const excludeDateIntervals: TExcludeDateIntervals = [
  {
    start: subDays(new Date(), 99999),
    end: subDays(new Date(), 3),
  },
];

type AddModalProps = {
  close: () => void;
  services: ServicesType;
  userSubs: SubscriptionType[];
  setUserSubs: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
  importedData?: SubscriptionType;
};

const customSub = {
  name: "Custom",
  id: 99,
  plans: [],
};

function AddModal({ close, services, userSubs, setUserSubs, importedData }: AddModalProps) {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(importedData ? 1 : 0);
  const [dir, setDir] = useState(true);
  const displayed = useMemo(
    () => services.filter((subscription) => subscription.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [services, search]
  );
  const [selected, setSelected] = useState<null | number>(null);
  const [selectedSub, setSelectedSub] = useState<Service | null>(null);
  const [newSubscription, setNewSubscription] = useState<SubscriptionType>(
    importedData || {
      id: crypto.randomUUID(),
      serviceid: 0,
      service: "",
      plan: "",
      price: 0,
      name: "",
      description: "",
      duration: "month",
      timeCreated: new Date(),
      renews: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    }
  );

  useEffect(() => {
    if (importedData) {
      setSelected(services.find((service) => service.id === importedData.serviceid)?.id || 99);
      setSelectedSub(services.find((service) => service.id === importedData.serviceid) || customSub);
    }
  }, [importedData, services]);

  useEffect(() => {
    if (index === 3) {
      if (importedData) {
        const copy = [...userSubs];
        copy[userSubs.findIndex((sub) => sub.id === importedData.id)] = newSubscription;
        setUserSubs(copy);
      } else {
        setUserSubs([...userSubs, newSubscription]);
      }
      close();
    }
  }, [index, close, newSubscription, userSubs, setUserSubs, importedData]);

  return (
    <div className="flex flex-col gap-y-5 relative h-full">
      <h2 className="text-white text-2xl font-bold">
        {index === 0 ? "1. Choose a service" : index === 1 ? "2. Select a plan" : "3. Customize subscription"}
      </h2>
      <AnimatePresence mode="popLayout" initial={false}>
        {index === 0 && (
          <motion.div
            key={0}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5 overflow-auto"
          >
            <div className="w-100 relative">
              <input
                type="text"
                placeholder="Search services"
                className="modal-input w-100"
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
            <div className="text-white text-lg flex flex-wrap items-start gap-3 overflow-auto ">
              <div>
                <div
                  className={`border-2 h-30 rounded-lg border-${
                    selected === 99 ? "blue" : "gray"
                  }-700 cursor-pointer leading-5 text-center
                    p-2 text-gray-100 text-sm hover:bg-gray-900 duration-300 flex flex-col gap-y-1 items-center w-25`}
                  onClick={() => {
                    setSelected(selected === 99 ? null : 99);
                    setNewSubscription({
                      ...newSubscription,
                      service: selected === 99 ? null : "Custom",
                      serviceid: 99,
                    });
                    setSelectedSub(customSub);
                  }}
                >
                  <BiAddToQueue size={45} />
                  Custom Service
                </div>
              </div>
              {displayed.length > 0 ? (
                displayed
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((sub, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setSelected(selected === i ? null : i);
                          setNewSubscription({
                            ...newSubscription,
                            service: selected !== i ? sub.name : "",
                            serviceid: selected !== i ? sub.id : 0,
                          });
                          setSelectedSub(services.find((service) => service.id === sub.id));
                        }}
                      >
                        <SubscriptionCard id={sub.id} selected={i === selected} services={services} />
                      </div>
                    );
                  })
              ) : (
                <div className="text-gray-100 w-120">
                  No subscriptions found! Create a custom service yourself or submit an issue{" "}
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
            <div className="text-gray-100 text-xl font-bold">Choose a plan for {selectedSub?.name}</div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Select a plan
              <select
                name="Available plans"
                className="modal-select"
                value={
                  newSubscription.plan === "Custom"
                    ? selectedSub?.plans.length
                    : selectedSub?.plans.indexOf(selectedSub.plans.find((plan) => plan.name === newSubscription.plan))
                }
                onChange={(e) => {
                  setNewSubscription({
                    ...newSubscription,
                    plan: selectedSub.plans[Number(e.target.value)]?.name || "Custom",
                    price: selectedSub.plans[Number(e.target.value)]?.price || 0,
                    duration: "month",
                  });
                }}
              >
                {selectedSub?.plans.map((plan, i) => {
                  return (
                    <option key={i} value={i} className="bg-gray-900">
                      {plan.name}
                    </option>
                  );
                })}
                <option
                  value={services.find((subscription) => subscription.id === newSubscription.serviceid)?.plans.length}
                  className="bg-gray-900"
                >
                  Custom
                </option>
              </select>
              <a href="https://github.com/tonymac129/subtrack/issues" className="text-xs hover:underline" target="_blank">
                Can&apos;t find your plan or inaccurate pricing? Submit an issue!
              </a>
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Price (USD)
              <input
                type="text"
                placeholder="Amount"
                value={newSubscription.price}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) {
                    e.target.focus();
                    alert("Please make sure the price is a positive numerical value!");
                  } else {
                    setNewSubscription({ ...newSubscription, price: e.target.value });
                  }
                }}
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Renewal date
              <DatePicker
                selected={newSubscription.renews}
                onChange={(date: Date) => setNewSubscription({ ...newSubscription, renews: date })}
                className="cursor-pointer modal-input w-100"
                excludeDateIntervals={excludeDateIntervals}
                popperPlacement="bottom-start"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              How often
              <select
                className="modal-select"
                value={newSubscription.duration}
                onChange={(e) =>
                  setNewSubscription({
                    ...newSubscription,
                    price: e.target.value === "month" ? Number(newSubscription.price) / 12 : Number(newSubscription.price) * 12,
                    duration: e.target.value,
                  })
                }
              >
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
            <div className="text-gray-100 text-xl font-bold">Customize {selectedSub.name} subscription</div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Subscription name
              <input
                type="text"
                placeholder="Name"
                value={newSubscription.name}
                onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Subscription description
              <input
                type="text"
                placeholder="Description"
                className="modal-input w-100"
                value={newSubscription.description}
                onChange={(e) => setNewSubscription({ ...newSubscription, description: e.target.value })}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 flex w-full justify-between flex-row-reverse">
        {newSubscription.service && (
          <button
            className="rounded-lg bg-blue-700 text-white px-5 py-2 border-2 border-blue-700 cursor-pointer
          hover:shadow-[0_0_10px_#4040ff] duration-300"
            onClick={() => {
              if (index === 0) {
                setNewSubscription({
                  ...newSubscription,
                  plan: selectedSub.plans[0]?.name || "Custom",
                  price: selectedSub.plans[0]?.price || 0,
                });
              }
              if (index === 1 && !importedData) {
                setNewSubscription({ ...newSubscription, name: newSubscription.service + " " + newSubscription.plan + " Plan" });
              }
              setIndex(index + 1);
              setDir(true);
            }}
          >
            {index === 2 ? "Finish" : "Next"}
          </button>
        )}
        {index !== 0 && !importedData && (
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
        {index !== 1 && importedData && (
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
      </div>
    </div>
  );
}

export default AddModal;

//help this modal component is doing way too much but im too scared (or lazy) to refactor 🥀
