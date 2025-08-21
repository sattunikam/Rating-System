import { useEffect, useState } from "react";
import api from "../../api/axios";
import Logout from "../auth/Logout";

export default function AdminDashboard({ setRole }) {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "USER" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });

  useEffect(() => { fetchStats(); fetchUsers(); fetchStores(); }, []);

  const fetchStats = async () => { const res = await api.get("/admin/stats"); setStats(res.data); };
  const fetchUsers = async () => { const res = await api.get("/admin/users"); setUsers(res.data); };
  const fetchStores = async () => { const res = await api.get("/admin/stores"); setStores(res.data); };

  const handleAddUser = async () => {
    try {
      await api.post("/admin/users", newUser,{ withCredentials: true });
      alert("User added!");
      setNewUser({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || "Error adding user"); }
  };

  const handleAddStore = async () => {
    try {
      await api.post("/admin/stores", newStore,{ withCredentials: true });
      alert("Store added!");
      setNewStore({ name: "", email: "", address: "" });
      fetchStores();
    } catch (err) { alert(err.response?.data?.message || "Error adding store"); }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.address.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.email.toLowerCase().includes(filter.toLowerCase()) ||
    s.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Logout setRole={setRole} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Total Users</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Total Stores</h2>
          <p className="text-2xl font-bold">{stats.totalStores}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Total Ratings</h2>
          <p className="text-2xl font-bold">{stats.totalRatings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add User */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold text-lg mb-2">Add New User</h2>
          <input className="border p-2 w-full rounded" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name:e.target.value})} />
          <input className="border p-2 w-full rounded" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email:e.target.value})} />
          <input className="border p-2 w-full rounded" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password:e.target.value})} />
          <input className="border p-2 w-full rounded" placeholder="Address" value={newUser.address} onChange={e => setNewUser({...newUser, address:e.target.value})} />
          <select className="border p-2 w-full rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role:e.target.value})}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleAddUser}>Add User</button>
        </div>

        {/* Add Store */}
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold text-lg mb-2">Add New Store</h2>
          <input className="border p-2 w-full rounded" placeholder="Name" value={newStore.name} onChange={e => setNewStore({...newStore, name:e.target.value})} />
          <input className="border p-2 w-full rounded" placeholder="Email" value={newStore.email} onChange={e => setNewStore({...newStore, email:e.target.value})} />
          <input className="border p-2 w-full rounded" placeholder="Address" value={newStore.address} onChange={e => setNewStore({...newStore, address:e.target.value})} />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAddStore}>Add Store</button>
        </div>
      </div>

      {/* Filter */}
      <input className="border p-2 w-full rounded" placeholder="Search users/stores" value={filter} onChange={e => setFilter(e.target.value)} />

      {/* Users Table */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold my-2">Users</h2>
        <table className="table-auto border-collapse border w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.address}</td>
                <td className="border px-2 py-1">{u.role}</td>
                <td className="border px-2 py-1">{u.rating !== null ? Number(u.rating).toFixed(2) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold my-2">Stores</h2>
        <table className="table-auto border-collapse border w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Address</th>
              <th className="border px-2 py-1">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(s => (
              <tr key={s.id} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.email}</td>
                <td className="border px-2 py-1">{s.address}</td>
                <td className="border px-2 py-1">{Number(s.avgRating ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
