import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const Expenses = () => {
  const { user } = useAuth();
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

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const snapshot = await getDocs(collection(db, "inventory"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const isFormValid = () => {
    if (!expenseType) return false;
    if (expenseType === "Inventory") return selectedInventory;
    return to && purpose && totalAmount && paidAmount;
  };

  const handleSubmit = async () => {
    if (!user) return alert("User not authenticated.");
    if (!isFormValid()) return alert("Please fill all fields.");

    setSubmitting(true);

    const baseData = {
      type: "expense",
      category: expenseType,
      status,
      addedBy: user.email,
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
      alert("Save Expenses Succesfull!");
      resetForm();
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setExpenseType("");
    setSelectedInventory(null);
    setTo("");
    setPurpose("");
    setTotalAmount("");
    setPaidAmount("");
    setDueAmount(0);
    setStatus("Paid");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 hover:underline self-start mb-4 text-center"
      >
         Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Record Expense</h2>

      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-2">Expense Type</label>
          <div className="flex gap-4">
            {["Inventory", "Wages", "Rent"].map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="expenseType"
                  value={type}
                  checked={expenseType === type}
                  onChange={() => {
                    setExpenseType(type);
                    resetForm(); setExpenseType(type);
                  }}
                  className="mr-1"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {expenseType === "Inventory" && (
          <>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Select Inventory</label>
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
              <div className="bg-gray-50 p-3 rounded border text-sm space-y-1 mb-4">
                <p><strong>Name:</strong> {selectedInventory.name}</p>
                <p><strong>Category:</strong> {selectedInventory.category}</p>
                <p><strong>Price:</strong> Rs.{selectedInventory.price}</p>
                <p><strong>Unit:</strong> {selectedInventory.unitOfPrice}</p>
                <p><strong>Added By:</strong> {selectedInventory.addedBy}</p>
              </div>
            )}
          </>
        )}

        {(expenseType === "Wages" || expenseType === "Rent") && (
          <>
            <div className="mb-3">
              <label className="block font-semibold mb-1">{expenseType} To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border rounded p-2"
                placeholder={`To whom the ${expenseType.toLowerCase()} was paid`}
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Purpose</label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Purpose of payment"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block font-semibold mb-1">Total</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Paid</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Due</label>
              <input
                type="number"
                value={dueAmount}
                readOnly
                className="w-full bg-gray-100 border rounded p-2"
              />
            </div>
          </>
        )}

        {isFormValid() && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Status</label>
            <div className="flex gap-4">
              {["Paid", "Unpaid"].map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    value={s}
                    checked={status === s}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mr-1"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !isFormValid()}
          className={`w-full py-3 rounded text-white font-semibold ${
            submitting || !isFormValid()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Expenses;
