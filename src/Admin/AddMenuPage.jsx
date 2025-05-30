import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const AddMenuPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("Tea");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Pic");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("User not logged in");

      await addDoc(collection(db, "menu"), {
        name,
        type,
        price: Number(price),
        unit,
        quantity: Number(quantity),
        addedBy: user.email || user.username || "Unknown",
        RecordedAt: serverTimestamp(),
        role: user.role || "staff",
        username: user.username || "Unknown",
      });

      navigate("/menu");
    } catch (error) {
      console.error("Failed to add menu:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate("/menu")}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
            Add New Menu Item
          </h2>
          <div style={{ width: "64px" }}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category / Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Tea">Tea</option>
              <option value="Snacks">Snacks</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Pics">Pics</option>
              <option value="Packet">Packet</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Quantity</label>
            <input
              type="number"
              min="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuPage;
