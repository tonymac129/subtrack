"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectType } from "@/types/projects";

type AddProjectProps = {
  close: () => void;
  setUserProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  importedData?: ProjectType;
};

function AddProject({ close, setUserProjects, importedData }: AddProjectProps) {
  const [index, setIndex] = useState(importedData ? 1 : 0);
  const [dir, setDir] = useState(true);
  const [newAccount, setNewAccount] = useState<ProjectType>(
    importedData || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      people: [],
      link: "",
      created: new Date(),
    },
  );

  function handleSave() {
    if (importedData) {
      setUserProjects((prev) => {
        const prevAccounts = [...prev];
        prevAccounts[
          prev.findIndex((account) => account.id === newAccount.id)
        ] = newAccount;
        return prevAccounts;
      });
    } else {
      setUserProjects((prev) => [...prev, newAccount]);
    }
    close();
  }

  return (
    <div className="flex flex-col gap-y-5 relative h-full">
      <h2 className="text-white text-2xl font-bold">
        {index === 0 ? "1. Customize project" : "2. Additional details"}
      </h2>
      <AnimatePresence mode="popLayout" initial={false}>
        {index === 0 && (
          <motion.div
            key={2}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">
              Customize project
            </div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Project name/title
              <input
                type="text"
                placeholder="Username"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Description
              <input
                type="text"
                placeholder="Password"
                className="modal-input w-100"
                value={newAccount.description}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, description: e.target.value })
                }
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 flex w-full justify-between flex-row-reverse">
        <button
          className="rounded-lg bg-blue-700 text-white px-5 py-2 border-2 border-blue-700 cursor-pointer
          hover:shadow-[0_0_10px_#4040ff] duration-300"
          onClick={() => {
            setIndex(index + 1);
            setDir(true);
            if (index === 1 || index === 2) {
              handleSave();
            }
          }}
        >
          {index === 2 ? "Finish" : "Next"}
        </button>
        {((index !== 0 && !importedData) || (importedData && index === 2)) && (
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

export default AddProject;
