import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import useMenuItems from "../components/menu/UseMenuItems.jsx";
import MenuHeader from "../components/menu/MenuHeader.jsx";
import MenuTable from "../components/menu/MenuTable.jsx";

const Menu = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { menuItems, loading, error } = useMenuItems();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <MenuHeader />
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-4">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-gray-500">No menu items found.</p>
        ) : (
          <MenuTable items={menuItems} />
        )}
      </div>
    </div>
  );
};

export default Menu;
