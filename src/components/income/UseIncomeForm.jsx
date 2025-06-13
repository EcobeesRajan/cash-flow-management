import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../AuthContext.jsx";

const useIncomeForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentType, setPaymentType] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "menu"), orderBy("recordedAt", "desc"));
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
    if (!selectedItemId) return alert("Please select a menu item.");
    if (!selectedItem) return alert("Invalid menu item selected.");
    if (!quantity || quantity < 1) return alert("Please enter a valid quantity.");
    if (!paymentType) return alert("Please select a payment type.");
    if (!note.trim()) return alert("Please enter a note.");
    if (!user) return alert("User not logged in.");
    if (selectedItem.price === undefined || selectedItem.unit === undefined)
      return alert("Menu item is missing price or unit.");

    if (paymentType === "Cash + Online") {
      const cash = Number(cashAmount);
      const online = Number(onlineAmount);

      if (isNaN(cash) || isNaN(online) || cash <= 0 || online <= 0) {
        return alert("Please enter valid cash and online amounts.");
      }

      if (cash + online !== total) {
        return alert(`Rs.(${cash} + ${online}) = Rs.${total} ??`);
      }
    }

    try {
      setSaving(true);
      await addDoc(collection(db, "transaction"), {
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
        Logs: note.trim(),
        added_by: user.username || user.email || "Unknown",
        role: user.role || "staff",
        recordedAt: serverTimestamp(),
      });

      alert("Record saved successfully.");
      setSelectedItemId("");
      setQuantity(1);
      setPaymentType("");
      setCashAmount("");
      setOnlineAmount("");
      setNote("");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return {
    menuItems,
    selectedItemId,
    setSelectedItemId,
    selectedItem,
    quantity,
    setQuantity,
    paymentType,
    setPaymentType,
    cashAmount,
    setCashAmount,
    onlineAmount,
    setOnlineAmount,
    note,
    setNote,
    saving,
    handleSave,
    total,
  };
};

export default useIncomeForm;
