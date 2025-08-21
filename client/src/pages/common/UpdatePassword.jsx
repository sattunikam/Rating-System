import { useState } from "react";
import api from "../../api/axios";
import Logout from "../auth/Logout"; 

export default function UpdatePassword({ setRole }) {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");

  const handle = async () => {
    try {
      await api.put("/users/update-password", { oldPassword, newPassword });
      alert("Password updated!");
      setOld(""); setNew("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Update Password</h1>
      <input type="password" placeholder="Old Password" value={oldPassword} onChange={e=>setOld(e.target.value)} className="border px-2 py-1 rounded"/>
      <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNew(e.target.value)} className="border px-2 py-1 rounded"/>
      <button onClick={handle} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      <Logout setRole={setRole} />
    </div>
  );
}
