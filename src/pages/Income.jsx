import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const Income = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState("Cash");
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
      }
    };
    fetchMenu();
  }, []);

  const selectedItem = menuItems.find((item) => item.id === selectedItemId);
  const total = selectedItem ? selectedItem.price * quantity : 0;

  const handleSave = async () => {
    if (!selectedItem) {
      alert("Please select a menu item.");
      return;
    }
    if (!note.trim()) {
      alert("Please enter a note.");
      return;
    }
    if (!user) {
      alert("User not logged in.");
      return;
    }
    if (selectedItem.price === undefined || selectedItem.unit === undefined) {
      alert("Menu item is missing price or unit.");
      return;
    }
    if (paymentType === "Cash + Online") {
      const cash = Number(cashAmount);
      const online = Number(onlineAmount);
      if (cash + online !== total) {
        alert(`Price isnot equal to Rs.${total}`);
        return;
      }
    }

    try {
      setSaving(true);
      const record = {
        category: "Income",
        type: "income",
        "menu-id": selectedItem.id,
        "menu-name": selectedItem.name,
        "menu-unit-of-price": selectedItem.unit,
        menu_price: selectedItem.price,
        quantity,
        Total_price: total,
        status: paymentType,
        cash:
          paymentType === "Cash + Online"
            ? Number(cashAmount)
            : paymentType === "Cash"
            ? total
            : 0,
        online:
          paymentType === "Cash + Online"
            ? Number(onlineAmount)
            : paymentType === "Online"
            ? total
            : 0,
        Logs: note,
        added_by: user.username || "Unknown",
        role: user.role || "staff",
        RecordedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "transaction"), record);
      alert("Income record saved successfully.");

      setSelectedItemId("");
      setQuantity(1);
      setPaymentType("Cash");
      setCashAmount("");
      setOnlineAmount("");
      setNote("");
    } catch (error) {
      console.error("Failed to save income:", error);
      alert("Failed to save income record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto w-full bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6 relative">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 font-semibold hover:underline"
          >
             Back
          </button>
          <h2 className="text-2xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
            Record Income
          </h2>
        </div>

        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md"
        >
          <option value="">Select Menu Item</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - Rs.{item.price}
            </option>
          ))}
        </select>

        {selectedItem && (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <label htmlFor="menuquantity" className="font-bold">
                Quantity
              </label>
              <input
                id="menuquantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-1/2 px-3 py-2 border rounded-md"
                placeholder="Quantity"
              />
              <span className="text-gray-700">{selectedItem.unit}</span>
            </div>
            <div className="mb-4 text-lg font-semibold">Total: Rs.{total}</div>
          </>
        )}

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md"
        >
          <option value="Cash">Cash</option>
          <option value="Online">Online</option>
          <option value="Cash + Online">Cash + Online</option>
        </select>

        {paymentType === "Cash + Online" && (
          <div className="space-y-3 mb-4">
            <input
              type="number"
              placeholder="Cash Amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Online Amount"
              value={onlineAmount}
              onChange={(e) => setOnlineAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}

        <textarea
          required
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md"
          rows={3}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Income;
