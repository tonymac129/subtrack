import { SubscriptionType, ServicesType } from "@/types/subscriptions";
import { SlOptionsVertical } from "react-icons/sl";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import AddModal from "@/components/modals/AddModal";
import WarningModal from "@/components/modals/WarningModal";

type SubscriptionItemProps = {
  subscription: SubscriptionType;
  userSubs: SubscriptionType[];
  setUserSubs: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
  services: ServicesType;
};

function SubscriptionItem({ subscription, userSubs, setUserSubs, services }: SubscriptionItemProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
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
      <span className="flex-[2.5]">{subscription.name}</span>
      <span className="flex-1 text-sm">{subscription.description}</span>
      <span className="flex-1 text-sm">
        {subscription.category && <span className="bg-gray-800 rounded-md p-1">{subscription.category}</span>}
      </span>
      <span className="flex-1 text-sm">{subscription.price}</span>
      <span className="flex-1 text-sm">{subscription.duration === "month" ? "Monthly" : "Annually"}</span>
      <span className="flex-1 text-xs">{new Date(subscription.timeCreated).toLocaleDateString()}</span>
      <span className="flex-1 text-sm">{subscription.service}</span>
      <span
        className={`flex-1 text-sm ${
          new Date().toLocaleDateString() === new Date(subscription.renews).toLocaleDateString() ? "text-red-500" : ""
        }`}
      >
        <div className="text-sm">{new Date(subscription.renews).toLocaleDateString()}</div>
        <div className="text-xs">
          {new Date().toLocaleDateString() === new Date(subscription.renews).toLocaleDateString() ? "Renews today" : ""}
        </div>
      </span>
      <div ref={optionMenuRef}>
        <SlOptionsVertical size={15} className="cursor-pointer" onClick={() => setOpen(!open)} />
        {open && (
          <div className={`bg-gray-800 absolute right-0 translate-x-[90%] flex flex-col p-1.5 rounded-lg top-[30%] z-10 w-30`}>
            <div className="option-item" onClick={() => setEditing(true)}>
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
          <Modal close={() => setConfirmDelete(false)} height={250} width={450}>
            <WarningModal operation={handleDelete} close={() => setConfirmDelete(false)}>
              Are you sure you want to <span className="text-red-500">delete</span> this subscription and its related information?
              This action cannot be undone.
            </WarningModal>
          </Modal>
        )}
        {editing && (
          <Modal close={() => setEditing(false)}>
            <AddModal
              close={() => setEditing(false)}
              services={services}
              userSubs={userSubs}
              setUserSubs={setUserSubs}
              importedData={subscription}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubscriptionItem;
