'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/_lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/(auth)/AuthContext";

import BackButton from "@/components/buttons/BackButton";
import InputField from "@/components/field/InputField";
import SelectField from "@/components/field/SelectField";
import Submit from "@/components/buttons/Buttons";

import {
  InventorySchema,
  type InventoryForm,
  type InventoryErrors,
} from "@/app/zod/inventory/inventorySchema";
import { ZodIssue } from "zod";

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuth() as {
    user: { username?: string; email?: string; role?: string } | null;
  };

  useEffect(() => {
    if (!user) {
      router.replace("/"); // redirect if not authenticated
    }
  }, [user, router]);

  const [formData, setFormData] = useState<InventoryForm>({
    name: "",
    price: "",
    unitOfPrice: "" as InventoryForm["unitOfPrice"],
    category: "" as InventoryForm["category"],
    quantity: "",
  });

  const [errors, setErrors] = useState<InventoryErrors>({});
  const [loading, setLoading] = useState(false);

  const unitOptions = ["Pack", "Pieces", "Kg", "Litres"];
  const categoryOptions = ["Food", "Utensils", "Drinks", "Others"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name as keyof InventoryForm]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = InventorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: InventoryErrors = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as keyof InventoryForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "inventory"), {
        ...formData,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        addedBy: user?.username || user?.email,
        role: user?.role || "staff",
        recordedAt: serverTimestamp(),
      });

      setFormData({
        name: "",
        price: "",
        unitOfPrice: "" as InventoryForm["unitOfPrice"],
        category: "" as InventoryForm["category"],
        quantity: "",
      });

      setErrors({});
      alert("Saved successfully.");
    } catch (error) {
      console.error("Error adding:", error);
      alert("Failed to add. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // If user is not loaded yet (undefined/null), don't show form yet
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow relative">
        <BackButton />
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">Add Inventory Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Item Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            error={errors.name}
          />

          <InputField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            min={1}
            step={1}
            error={errors.price}
          />

          <SelectField
            label="Unit of Price"
            name="unitOfPrice"
            value={formData.unitOfPrice}
            onChange={handleChange}
            options={unitOptions}
            error={errors.unitOfPrice}
          />

          <SelectField
            label="Category (Type)"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={errors.category}
          />

          <InputField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            min={1}
            step={1}
            error={errors.quantity}
          />

          <Submit loading={loading} disabled={loading} />
        </form>
      </div>
    </div>
  );
}
