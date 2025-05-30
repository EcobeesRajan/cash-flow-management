
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const IncomePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState("Cash");
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, "menu"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleSave = async () => {
    if (!selectedItem || !note.trim()) {
      alert("Please select a menu item and enter a note.");
      return;
    }

    if (!user) {
      alert("User not logged in.");
      return;
    }

    const total = selectedItem.price * quantity;

    if (paymentType === "Cash + Online") {
      const cash = Number(cashAmount);
      const online = Number(onlineAmount);
      if (cash + online !== total) {
        alert(`Cash + Online amount must equal total (Rs.${total})`);
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
        "menu-unit-of-price": selectedItem.unitOfPrice,
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
        added_by: user.username,
        role: user.role || "staff",
        RecordedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "transaction"), record);

      alert("Income saved successfully!");

      setSelectedItem(null);
      setQuantity(1);
      setPaymentType("Cash");
      setCashAmount("");
      setOnlineAmount("");
      setNote("");
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Failed to save income.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-4 flex items-center space-x-1"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Income Page</h1>

      <select
        onChange={(e) => {
          const item = menuItems.find((i) => i.name === e.target.value);
          setSelectedItem(item || null);
        }}
        className="w-full mb-4 px-3 py-2 border rounded-md"
        value={selectedItem?.name || ""}
      >
        <option value="">Select Menu Item</option>
        {menuItems.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}- Rs.{item.price}
          </option>
        ))}
      </select>

      {selectedItem && (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="menuquantity"><h2 className="font-bold">Quantity</h2> </label>
            <input
            id = "menuquantity"
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-1/2 px-3 py-2 border rounded-md"
              placeholder="Quantity"
            />
            <span className="text-gray-700"> {selectedItem.unitOfPrice}</span>
          </div>

          <div className="mb-4 text-lg font-medium">
            Total: Rs.{selectedItem.price * quantity}
          </div>
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
        <div className="space-y-4 mb-4">
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
  );
};

export default IncomePage;
