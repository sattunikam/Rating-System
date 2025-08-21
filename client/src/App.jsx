import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StoreList from "./pages/user/StoreList";
import RateStore from "./pages/user/RateStore";
import UpdatePassword from "./pages/common/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

export default function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch role 
  useEffect(() => {
    api.get("/me",{ withCredentials: true })               
      .then(res => setRole(res.data?.role ?? null))
      .catch(() => setRole(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  const isLoggedIn = !!role;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/signup" element={<Signup setRole={setRole} />} />
 
        {/* Role-based routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="ADMIN" role={role}>
            <AdminDashboard setRole={setRole}/>
          </ProtectedRoute>
        }/>

        <Route path="/stores" element={
          isLoggedIn ? (
            <ProtectedRoute allowedRole="USER" role={role}>
              <StoreList setRole={setRole} />
            </ProtectedRoute>
          ) : <Navigate to="/login" />
        }/>
        <Route path="/stores/:storeId/rate" element={
          isLoggedIn ? (
            <ProtectedRoute allowedRole="USER" role={role}>
              <RateStore />
            </ProtectedRoute>
          ) : <Navigate to="/login" />
        }/>

        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRole="OWNER" role={role}>
            <OwnerDashboard setRole={setRole}/>
          </ProtectedRoute>
        }/>

        <Route path="/update-password" element={
          isLoggedIn ? <UpdatePassword /> : <Navigate to="/login" />
        }/>
      </Routes>
    </BrowserRouter>
  );
}
