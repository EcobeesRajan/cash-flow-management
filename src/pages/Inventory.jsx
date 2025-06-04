import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
const Inventory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unitOfPrice, setUnitOfPrice] = useState("--select--");
  const [category, setCategory] = useState("--select--");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const unitOptions = ["--select--", "Pack", "Pieces", "Kg", "Litres"];
  const categoryOptions = ["--select--", "Food","Utensils","Drinks", "others"];
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);
  const isFormValid =
    name.trim() !== "" &&
    price !== "" &&
    quantity !== "" &&
    unitOfPrice !== "--select--" &&
    category !== "--select--";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please fill in all fields and select valid options.");
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
        addedBy: user?.username || "Unknown",
        role: user?.role || "staff",
        RecordedAt: serverTimestamp(),
      });
      alert("Inventory item saved successfully.");
      setName("");
      setPrice("0");
      setUnitOfPrice("--select--");
      setCategory("--select--");
      setQuantity("");
    } catch (error) {
      console.error("Error adding inventory:", error);
      alert("Failed to add item. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow relative">
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 left-4 text-blue-600 font-semibold hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Add Inventory Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Unit of Price</label>
            <select
              value={unitOfPrice}
              onChange={(e) => setUnitOfPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Category (Type)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter quantity"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-2 rounded text-white ${
              isFormValid && !loading
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Inventory;

