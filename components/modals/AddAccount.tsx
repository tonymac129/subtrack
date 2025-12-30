"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AccountType, AccountsType } from "@/types/accounts";
import { CgClose } from "react-icons/cg";
import SubscriptionCard from "@/app/subscriptions/SubscriptionCard";
import { BiAddToQueue } from "react-icons/bi";

type AddAccountProps = {
  close: () => void;
  services: AccountsType;
  setUserAccounts: React.Dispatch<React.SetStateAction<AccountType[]>>;
  importedData?: AccountType;
};

function AddAccount({ close, services, setUserAccounts, importedData }: AddAccountProps) {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(importedData ? 1 : 0);
  const [dir, setDir] = useState(true);
  const [selected, setSelected] = useState<null | number>(null);
  const [newAccount, setNewAccount] = useState<AccountType>(
    importedData || {
      id: crypto.randomUUID(),
      service: "",
      username: "",
      password: "",
      notes: "",
      created: new Date(),
      custom: false,
    }
  );
  const displayed = useMemo(
    () => services.filter((service) => service.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [services, search]
  );

  function handleSave() {
    if (importedData) {
      setUserAccounts((prev) => {
        const prevAccounts = [...prev];
        prevAccounts[prev.findIndex((account) => account.id === newAccount.id)] = newAccount;
        return prevAccounts;
      });
    } else {
      setUserAccounts((prev) => [...prev, newAccount]);
    }
    close();
  }

  return (
    <div className="flex flex-col gap-y-5 relative h-full">
      <h2 className="text-white text-2xl font-bold">
        {index === 0
          ? "1. Choose a service"
          : index === 1 && newAccount.custom
          ? "2. Customize service"
          : newAccount.custom
          ? "3. Customize account"
          : "2. Customize account"}
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
                  title="Clear search and filter"
                  onClick={() => {
                    setSearch("");
                  }}
                />
              )}
            </div>
            <div className="text-white text-lg flex flex-wrap items-start gap-3 h-120 overflow-auto ">
              <div>
                <div
                  className={`border-2 h-30 rounded-lg border-${
                    selected === 99 ? "blue" : "gray"
                  }-700 cursor-pointer leading-5 text-center
                    p-2 text-gray-100 text-sm hover:bg-gray-900 duration-300 flex flex-col gap-y-1 items-center w-25`}
                  onClick={() => {
                    setSelected(selected === 99 ? null : 99);
                    setNewAccount({
                      ...newAccount,
                      service: selected === 99 ? null : "Custom",
                      custom: true,
                    });
                  }}
                >
                  <BiAddToQueue size={45} />
                  Custom Service
                </div>
              </div>
              {displayed.length > 0 ? (
                displayed.map((sub) => {
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelected(selected === sub.id ? null : sub.id);
                        setNewAccount({
                          ...newAccount,
                          service: selected !== sub.id ? sub.name : "",
                          custom: false,
                        });
                      }}
                    >
                      <SubscriptionCard id={sub.id} services={services} selected={selected === sub.id} />
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-100 w-120">
                  No services found! Create a custom service yourself or submit an issue{" "}
                  <a href="https://github.com/tonymac129/subtrack/issues" target="_blank" className="underline">
                    here
                  </a>{" "}
                  for reqeusts!
                </div>
              )}
            </div>
          </motion.div>
        )}
        {((index === 1 && !newAccount.custom) || (index === 2 && newAccount.custom)) && (
          <motion.div
            key={2}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">Customize {newAccount.service} account</div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Username or email
              <input
                type="text"
                placeholder="Username"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Password
              <input
                type="text"
                placeholder="Password"
                className="modal-input w-100"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Accounts notes
              <input
                type="text"
                placeholder="Notes"
                className="modal-input w-100"
                value={newAccount.notes}
                onChange={(e) => setNewAccount({ ...newAccount, notes: e.target.value })}
              />
            </label>
            {/*TODO: probably derive these inputs from array maybe */}
          </motion.div>
        )}
        {index === 1 && newAccount.custom && (
          <motion.div
            key={1}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">Create custom service</div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Service Name
              <input
                type="text"
                placeholder="Service"
                value={newAccount.service}
                onChange={(e) => setNewAccount({ ...newAccount, service: e.target.value })}
                className="modal-input w-100"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 flex w-full justify-between flex-row-reverse">
        {newAccount.service && (
          <button
            className="rounded-lg bg-blue-700 text-white px-5 py-2 border-2 border-blue-700 cursor-pointer
          hover:shadow-[0_0_10px_#4040ff] duration-300"
            onClick={() => {
              setIndex(index + 1);
              setDir(true);
              if ((index === 1 && !newAccount.custom) || index === 2) {
                handleSave();
              }
            }}
          >
            {index === 2 ? "Finish" : index === 1 && !newAccount.custom ? "Finish" : "Next"}
          </button>
        )}
        {((index !== 0 && !importedData) || (importedData && newAccount.custom && index === 2)) && (
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

export default AddAccount;
