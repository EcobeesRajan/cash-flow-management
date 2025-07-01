import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import useMenuItems, { MenuItem } from "../hooks/UseMenuItems";
import MenuHeader from "../components/menu/MenuHeader";
import MenuTable from "../components/menu/MenuTable";
import Pagination from "../components/field/Pagination";

const Menu: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { menuItems, loading, error } = useMenuItems();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Calculate total pages based on total menu items
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  // Slice the menuItems to only show items for current page
  const paginatedItems = menuItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when menuItems change (like after loading)
  useEffect(() => {
    setCurrentPage(1);
  }, [menuItems]);

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
          <>
            <MenuTable<MenuItem>
              items={paginatedItems}
              columns={columns}
              rowRenderer={rowRenderer}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) setCurrentPage(page);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
