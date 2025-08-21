import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStats() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(res => setStats(res.data))
      .catch(() => setStats({ totalUsers: 0, totalStores: 0, totalRatings: 0 }));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded p-6 text-center">
        <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        <p>Total Users</p>
      </div>
      <div className="bg-white shadow rounded p-6 text-center">
        <h2 className="text-2xl font-bold">{stats.totalStores}</h2>
        <p>Total Stores</p>
      </div>
      <div className="bg-white shadow rounded p-6 text-center">
        <h2 className="text-2xl font-bold">{stats.totalRatings}</h2>
        <p>Total Ratings</p>
      </div>
    </div>
  );
}
