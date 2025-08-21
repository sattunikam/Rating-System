import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  const load = async () => {
  const res = await api.get("/admin/stores", { params: { limit: 100 } }); 
  setStores(res.data);
};

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this store?")) return;
    await api.delete(`/admin/stores/${id}`);
    setStores(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Address</th>
            <th className="border px-3 py-2">Avg Rating</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td className="border px-3 py-2">{s.id}</td>
              <td className="border px-3 py-2">{s.name}</td>
              <td className="border px-3 py-2">{s.address}</td>
              <td className="border px-3 py-2">{s.avgRating?.toFixed?.(2) ?? s.avgRating}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={()=>handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {stores.length===0 && (
            <tr><td colSpan={5} className="text-center py-6 text-gray-500">No stores</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
