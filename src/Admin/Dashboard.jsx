
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.username || "User"}
      </h1>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate("/inventory")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
        >
          Inventory
        </button>
        <button
          onClick={() => navigate("/expenses")}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
        >
          Expenses
        </button>
        <button
          onClick={() => navigate("/income")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
        >
          Income
        </button>
        <button
          onClick={() => navigate("/menu")}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
        >
          Menu
        </button>
        <button
          onClick={() => navigate("/transaction")}
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg col-span-2"
        >
          Transaction
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
