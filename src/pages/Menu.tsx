import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import useMenuItems, { MenuItem } from "../hooks/UseMenuItems";
import MenuHeader from "../components/menu/MenuHeader";
import MenuTable from "../components/menu/MenuTable";

const Menu: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { menuItems, loading, error } = useMenuItems();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const columns = [
    { label: "Name" },
    { label: "Category" },
    { label: "Price" },
    { label: "Unit" },
    { label: "Quantity" },
    { label: "Added By" },
    { label: "Recorded At" },
  ];

  const rowRenderer = (item: MenuItem) => (
    <tr key={item.id}>
      <td className="border p-2">{item.name}</td>
      <td className="border p-2">{item.category || "-"}</td>
      <td className="border p-2">{item.price ?? "-"}</td>
      <td className="border p-2">{item.unit || "-"}</td>
      <td className="border p-2">{item.quantity ?? "-"}</td>
      <td className="border p-2">{item.addedBy || "-"}</td>
      <td className="border p-2">
        {item.recordedAt?.toDate ? item.recordedAt.toDate().toLocaleString() : "-"}
      </td>
    </tr>
  );

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
          <MenuTable<MenuItem> items={menuItems} columns={columns} rowRenderer={rowRenderer} />
        )}
      </div>
    </div>
  );
};

export default Menu;
