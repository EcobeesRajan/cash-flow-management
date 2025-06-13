import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useAuth } from "../../AuthContext.jsx";

const useAddMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in.");
      return;
    }

    if (!type || !unit) {
      alert("Please select both category and unit.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "menu"), {
        name: name.trim(),
        type,
        price: Number(price),
        unit,
        quantity: Number(quantity),
        recordedAt: serverTimestamp(),
        username: user.email || "",
        role: user.role || "staff",
      });

      navigate("/menu");
    } catch (error) {
      console.error("Error adding", error);
      alert("Failed to add menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    type,
    price,
    unit,
    quantity,
    loading,
    setName,
    setType,
    setPrice,
    setUnit,
    setQuantity,
    handleSubmit,
  };
};

export default useAddMenu;
