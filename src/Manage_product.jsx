
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageProductPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Products</h1>

      <button
        onClick={() => navigate('/add-product')}
        className="px-6 py-3 bg-green-600 text-white rounded-md text-lg w-64"
      >
        Add Product
      </button>

      <button
        onClick={() => navigate('/edit-product')} 
        className="px-6 py-3 bg-yellow-500 text-white rounded-md text-lg w-64"
      >
        Edit1
      </button>

      <button
        onClick={() => navigate('/delete-product')}
        className="px-6 py-3 bg-red-600 text-white rounded-md text-lg w-64"
      >
        Delete2
      </button>

    </div>
  );
};

export default ManageProductPage;


