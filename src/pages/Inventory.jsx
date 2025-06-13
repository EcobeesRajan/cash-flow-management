import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

import BackButton from "../components/buttons/BackButton";
import InputField from "../components/field/InputField";
import SelectField from "../components/field/SelectField";
import SubmitButton from "../components/buttons/SubmitButton";

const Inventory = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unitOfPrice, setUnitOfPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const unitOptions = ["Pack", "Pieces", "Kg", "Litres"];
  const categoryOptions = ["Food", "Utensils", "Drinks", "Others"];

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isFormValid =
    name.trim() !== "" &&
    price !== "" &&
    !isNaN(parseFloat(price)) &&
    quantity !== "" &&
    !isNaN(parseInt(quantity, 10)) &&
    unitOfPrice !== "" &&
    category !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "inventory"), {
        name: name.trim(),
        price: parseFloat(price),
        unitOfPrice,
        category,
        quantity: parseInt(quantity, 10),
        addedBy: user.email,
        role: "staff",
        recordedAt: serverTimestamp(),
      });

      alert("Saved successfully.");
      setName("");
      setPrice("");
      setUnitOfPrice("");
      setCategory("");
      setQuantity("");
    } catch (error) {
      console.error("Error adding:", error);
      alert("Failed to add. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow relative">
        <BackButton />

        <h2 className="text-2xl font-bold text-center mb-6">Add Inventory Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            autoComplete="off"
          />

          <InputField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            min="1"
            step="0.01"
          />

          <SelectField
            label="Unit of Price"
            value={unitOfPrice}
            onChange={(e) => setUnitOfPrice(e.target.value)}
            options={unitOptions}
          />

          <SelectField
            label="Category (Type)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />

          <InputField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            step="1"
          />

          <SubmitButton disabled={!isFormValid || loading} loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default Inventory;
