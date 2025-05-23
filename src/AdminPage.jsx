
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminPage = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const name = Cookies.get('name') || 'Admin';

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
          >
            
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="flex flex-col items-center space-y-6">
         <p> Welcome !! {name}. <br/> 
            You are in Dashboard.
        </p>
        <button
          onClick={() => navigate('/manage-product')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg w-64"
        >
          Manage Product
        </button>

        <button
          onClick={() => navigate('/view-products')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg w-64"
        >
          View Product Details
        </button>
      </div>
    </div>
  );
};

export default AdminPage;


