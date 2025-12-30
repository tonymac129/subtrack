import { SlOptionsVertical } from "react-icons/sl";
import { BiCopy, BiEdit, BiTrash } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import AddAccount from "@/components/modals/AddAccount";
import WarningModal from "@/components/modals/WarningModal";
import { AccountType, AccountsType } from "@/types/accounts";
import { GrView } from "react-icons/gr";

type AccountProps = {
  account: AccountType;
  services: AccountsType;
  setUserAccounts: React.Dispatch<React.SetStateAction<AccountType[]>>;
};

function Account({ account, services, setUserAccounts }: AccountProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [viewing, setViewing] = useState<boolean>(false);
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
    setUserAccounts((prev) => prev.filter((prevAccount: AccountType) => prevAccount.id !== account.id));
    setConfirmDelete(false);
  }

  return (
    <div className="flex text-gray-100 hover:bg-gray-900 duration-300 w-[calc(100%+32px)] rounded-lg py-3 -left-4 px-4 items-center relative">
      <span className="flex-1">{account.service}</span>
      <span
        className="flex-1 text-sm cursor-pointer hover:underline"
        title="Copy username or email"
        onClick={() => navigator.clipboard.writeText(account.username)}
      >
        {account.username || "-"}
      </span>
      <span
        className="flex-1 text-sm flex items-center gap-x-3 hover:underline cursor-pointer"
        title="Copy password"
        onClick={() => navigator.clipboard.writeText(account.password)}
      >
        {viewing && (account.password || "-")}
        <GrView
          className="cursor-pointer"
          size={15}
          onClick={() => setViewing(!viewing)}
          title={`${viewing ? "Hide" : "Show"} password`}
        />
      </span>
      <span className="flex-2 text-sm">{account.notes}</span>
      <span className="flex-1 text-sm" title={new Date(account.created).toISOString()}>
        {new Date(account.created).toLocaleDateString()}
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
              Are you sure you want to <span className="text-red-500">delete</span> this account and its related information on
              Subtrack? This action cannot be undone.
            </WarningModal>
          </Modal>
        )}
        {editing && (
          <Modal close={() => setEditing(false)}>
            <AddAccount
              close={() => setEditing(false)}
              setUserAccounts={setUserAccounts}
              services={services}
              importedData={account}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;
