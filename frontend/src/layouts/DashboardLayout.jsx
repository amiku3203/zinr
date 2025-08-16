 // src/layouts/DashboardLayout.jsx
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Home, PlusCircle, Layers, UtensilsCrossed, LogOut } from "lucide-react";
import { showSuccess } from "../utils/toast";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuth());
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between shadow-xl">
        <div>
          {/* Brand */}
          <h1
            className="text-2xl font-extrabold mb-8 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Zin<span className="text-yellow-400">R</span>
          </h1>

          {/* Navigation */}
          <nav className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
            >
              <Home size={18} /> Dashboard
            </button>
            <button
              onClick={() => navigate("/create-restaurant")}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
            >
              <PlusCircle size={18} /> Create Restaurant
            </button>
            <button
              onClick={() => navigate("/create-category")}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
            >
              <Layers size={18} /> Create Category
            </button>
            <button
              onClick={() => navigate("/create-menu-item")}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
            >
              <UtensilsCrossed size={18} /> Create Menu Item
            </button>
          </nav>
        </div>

        {/* Footer - User Info */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{user?.name || "User"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 justify-center w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold mb-4">
          Welcome, <span className="text-yellow-400">{user?.name || "User"}</span> 🎉
        </h2>
        {children}
      </main>
    </div>
  );
}
