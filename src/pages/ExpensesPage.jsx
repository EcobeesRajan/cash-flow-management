import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
const ExpensesPage = () => {
  const navigate = useNavigate();
  const [expenseType, setExpenseType] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [to, setTo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState(0);
  const [status, setStatus] = useState("Paid");
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const snapshot = await getDocs(collection(db, "inventory"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventoryList(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);
  useEffect(() => {
    const total = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;
    setDueAmount(Math.max(total - paid, 0));
  }, [totalAmount, paidAmount]);
  const isDetailsFilled = () => {
    if (!expenseType) return false;
    if (expenseType === "Inventory") {
      return selectedInventory;
    }
    if (expenseType === "Wages" || expenseType === "Rent") {
      return to && purpose && totalAmount && paidAmount;
    }
    return false;
  };
  const handleSubmit = async () => {
    if (!user || !user.username) return alert("User not logged in.");
    if (!isDetailsFilled()) return alert("Please fill all required fields.");
    setSubmitting(true);
    const baseData = {
      type: "expense",
      category: expenseType,
      status,
      addedBy: user.username,
      role: user.role || "staff",
      RecordedAt: serverTimestamp(),
    };
    let expenseData = {};
    if (expenseType === "Inventory") {
      expenseData = {
        "inventory-id": selectedInventory.id,
        "inventory-name": selectedInventory.name,
        "inventory-category": selectedInventory.category,
        "inventory-price": selectedInventory.price,
        "inventory-unitOfPrice": selectedInventory.unitOfPrice,
        "inventory-addedBy": selectedInventory.addedBy || "",
      };
    } else {
      expenseData = {
        to,
        purpose,
        totalAmount: Number(totalAmount),
        paidAmount: Number(paidAmount),
        dueAmount: dueAmount,
      };
    }
    try {
      await addDoc(collection(db, "transaction"), {
        ...baseData,
        ...expenseData,
      });
      alert("Expense recorded successfully!");
      setExpenseType("");
      setSelectedInventory(null);
      setTo("");
      setPurpose("");
      setTotalAmount("");
      setPaidAmount("");
      setDueAmount(0);
      setStatus("Paid");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Record Expense</h2>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Expense Type:</label>
        <div className="flex gap-6">
          {["Inventory", "Wages", "Rent"].map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                type="radio"
                value={type}
                checked={expenseType === type}
                onChange={(e) => {
                  setExpenseType(e.target.value);
                  setSelectedInventory(null);
                  setTo("");
                  setPurpose("");
                  setTotalAmount("");
                  setPaidAmount("");
                  setDueAmount(0);
                  setStatus("Paid");
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      {expenseType === "Inventory" && (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Select Inventory:</label>
            <select
              className="w-full border rounded p-2"
              value={selectedInventory?.id || ""}
              onChange={(e) =>
                setSelectedInventory(
                  inventoryList.find((item) => item.id === e.target.value) || null
                )
              }
            >
              <option value="">-- Select item --</option>
              {inventoryList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {selectedInventory && (
            <div className="border rounded p-4 bg-gray-50 mb-4 space-y-1">
              <h4 className="font-semibold mb-2">Inventory Details</h4>
              <p><strong>Name:</strong> {selectedInventory.name}</p>
              <p><strong>Category:</strong> {selectedInventory.category}</p>
              <p><strong>Price:</strong> Rs.{selectedInventory.price}</p>
              <p><strong>Unit of Price:</strong> {selectedInventory.unitOfPrice}</p>
              <p><strong>Quantity:</strong> {selectedInventory.quantity}</p>
              <p><strong>Added By:</strong> {selectedInventory.addedBy}</p>
              <p>
                <strong>Recorded At:</strong>{" "}
                {selectedInventory.RecordedAt
                  ? new Date(selectedInventory.RecordedAt.seconds * 1000).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          )}
        </>
      )}
      {(expenseType === "Wages" || expenseType === "Rent") && (
        <>
          <div className="mb-4">
            <label className="block font-semibold mb-1">{expenseType} To:</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={`Enter ${expenseType.toLowerCase()} recipient`}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Purpose of {expenseType}:</label>
            <textarea
              rows={3}
              className="w-full border rounded p-2"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Enter purpose"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Total {expenseType} Amount:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border rounded p-2"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Total amount"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Paid Amount:</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border rounded p-2"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Paid amount"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Due Amount:</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-gray-100"
              value={dueAmount}
              readOnly
              placeholder="Due amount"
            />
          </div>
        </>
      )}
      {isDetailsFilled() && (
        <div className="mb-6">
          <label className="block font-semibold mb-2">Status:</label>
          <div className="flex gap-6">
            {["Paid", "Unpaid"].map((s) => (
              <label key={s} className="cursor-pointer">
                <input
                  type="radio"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mr-2"
                />
                {s}
              </label>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={submitting || !isDetailsFilled()}
        className={`w-full py-3 rounded text-white font-semibold ${
          submitting || !isDetailsFilled()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        type="button"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
};
export default ExpensesPage;

