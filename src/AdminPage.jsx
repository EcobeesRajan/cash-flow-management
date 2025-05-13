import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => navigate('/manage-product')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg"
      >
        Manage Product
      </button>
    </div>
  );
};

export default AdminPage;
