import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear session or auth data
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold border-b">Staff Panel</div>
          <nav className="p-4 space-y-4">
            <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 transition">Menu</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 transition">Data Recording</button>
            <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 transition">Table</button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">Profile</p>
              <p className="text-xs text-gray-500">Login</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
              S
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
            <p>This is your staff dashboard. Use the navigation to input data or view your table.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
