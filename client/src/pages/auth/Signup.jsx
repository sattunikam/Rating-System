import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/signup", form);   
      alert("Registered successfully, please login");
      nav("/"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
    <form onSubmit={submit} className="p-6 max-w-sm mx-auto border rounded space-y-4">
      <h1 className="text-2xl font-bold text-center">Register</h1>
      <input className="border px-3 py-2 rounded w-full" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input className="border px-3 py-2 rounded w-full" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input className="border px-3 py-2 rounded w-full" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <input className="border px-3 py-2 rounded w-full" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
    </form>
    </div>
  );
}
