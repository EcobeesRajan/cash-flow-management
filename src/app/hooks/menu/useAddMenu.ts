import { useState } from "react";
import { AddMenuSchema, AddMenuForm, AddMenuErrors } from "@/app/zod/menu/addMenuSchema";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/_lib/firebase";
import { useAuth } from "@/(auth)/AuthContext";

const useAddMenu = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AddMenuForm>({
    name: "",
    category: "Tea",
    price: "",
    unit: "Pics",
    quantity: "",
  });

  const [errors, setErrors] = useState<AddMenuErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AddMenuForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = AddMenuSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const formattedErrors: AddMenuErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, val]) => [
          key,
          val?.[0] || "Required",
        ])
      );
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);
    try {
      const parsedData = result.data;

      await addDoc(collection(db, "menu"), {
        name: parsedData.name.trim(),
        category: parsedData.category,
        price: Number(parsedData.price),
        unit: parsedData.unit,
        quantity: Number(parsedData.quantity),
        recordedAt: serverTimestamp(),
        addedBy: user?.email || "Unknown",
      });

      setFormData({
        name: "",
        category: "Tea",
        price: "",
        unit: "Pics",
        quantity: "",
      });
    } catch (err) {
      console.error("Error adding menu item:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...formData,
    setName: (val: string) => handleChange("name", val),
    setCategory: (val: string) => handleChange("category", val),
    setPrice: (val: string) => handleChange("price", val),
    setUnit: (val: string) => handleChange("unit", val),
    setQuantity: (val: string) => handleChange("quantity", val),
    handleSubmit,
    loading,
    errors,
  };
};

export default useAddMenu;
