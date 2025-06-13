import { useNavigate } from "react-router-dom";
import BackButton from "../../components/buttons/BackButton.jsx";

const MenuHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 relative">
      <BackButton to="/dashboard" className="!static" />
      <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
        Menu
      </h2>
      <button
        onClick={() => navigate("/add-menu")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Menu
      </button>
    </div>
  );
};

export default MenuHeader;
