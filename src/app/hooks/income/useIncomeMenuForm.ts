import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/_lib/firebase";
import { useAuth } from "@/(auth)/AuthContext";
import { IncomeSchema } from "@/app/zod/income/incomeSchema";
import { MenuItem } from "../income/incomeFormProps";

const useIncomeForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentType, setPaymentType] = useState<string>("");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [onlineAmount, setOnlineAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedItem = menuItems.find((item) => item.id === selectedItemId);
  const total = selectedItem ? selectedItem.price * quantity : 0;

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "menu"), orderBy("recordedAt", "desc"));
        const snapshot = await getDocs(q);
        const items: MenuItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<MenuItem, "id">),
        }));
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  const validate = () => {
    const parsed = IncomeSchema.safeParse({
      selectedItemId,
      quantity,
      paymentType,
      cashAmount,
      onlineAmount,
      note,
    });

    const fieldErrors: Record<string, string> = {};

    if (!parsed.success) {
      parsed.error.issues.forEach(({ path, message }) => {
        if (path.length > 0) fieldErrors[path[0] as string] = message;
      });
    }

    const cash = parseFloat(cashAmount || "0");
    const online = parseFloat(onlineAmount || "0");

    if (paymentType === "Cash") {
      if (isNaN(cash) || cash <= 0) {
        fieldErrors.cashAmount = "Enter a valid cash amount.";
      } else if (cash !== total) {
        fieldErrors.cashAmount = `Cash amount must equal Rs.${total}`;
      }
    } else if (paymentType === "Online") {
      if (isNaN(online) || online <= 0) {
        fieldErrors.onlineAmount = "Enter a valid online amount.";
      } else if (online !== total) {
        fieldErrors.onlineAmount = `Online amount must equal Rs.${total}`;
      }
    } else if (paymentType === "Cash + Online") {
      if (isNaN(cash) || cash <= 0) {
        fieldErrors.cashAmount = "Enter a valid cash amount.";
      }
      if (isNaN(online) || online <= 0) {
        fieldErrors.onlineAmount = "Enter a valid online amount.";
      }
      if (cash + online !== total) {
        fieldErrors.cashAmount = `Cash + Online must equal Rs.${total}`;
        fieldErrors.onlineAmount = `Cash + Online must equal Rs.${total}`;
      }
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (
      !selectedItem ||
      selectedItem.price === undefined ||
      selectedItem.unit === undefined
    ) {
      alert("Menu item is missing price or unit.");
      return;
    }

    if (!user) {
      alert("User not logged in.");
      return;
    }

    const cash = parseFloat(cashAmount || "0");
    const online = parseFloat(onlineAmount || "0");

    const baseData = {
      category: "Income",
      type: "income",
      menuId: selectedItem.id,
      menuName: selectedItem.name,
      menuUnitPrice: selectedItem.unit,
      menu_price: selectedItem.price,
      quantity,
      Total_price: total,
      status: paymentType,
      Logs: note.trim(),
      added_by: user.username || user.email || "Unknown",
      role: user.role || "staff",
      recordedAt: serverTimestamp(),
    };

    const paymentData =
      paymentType === "Cash"
        ? { cash: total }
        : paymentType === "Online"
        ? { online: total }
        : { cash, online };

    try {
      setSaving(true);
      await addDoc(collection(db, "transaction"), {
        ...baseData,
        ...paymentData,
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
    errors,
  };
};

export default useIncomeForm;
