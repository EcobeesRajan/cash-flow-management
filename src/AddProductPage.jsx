
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; 
import Cookies from 'js-cookie';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [piecesPerBox, setPiecesPerBox] = useState('');
  const [pricePerPiece, setPricePerPiece] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [quality, setQuality] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const adminName = Cookies.get('name') || 'Unknown';
  const adminRole = Cookies.get('role') || 'Unknown';

  useEffect(() => {
    const qty = parseFloat(quantity);
    const pieces = parseFloat(piecesPerBox);
    const price = parseFloat(pricePerPiece);

    if (!isNaN(qty) && !isNaN(pieces) && !isNaN(price)) {
      setTotalPrice(qty * pieces * price);
    } else {
      setTotalPrice(0);
    }
  }, [quantity, piecesPerBox, pricePerPiece]);

  const handleSave = async () => {
    if (!name.trim() || !quantity || !piecesPerBox || !pricePerPiece || !quality) {
      alert('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        name: name.trim(),
        quantity: parseFloat(quantity),
        piecesPerBox: parseFloat(piecesPerBox),
        pricePerPiece: parseFloat(pricePerPiece),
        totalPrice,
        quality,
        createdAt: serverTimestamp(),
        addedByName: adminName,
        addedByRole: adminRole,
      });

      setSuccess('Product added successfully!');
      setName('');
      setQuantity('');
      setPiecesPerBox('');
      setPricePerPiece('');
      setQuality('');
      setTotalPrice(0);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Add Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          placeholder="Number of Boxes"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          min={0}
        />

        <input
          type="number"
          placeholder="Pieces per Box"
          value={piecesPerBox}
          onChange={(e) => setPiecesPerBox(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          min={0}
        />

        <input
          type="number"
          placeholder="Price per Piece (Rs.)"
          value={pricePerPiece}
          onChange={(e) => setPricePerPiece(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          min={0}
        />

        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Quality</option>
          <option value="Package">Package</option>
          <option value="Piece">Piece</option>
        </select>

        <input
          type="text"
          value={`Total Rs. ${totalPrice.toFixed()}`}
          readOnly
          className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-gray-500 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>

        {success && <p className="text-green-600 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default AddProductPage;


