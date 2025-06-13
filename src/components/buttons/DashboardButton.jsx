import { useNavigate } from "react-router-dom";

const DashboardButton = ({ label, to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="py-3 px-5 bg-blue-400 text-white rounded font-semibold hover:bg-green-700 transition"
    >
      {label}
    </button>
  );
};

export default DashboardButton;
