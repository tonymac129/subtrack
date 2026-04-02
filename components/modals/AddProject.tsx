"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectType } from "@/types/projects";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type AddProjectProps = {
  close: () => void;
  setUserProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  importedData?: ProjectType;
};

function AddProject({ close, setUserProjects, importedData }: AddProjectProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(true);
  const [newProject, setNewProject] = useState<ProjectType>(
    importedData || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      people: [],
      link: "",
      created: new Date(),
      repo: "",
    },
  );

  function handleSave() {
    if (importedData) {
      setUserProjects((prev) => {
        const prevProjects = [...prev];
        prevProjects[
          prev.findIndex((project) => project.id === newProject.id)
        ] = newProject;
        return prevProjects;
      });
    } else {
      setUserProjects((prev) => [...prev, newProject]);
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
            key={1}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">
              Fill in some details about your project
            </div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Project name/title
              <input
                type="text"
                placeholder="Name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Description
              <input
                type="text"
                placeholder="Description"
                className="modal-input w-100"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Link
              <input
                type="text"
                placeholder="Project link"
                className="modal-input w-100"
                value={newProject.link}
                onChange={(e) =>
                  setNewProject({ ...newProject, link: e.target.value })
                }
              />
            </label>
          </motion.div>
        )}
        {index === 1 && (
          <motion.div
            key={2}
            initial={{ x: dir ? "100%" : "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: !dir ? "100%" : "-100%", opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col gap-y-5"
          >
            <div className="text-gray-100 text-xl font-bold">
              Optional customizations and additional info
            </div>
            <label className="flex flex-col gap-y-1 text-gray-400">
              People
              <input
                type="text"
                placeholder="Separate with commas"
                value={newProject.people.join(",")}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    people: e.target.value.split(","),
                  })
                }
                className="modal-input w-100"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              Start date
              <DatePicker
                selected={newProject.startDate}
                onChange={(date: Date) =>
                  setNewProject({ ...newProject, startDate: date })
                }
                className="cursor-pointer modal-input w-100"
                popperPlacement="bottom-start"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              End date
              <DatePicker
                selected={newProject.endDate}
                onChange={(date: Date) =>
                  setNewProject({ ...newProject, endDate: date })
                }
                className="cursor-pointer modal-input w-100"
                popperPlacement="bottom-start"
              />
            </label>
            <label className="flex flex-col gap-y-1 text-gray-400">
              GitHub repo
              <input
                type="text"
                placeholder="Repository link"
                className="modal-input w-100"
                value={newProject.repo}
                onChange={(e) =>
                  setNewProject({ ...newProject, repo: e.target.value })
                }
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 flex w-full justify-between flex-row-reverse">
        {newProject.name.trim() && newProject.link.trim() && (
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
            {index === 1 ? "Finish" : "Next"}
          </button>
        )}
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
      </div>
    </div>
  );
}

export default AddProject;
