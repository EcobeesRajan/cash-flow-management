import { useNavigate } from "react-router-dom";

const BackButton = ({ to = "/dashboard", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`absolute top-4 left-4 text-blue-600 font-semibold hover:underline ${className}`}
    >
      Back
    </button>
  );
};

export default BackButton;
