"use client";

import { BsGithub } from "react-icons/bs";
import { BiGlobe } from "react-icons/bi";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Modal from "@/components/Modal";
import LoginModal from "@/components/modals/LoginModal";

type LandingProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Landing({ setIsLoggedIn }: LandingProps) {
  const [signUpOpen, setSignUpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (signUpOpen) {
      document.documentElement.classList.add("modal-open");
    } else {
      document.documentElement.classList.remove("modal-open");
    }
  }, [signUpOpen]);

  function handleGuest(): void {
    setIsLoggedIn(true);
  }

  return (
    <div className="bg-gray-950 flex flex-col">
      <title>Subtrack: the best subscription, account, and project manager</title>
      <nav className="flex items-center sticky top-0 bg-gray-950 z-10 justify-between px-90 py-3 border-b-2 border-gray-700">
        <Link href="/" className="text-white font-bold text-2xl">
          Subtrack
        </Link>
        <button
          className="px-4 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 
          cursor-pointer text-white text-md duration-300 font-bold"
          onClick={() => setSignUpOpen(true)}
        >
          Log in
        </button>
      </nav>
      <div className="flex flex-col items-center justify-center text-center px-5 py-20 gap-y-8">
        <h1 className="text-5xl font-extrabold text-white">
          Introducing <span className="text-blue-600">Subtrack</span>
        </h1>
        <p className="text-lg text-gray-100 w-180">
          The all-in-one manager that keeps track of all your subscriptions, accounts, projects, and more, so you can focus on
          what actually matters.
        </p>
        <div className="flex gap-4">
          <button
            className="px-7 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
          cursor-pointer text-white text-lg duration-300 font-bold"
            title="Data is stored securely in the cloud with syncing, backup, and more customizations enabled."
            onClick={() => setSignUpOpen(true)}
          >
            Log in
          </button>
          <button
            className="px-7 py-2 rounded-lg border-2 border-gray-500 hover:bg-gray-900 
            cursor-pointer text-white text-lg duration-300 font-bold"
            title="Data is stored locally in browser storage"
            onClick={handleGuest}
          >
            Guest mode
          </button>
        </div>
      </div>
      <div className="px-90 flex flex-col gap-y-10 pb-20">
        <div className="flex-col flex gap-y-5">
          <h2 className="text-3xl font-bold text-white">What is Subtrack?</h2>
          <p className="text-gray-300 leading-6">
            Subtrack helps you organize and manage your online subscriptions, accounts, projects, and more in one place, so you
            are in control of everything and can focus on what actually matters, instead of worrying about running out of budget.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Is it safe?</h2>
          <p className="text-gray-300 leading-6">
            You are the one in control, either create an account and store your private information securely encrypted in the
            cloud with syncing, backup, and other advanced customizations enabled, or continue as guest and your data stays local
            in your browser. No sketchy tracking, just tools that do what you want them to do.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">About Subtrack</h2>
          <p className="text-gray-300 leading-6">
            Subtrack is a web app developed by{" "}
            <a href="https://tonymac.net" target="_blank" className="text-blue-500 hover:underline">
              me
            </a>{" "}
            for Hack Club&apos;s{" "}
            <a href="https://flavortown.hackclub.com" target="_blank" className="text-blue-500 hover:underline">
              Flavortown
            </a>{" "}
            winter event! The app is completely open source on{" "}
            <a href="https://github.com/tonymac129/subtrack" target="_blank" className="text-blue-500 hover:underline">
              GitHub
            </a>
            , so feel free to check it out and even contribute! This is a Next.js app hosted on Vercel built with React,
            TypeScript, MongoDB, and Tailwind.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Local setup</h2>
          <p className="text-gray-300 leading-6">
            If for some reason you want to host Subtrack on your local machine, simply clone the GitHub{" "}
            <a href="https://github.com/tonymac129/subtrack" target="_blank" className="text-blue-500 hover:underline">
              repo
            </a>
            , open it with your favorite code editor, and run the command{" "}
            <code className="bg-gray-900 p-1 px-2 rounded-md text-nowrap">npm run dev</code> to open and host it on
            localhost:3000.
          </p>
        </div>
      </div>
      <footer className="py-15 flex flex-col gap-y-5 text-center text-sm text-gray-400 border-t border-gray-700">
        <div>
          © {new Date().getFullYear()} Subtrack <span className="px-3">•</span> All Rights Reserved
        </div>
        <div className="flex justify-center items-center gap-x-5">
          <BiGlobe
            size={30}
            className="cursor-pointer"
            title="Public website"
            onClick={() => window.open("https://app-subtrack.vercel.app", "_blank")}
          />
          <BsGithub
            size={25}
            className="cursor-pointer"
            title="GitHub repository"
            onClick={() => window.open("https://github.com/tonymac129/subtrack", "_blank")}
          />
        </div>
      </footer>
      <AnimatePresence>
        {signUpOpen && (
          <Modal close={() => setSignUpOpen(false)} width={450} height={450}>
            <LoginModal />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing;
