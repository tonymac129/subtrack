"use client";

import { useState, useEffect, useMemo } from "react";
import { IoIosAdd } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import Stat from "@/components/ui/Stat";
import Project from "./Project";
import Modal from "@/components/Modal";
import WarningModal from "@/components/modals/WarningModal";
import { ProjectType } from "@/types/projects";
import { UserType } from "@/types/user";
import AddProject from "@/components/modals/AddProject";

export async function getUserProjects() {
  const userData: UserType = JSON.parse(
    sessionStorage.getItem("subtrack-user"),
  );
  const res = await fetch(`/api/projects?id=${userData._id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ createdAt: userData.createdAt }),
  });
  const data = await res.json();
  return data;
}

function Page() {
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("subtrack-user")) {
        return false;
      } else {
        return true;
      }
    }
  });
  const [search, setSearch] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [userProjects, setUserProjects] = useState<ProjectType[] | null>(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("subtrack-projects")
    ) {
      return JSON.parse(localStorage.getItem("subtrack-projects"));
    } else if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("subtrack-user")
    ) {
      return null;
    } else {
      return [];
    }
  });
  const displayed = useMemo<ProjectType[]>(() => {
    const query = search.trim().toLocaleLowerCase();
    return userProjects?.filter(
      (project) =>
        project.name.toLocaleLowerCase().includes(query) ||
        project.description.toLocaleLowerCase().includes(query),
    );
  }, [search, userProjects]);

  async function updateUserProjects() {
    const userData: UserType = JSON.parse(
      sessionStorage.getItem("subtrack-user"),
    );
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: userData._id, projects: userProjects }),
    });
    const log = await res.json();
    console.log(log);
  }

  useEffect(() => {
    if (!guestMode) {
      getUserProjects().then(setUserProjects);
    }
  }, []);

  useEffect(() => {
    if (guestMode) {
      localStorage.setItem("subtrack-projects", JSON.stringify(userProjects));
    } else {
      if (userProjects) {
        updateUserProjects();
      }
    }
  }, [userProjects, guestMode]);

  function handleSort(method: string): void {
    const newUserProjects = [...userProjects];
    if (method !== "created") {
      newUserProjects.sort((a, b) => a[method].localeCompare(b[method]));
    } else {
      newUserProjects.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
    }
    if (newUserProjects[0] === newUserProjects[0]) newUserProjects.reverse();
    setUserProjects(newUserProjects);
  }

  function handleClear() {
    setUserProjects([]);
    setShowWarningModal(false);
  }

  return (
    <div className=" flex flex-col flex-1 gap-y-5 py-10 pl-10 overflow-auto h-[calc(100vh-57px)] pr-50">
      <title>Projects | Subtrack</title>
      <div className="flex gap-x-5 items-center">
        <div className="flex-1 border-gray-700 border-2 rounded-lg h-full flex justify-between px-5 items-center">
          <Stat
            big={userProjects?.length.toString()}
            description={`Total project${userProjects?.length === 1 ? "" : "s"}`}
          />
        </div>
        <div
          className="flex flex-col items-center border-2 border-gray-700 rounded-lg px-3 cursor-pointer text-gray-300 text-sm
         hover:bg-gray-900 duration-300 w-fit my-5 h-full justify-center"
          onClick={() => setShowAddModal(true)}
        >
          <IoIosAdd size={60} color="#d1d5dc" />
          Add Project
        </div>
      </div>
      <h2 className="text-white text-2xl font-bold">Your projects</h2>
      <div className="relative flex items-center">
        <div className="border-2 border-gray-700 rounded-lg w-100 relative">
          <input
            type="text"
            placeholder="Search projects"
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
        <div
          className="text-red-500 absolute right-0 cursor-pointer hover:underline"
          onClick={() => setShowWarningModal(true)}
        >
          Clear projects
        </div>
      </div>
      <div>
        <div className="flex text-gray-400 pb-2 text-sm w-full">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleSort("service")}
          >
            Name
          </div>
          <div
            className="flex-2 cursor-pointer"
            onClick={() => handleSort("username")}
          >
            Description
          </div>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleSort("notes")}
          >
            Created
          </div>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleSort("notes")}
          >
            Start
          </div>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleSort("notes")}
          >
            End
          </div>
          <div className="w-3.75"></div>{" "}
          {/*This is necessary for spacing don't delete this*/}
        </div>
        <hr className="h-0.5 bg-gray-700 border-none" />
      </div>
      <div className="flex flex-col gap-y-1">
        {displayed?.length > 0 ? (
          displayed.map((project: ProjectType) => {
            return (
              <Project
                key={project.id}
                project={project}
                setUserProjects={setUserProjects}
              />
            );
          })
        ) : (
          <div className="text-gray-100">
            No projects found! Add a project above.
          </div>
        )}
      </div>
      {showAddModal && (
        <Modal close={() => setShowAddModal(false)}>
          <AddProject
            close={() => setShowAddModal(false)}
            setUserProjects={setUserProjects}
          />
        </Modal>
      )}
      {showWarningModal && (
        <Modal
          close={() => setShowWarningModal(false)}
          height={250}
          width={450}
        >
          <WarningModal
            operation={handleClear}
            close={() => setShowWarningModal(false)}
          >
            Are you sure you want to clear your projects? This will{" "}
            <span className="text-red-500">delete</span> all the projects and
            their data you added to Subtrack! This action cannot be undone.
          </WarningModal>
        </Modal>
      )}
    </div>
  );
}

export default Page;
