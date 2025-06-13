import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import SubmitButton from "../components/buttons/SubmitButton";
import LogoutButton from "../components/buttons/LogoutButton";
import DashboardButton from "../components/buttons/DashboardButton";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      alert("Failed to logout.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.username || user?.email || "User"}!
        </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <DashboardButton label="Inventory" to="/inventory" />
            <DashboardButton label="Expenses" to="/expenses" />
            <DashboardButton label="Income" to="/income" />
            <DashboardButton label="Menu" to="/menu" />
            <DashboardButton label="Transactions" to="/transaction" />
          </div>
       <LogoutButton
          onClick={handleLogout} label="Logout" disabled={false} loading={false} fullWidth={false} type="button"
        />
      </div>
    </div>
  );
};

export default Dashboard;

