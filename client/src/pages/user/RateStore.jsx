import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function RateStore() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [value, setValue] = useState(1);

  const loadStore = async () => {
    try {
      const res = await api.get("/stores", { params: { search: "" } });
      const s = res.data.find(st => st.id.toString() === storeId);
      if (s) {
        setStore(s);
        if (s.userRating) setValue(s.userRating);
      }
    } catch (err) { console.error(err); }
  };

  const submitRating = async () => {
    try {
      const endpoint = store.userRating ? `/stores/${storeId}/rate` : `/stores/${storeId}/rate`;
      await api.post(endpoint, { value });
      alert("Rating submitted!");
      navigate("/stores");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    }
  };

  useEffect(() => { loadStore(); }, [storeId]);

  if (!store) return <p>Loading store...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Rate Store: {store.name}</h1>
      <p className="text-gray-600">{store.address}</p>
      <div>
        <label>Rating (1–5): </label>
        <input
          type="number"
          min="1"
          max="5"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
      </div>
      <button
        onClick={submitRating}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        {store.userRating ? "Update Rating" : "Submit Rating"}
      </button>
    </div>
  );
}
