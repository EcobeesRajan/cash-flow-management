import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '/home/rajan/Desktop/Cash FLow Management/cash-flow-management/src/firebase.js';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!name || !costPrice || !sellingPrice) {
      alert('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        createdAt: serverTimestamp()
      });

      setSuccess('Product added successfully!');
      setName('');
      setCostPrice('');
      setSellingPrice('');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Add New Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Cost Price"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>

        {success && <p className="text-green-600 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;
