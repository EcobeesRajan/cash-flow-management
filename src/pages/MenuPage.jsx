
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
const MenuPage = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "menu"), orderBy("RecordedAt", "desc"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);
  const groupByDate = (data) => {
    const groups = {};
    data.forEach((item) => {
      const recordedAt = item.RecordedAt?.toDate?.();
      if (!recordedAt) return;
        
      const label = recordedAt.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });
    return groups;
  };
  const groupedMenuItems = groupByDate(menuItems);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
            Menu
          </h2>
          <button
            onClick={() => navigate("/add-menu")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Menu
          </button>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : Object.keys(groupedMenuItems).length === 0 ? (
          <p className="text-center text-gray-500">No menu items found.</p>
        ) : (
          Object.entries(groupedMenuItems).map(([label, items]) => (
            <div key={label} className="mb-6">
              <h3 className="text-lg font-semibold bg-gray-200 px-4 py-2 rounded-t">
                {label}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-center">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Category</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Unit</th>
                      <th className="p-2 border">Quantity</th>
                      <th className="p-2 border">Added By</th>
                      <th className="p-2 border">Recorded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="text-center hover:bg-gray-50">
                        <td className="p-2 border">{item.name}</td>
                        <td className="p-2 border">{item.type}</td>
                        <td className="p-2 border">Rs. {item.price}</td>
                        <td className="p-2 border">{item.unit}</td>
                        <td className="p-2 border">{item.quantity}</td>
                        <td className="p-2 border">{item.username}</td>
                        <td className="p-2 border">
                          {item.RecordedAt?.toDate
                            ? item.RecordedAt.toDate().toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default MenuPage;

