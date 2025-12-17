"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SubscriptionCard from "./SubscriptionCard";

type AddModalProps = {
  close: () => void;
  subs: string[];
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

  useEffect(() => {
    if (index === 3) {
      close();
    }
  }, [index, close]);

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
                    <div key={i} onClick={() => setSelected(selected === i ? null : i)}>
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
            <input
              type="text"
              placeholder="How much money"
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
            />
            <input
              type="text"
              placeholder="How often"
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-100"
            />
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
