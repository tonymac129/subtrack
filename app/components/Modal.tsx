"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type ModalProps = {
  children: React.ReactNode;
  close: () => void;
};

function Modal({ children, close }: ModalProps) {
  const modalBgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clickListener = (e: Event) => {
      if (e.target === modalBgRef.current) {
        close();
      }
    };
    document.addEventListener("click", clickListener);
    return () => {
      document.removeEventListener("click", clickListener);
    };
  });

  return (
    <motion.div
      exit={{ opacity: 0 }}
      ref={modalBgRef}
      className="w-screen h-screen z-50 fixed top-0 left-0 flex items-center justify-center bg-gray-950/70 backdrop-blur-xs overflow-hidden"
    >
      <motion.div
        initial={{ y: 50, scale: 0, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 100, scale: 0 }}
        className="bg-[rgb(10,10,20)] p-10 w-[50%] h-[90%] rounded-lg overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
