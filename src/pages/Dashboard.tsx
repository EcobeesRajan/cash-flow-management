import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Logout from "../components/buttons/Buttons";
import DashboardButton from "../components/buttons/DashboardButton";

const Dashboard = () => {
  const navigate = useNavigate();

// Add typing for user and logout function if available
const { user, logout } = useAuth() as {
  user: {
    username?: string;
    email?: string;
  } | null;
  logout: () => Promise<void>;
};

  const handleLogout = async (): Promise<void> => {
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
          <DashboardButton label="Report" to="/report" />
        </div>

        <Logout
          onClick={handleLogout}
          label="Logout"
          disabled={false}
          loading={false}
          fullWidth={false}
          type="button"
        />
      </div>
    </div>
  );
};

export default Dashboard;
