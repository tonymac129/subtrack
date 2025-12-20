import { SubscriptionType } from "@/types/subscriptions";
import { SlOptionsVertical } from "react-icons/sl";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";

type SubscriptionItemProps = {
  subscription: SubscriptionType;
  userSubs: SubscriptionType[];
  setUserSubs: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
};

function SubscriptionItem({ subscription, userSubs, setUserSubs }: SubscriptionItemProps) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const optionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (optionMenuRef.current && !optionMenuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  function handleDelete(): void {
    setUserSubs(userSubs.filter((sub) => sub.id !== subscription.id));
    setConfirmDelete(false);
  }

  return (
    <div className="flex text-gray-100 hover:bg-gray-900 duration-300 w-[calc(100%+32px)] rounded-lg py-3 -left-4 px-4 items-center relative">
      <span className="flex-2">{subscription.name}</span>
      <span className="flex-1">{subscription.description}</span>
      <span className="flex-1"> {subscription.price}</span>
      <span className="flex-1">{subscription.service}</span>
      <div ref={optionMenuRef}>
        <SlOptionsVertical size={15} className="cursor-pointer" onClick={() => setOpen(!open)} />
        {open && (
          <div className={`bg-gray-800 absolute right-0 translate-x-[90%] flex flex-col p-1.5 rounded-lg top-[30%] z-10 w-30`}>
            <div className="option-item">
              <BiEdit size={20} /> Edit
            </div>
            <div className="option-item text-red-500" onClick={() => setConfirmDelete(true)}>
              <BiTrash size={20} color="text-red-500" /> Delete
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {confirmDelete && (
          <Modal close={() => setConfirmDelete(false)}>
            <div className="text-lg">
              Are you sure you want to <span className="text-red-500">delete</span> this subscription and its related information?
              This action cannot be undone.
              <div className="flex gap-x-5 py-5">
                <button
                  className="bg-red-500 border-2 border-red-500 rounded-lg font-bold px-4 py-2 cursor-pointer"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
                <button
                  className="border-2 border-gray-700 rounded-lg font-bold px-4 py-2 cursor-pointer"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubscriptionItem;
