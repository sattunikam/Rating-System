import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Logout from "../auth/Logout"; 

export default function StoreList({ setRole }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/stores", { params: { search } });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Logout setRole={setRole} />
      </div>

      <input
        className="border px-3 py-2 rounded w-72"
        placeholder="Search by name/address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-3">
        {stores.map(s => (
          <li key={s.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">{s.address}</div>
              <div className="text-sm mt-1">
                Avg: <b>{Number(s.avgRating ?? 0).toFixed(2)}</b> | 
                Your rating: <b>{s.userRating ?? "-"}</b>
              </div>
            </div>
            <Link
              to={`/stores/${s.id}/rate`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {s.userRating ? "Update rating" : "Rate now"}
            </Link>
          </li>
        ))}
        {stores.length === 0 && <li className="text-gray-500">No stores</li>}
      </ul>
    </div>
  );
}
