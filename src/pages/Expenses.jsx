import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";

import BackButton from "../components/buttons/BackButton";
import SubmitButton from "../components/buttons/SubmitButton";
import ExpenseTypeSelector from "../components/expenses/ExpenseTypeSelector";
import InventoryExpenseForm from "../components/expenses/InventoryExpenseForm";
import WagesRentForm from "../components/expenses/WagesRentForm";
import StatusSelector from "../components/expenses/StatusSelector";

const Expenses = () => {
  const { user } = useAuth();

  const [expenseType, setExpenseType] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
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
    const selected = inventoryList.find(item => item.id === selectedInventoryId);
    setSelectedInventory(selected || null);
  }, [selectedInventoryId, inventoryList]);

  useEffect(() => {
    const total = parseFloat(totalAmount) || 0;
    const paid = parseFloat(paidAmount) || 0;
    setDueAmount(total - paid);
  }, [totalAmount, paidAmount]);

  const resetForm = () => {
    setSelectedInventoryId("");
    setSelectedInventory(null);
    setTo("");
    setPurpose("");
    setTotalAmount("");
    setPaidAmount("");
    setDueAmount(0);
    setStatus("Paid");
  };

  const isFormValid = () => {
    if (!expenseType) return false;
    if (expenseType === "Inventory") return !!selectedInventory;
    return to.trim() && purpose.trim() && totalAmount && paidAmount;
  };

  const handleSubmit = async () => {
    if (!user) return alert("User not authenticated.");
    if (!isFormValid()) return alert("Please fill all required fields.");

    setSubmitting(true);

    const baseData = {
      type: "expense",
      category: expenseType,
      status,
      addedBy: user.email,
      role: user.role || "staff",
      recordedAt: serverTimestamp(),
    };

    let expenseData = {};

    if (expenseType === "Inventory" && selectedInventory) {
      expenseData = {
        "inventory-id": selectedInventory.id,
        "inventory-name": selectedInventory.name,
        "inventory-category": selectedInventory.category,
        "inventory-price": selectedInventory.price,
        "inventory-quantity": selectedInventory.quantity,
        "inventory-unitOfPrice": selectedInventory.unitOfPrice,
        "inventory-addedBy": selectedInventory.addedBy || "",
      };
    } else {
      expenseData = {
        to: to.trim(),
        purpose: purpose.trim(),
        totalAmount: Number(totalAmount),
        paidAmount: Number(paidAmount),
        dueAmount,
      };
    }

    try {
      await addDoc(collection(db, "transaction"), {
        ...baseData,
        ...expenseData,
      });
      alert("Save successfully!");
      resetForm();
      setExpenseType("");
    } catch (err) {
      console.error("Error saving", err);
      alert("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 relative">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <div className="flex flex-col items-center justify-center mt-12 space-y-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Record Expense</h2>

          <ExpenseTypeSelector selected={expenseType} onChange={(val) => { resetForm(); setExpenseType(val); }} />

          {expenseType === "Inventory" && (
            <InventoryExpenseForm
              inventoryList={inventoryList}
              selectedInventoryId={selectedInventoryId}
              setSelectedInventoryId={setSelectedInventoryId}
              selectedInventory={selectedInventory}
            />
          )}

          {(expenseType === "Wages" || expenseType === "Rent") && (
            <WagesRentForm
              type={expenseType}
              to={to}
              setTo={setTo}
              purpose={purpose}
              setPurpose={setPurpose}
              totalAmount={totalAmount}
              setTotalAmount={setTotalAmount}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              dueAmount={dueAmount}
            />
          )}

          {isFormValid() && (
            <StatusSelector selected={status} onChange={setStatus} />
          )}

          <SubmitButton
            disabled={submitting || !isFormValid()}
            loading={submitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Expenses;