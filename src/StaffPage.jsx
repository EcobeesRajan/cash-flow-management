
import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import Cookies from 'js-cookie';

const StaffPage = () => {
  const [productName, setProductName] = useState('');
  const [boxes, setBoxes] = useState('');
  const [pricePerPiece, setPricePerPiece] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [catagories, setCatagories] = useState('');

  const staffName = Cookies.get('name') || 'Unknown';
  const staffRole = Cookies.get('role') || 'Unknown';

  useEffect(() => {
    const qtny = parseFloat(boxes);
    const price = parseFloat(pricePerPiece);

    if (!isNaN(qtny) && !isNaN(price)) {
      setTotalPrice(qtny * price);
    } else {
      setTotalPrice(0);
    }
  }, [boxes, pricePerPiece]);

  const handleSave = async () => {
    if (!productName.trim() || !pricePerPiece || !catagories) {
      alert('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'salesRecords'), {
        name: productName.trim(),
        quantity: parseFloat(boxes),
        totalPrice,
        catagories,
        createdAt: serverTimestamp(),
        addedByName: staffName,
        addedByRole: staffRole,
      });

      setSuccess('Entry recorded successfully!');
      setProductName('');
      setPricePerPiece('');

      setCatagories('');
      setTotalPrice(0);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center"></h2>

        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          placeholder="Number of sold items"
          value={boxes}
          onChange={(e) => setBoxes(e.target.value)}
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
          value={catagories}
          onChange={(e) => setCatagories(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">-Select-</option>
          <option value="Cup/Glass">Cup/Glass</option>
          <option value="PLate">Plate</option>
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
          className="w-full py-2 bg-gray-600 text-white rounded hover:bg-green-600"
        >
          {loading ? 'Submitting..' : 'Submit'}
        </button>

        {success && <p className="text-green-600 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default StaffPage;
