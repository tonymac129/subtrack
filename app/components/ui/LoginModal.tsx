"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import LoginBtn from "./LoginBtn";

const clientId = "742944367854-ei4dk3hutnigif1kk7ggja04m6kuqln4.apps.googleusercontent.com";

type CredentialsType = {
  user: string;
  password: string;
};

function LoginModal() {
  const [credentials, setCredentials] = useState<CredentialsType>({ user: "", password: "" });

  function handleLogin() {
    //TODO: finish implementing login logic
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <form className="flex flex-col gap-y-5" onSubmit={handleLogin}>
        <h2 className="text-white text-2xl text-center font-bold">Subtrack Login</h2>
        <div className="flex flex-col gap-y-3">
          <label className="flex flex-col gap-y-1 text-gray-400">
            Username or email
            <input
              type="text"
              placeholder="User"
              value={credentials.user}
              onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-full"
            />
          </label>
          <label className="flex flex-col gap-y-1 text-gray-400">
            Password
            <input
              type="text"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="text-gray-100 border-2 border-gray-700 rounded-lg text-lg outline-none px-5 py-1 w-full"
            />
          </label>
        </div>
        <button
          className="rounded-lg text-gray-100 py-2 cursor-pointer bg-blue-600 w-full text-center text-lg mt-2"
          type="submit"
        >
          Sign in
        </button>
        <div className="h-0.5 bg-gray-500 relative my-2">
          <div
            className="absolute left-[50%] -translate-x-[50%] translate-y-[-50%] top-0 bg-[rgb(10,10,20)]
           text-gray-300 w-15 text-center"
          >
            or
          </div>
        </div>
        <LoginBtn />
      </form>
    </GoogleOAuthProvider>
  );
}

export default LoginModal;
