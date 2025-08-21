import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await api.get("/admin/users", { params: { search } });
    setUsers(res.data);
  };

  useEffect(() => { load(); }, []);       
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [search]); // debounce

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Search by name/email/address"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Address</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-3 py-2">{u.id}</td>
              <td className="border px-3 py-2">{u.name}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.address}</td>
              <td className="border px-3 py-2">{u.role}</td>
              <td className="border px-3 py-2">
                {u.role === "ADMIN" ? (
                  <span className="text-gray-400">N/A</span>
                ) : (
                  <button
                    onClick={()=>handleDelete(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length===0 && (
            <tr><td colSpan={6} className="text-center py-6 text-gray-500">No users</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
