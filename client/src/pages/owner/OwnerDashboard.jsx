import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Logout from "../auth/Logout";

const OwnerDashboard = ({ setRole }) => {
  const [stores, setStores] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchStores = async () => {
    try {
      const res = await api.get("/owner/dashboard", { withCredentials: true });
      setStores(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error fetching stores");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const res = await api.put(
        "/owner/update-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  useEffect(() => { fetchStores(); }, []);

  return (
    <div className="p-6 space-y-6">
     
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <Logout setRole={setRole} />
      </div>

      <div className="border rounded p-4 shadow space-y-2">
        <h2 className="font-semibold text-xl">Update Password</h2>
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={handleUpdatePassword}
        >
          Update Password
        </button>
      </div>

      {stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        stores.map(store => (
          <div key={store.id} className="border rounded p-4 shadow space-y-2">
            <h2 className="font-semibold text-xl">{store.name}</h2>
            <p>Email: {store.email}</p>
            <p>Address: {store.address}</p>
            <p>Average Rating: <b>{store.avgRating?.toFixed(2) ?? 0}</b></p>

            <div>
              <h3 className="font-semibold mt-2">Users Who Rated:</h3>
              {store.raters.length === 0 ? (
                <p>No ratings yet.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {store.raters.map((r, idx) => (
                    <li key={idx}>
                      User ID: {r.userId} | Rating: {r.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OwnerDashboard;
