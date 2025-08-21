import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Logout({ setRole }) {  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setRole(null);          
      navigate("/");           // redirect to login
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded">
      Logout
    </button>
  );
}
