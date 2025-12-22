"use client";

import { useState } from "react";
import { UserType } from "@/types/user";

type ProfileModalProps = {
  userData: UserType;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
  close: () => void;
};

function ProfileModal({ userData, setUserData, close }: ProfileModalProps) {
  const [user, setUser] = useState<UserType>(userData);

  function handleSave(e: React.FormEvent): void {
    e.preventDefault();
    setUserData(user);
    close();
  }

  return (
    <form onSubmit={handleSave}>
      <h2 className="text-white text-2xl text-center font-bold">Edit Profile</h2>
      <div className="flex flex-col gap-y-5 py-5">
        <label className="flex flex-col gap-y-1 text-gray-400">
          Username or email
          <input
            type="text"
            placeholder="User"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="modal-input w-full!"
          />
        </label>
        <label className="flex flex-col gap-y-1 text-gray-400">
          Password
          <input
            type="text"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="modal-input w-full!"
          />
        </label>
        <div className="text-gray-100">More profile customizations coming soon!</div>
        <button type="submit" className="modal-btn">
          Save
        </button>
      </div>
    </form>
  );
}

export default ProfileModal;
