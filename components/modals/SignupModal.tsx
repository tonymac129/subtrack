"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { FormEvent, useState } from "react";
import LoginBtn from "../ui/LoginBtn";
import { IoWarning } from "react-icons/io5";

const clientId = "742944367854-ei4dk3hutnigif1kk7ggja04m6kuqln4.apps.googleusercontent.com";

type CredentialsType = {
  user: string;
  password: string;
};

type SignupModalProps = {
  setIsLoggedIn: () => void;
};

function SignupModal({ setIsLoggedIn }: SignupModalProps) {
  const [credentials, setCredentials] = useState<CredentialsType>({ user: "", password: "" });
  const [SignupFailed, setSignupFailed] = useState<boolean>(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: credentials.user, password: credentials.password }),
    });
    const message = await res.json();
    if (!message.message) {
      sessionStorage.setItem("subtrack-user", JSON.stringify(message));
      setIsLoggedIn();
    }
    setSignupFailed(message.message);
    //TODO: finish implementing login logic
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <form className="flex flex-col gap-y-5" onSubmit={(e) => handleLogin(e)}>
        <h2 className="text-white text-2xl text-center font-bold">Subtrack Signup</h2>
        <div className="flex flex-col gap-y-3">
          <label className="flex flex-col gap-y-1 text-gray-400">
            Username or email
            <input
              type="text"
              placeholder="User"
              value={credentials.user}
              onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
              className="modal-input w-full!"
            />
          </label>
          <label className="flex flex-col gap-y-1 text-gray-400">
            Password
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="modal-input w-full!"
            />
          </label>
          {SignupFailed && (
            <div className="text-red-500 flex items-center gap-x-2">
              <IoWarning size={25} /> Someone already has that username.
            </div>
          )}
        </div>
        <button className="modal-btn" type="submit">
          Sign up
        </button>
        <div className="h-0.5 bg-gray-500 relative my-2">
          <div
            className="absolute left-[50%] -translate-x-[50%] translate-y-[-50%] top-0 bg-[rgb(10,10,20)]
           text-gray-300 w-15 text-center"
          >
            or
          </div>
        </div>
        <LoginBtn setIsLoggedIn={setIsLoggedIn} />
      </form>
    </GoogleOAuthProvider>
  );
}

export default SignupModal;
