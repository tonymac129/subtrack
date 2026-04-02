import { SlOptionsVertical } from "react-icons/sl";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import WarningModal from "@/components/modals/WarningModal";
import { ProjectType } from "@/types/projects";
import AddProject from "@/components/modals/AddProject";

type ProjectProps = {
  project: ProjectType;
  setUserProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
};

function Project({ project, setUserProjects }: ProjectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const optionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        optionMenuRef.current &&
        !optionMenuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  function handleDelete(): void {
    setUserProjects((prev) =>
      prev.filter((prevProject: ProjectType) => prevProject.id !== project.id),
    );
    setConfirmDelete(false);
  }

  return (
    <div className="flex text-gray-100 hover:bg-gray-900 duration-300 w-[calc(100%+32px)] rounded-lg py-3 -left-4 px-4 items-center relative">
      <span className="flex-1">{project.name}</span>
      <span className="flex-2 text-sm">{project.description}</span>
      <span
        className="flex-1 text-sm"
        title={new Date(project.startDate).toISOString()}
      >
        {new Date(project.startDate).toLocaleDateString()}
      </span>
      <span
        className="flex-1 text-sm"
        title={new Date(project.endDate).toISOString()}
      >
        {new Date(project.endDate).toLocaleDateString()}
      </span>
      <span
        className="flex-1 text-sm"
        title={new Date(project.created).toISOString()}
      >
        {new Date(project.created).toLocaleDateString()}
      </span>
      <div ref={optionMenuRef}>
        <SlOptionsVertical
          size={15}
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div
            className={`bg-gray-800 absolute right-0 translate-x-[90%] flex flex-col p-1.5 rounded-lg top-[30%] z-10 w-30`}
          >
            <div className="option-item" onClick={() => setEditing(true)}>
              <BiEdit size={20} /> Edit
            </div>
            <div
              className="option-item text-red-500"
              onClick={() => setConfirmDelete(true)}
            >
              <BiTrash size={20} color="text-red-500" /> Delete
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {confirmDelete && (
          <Modal close={() => setConfirmDelete(false)} height={250} width={450}>
            <WarningModal
              operation={handleDelete}
              close={() => setConfirmDelete(false)}
            >
              Are you sure you want to{" "}
              <span className="text-red-500">delete</span> this project and its
              related information on Subtrack? This action cannot be undone.
            </WarningModal>
          </Modal>
        )}
        {editing && (
          <Modal close={() => setEditing(false)}>
            <AddProject
              close={() => setEditing(false)}
              setUserProjects={setUserProjects}
              importedData={project}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Project;
