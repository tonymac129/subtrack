type WarningModalProps = {
  operation: () => void;
  close: () => void;
  children: React.ReactNode;
};

function WarningModal({ operation, close, children }: WarningModalProps) {
  return (
    <div className="text-lg text-gray-100">
      {children}
      <div className="flex gap-x-5 py-5">
        <button
          className="bg-red-500 border-2 border-red-500 rounded-lg font-bold px-4 py-2 cursor-pointer text-white"
          onClick={operation}
        >
          Confirm
        </button>
        <button className="border-2 border-gray-700 rounded-lg font-bold px-4 py-2 cursor-pointer text-white" onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default WarningModal;
