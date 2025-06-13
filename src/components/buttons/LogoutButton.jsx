const LogoutButton = ({
  onClick = null,
  disabled = false,
  loading = false,
  label = "Logout",
  type = "button",
  fullWidth = true,
}) => {
  return (
    <button
      type={type}
      onClick={onClick || undefined}
      disabled={disabled}
      className={`${
        fullWidth ? "w-full" : ""
      } py-2 px-4 rounded text-white font-semibold transition duration-200 ${
        disabled
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-gray-700"
      }`}
    >
      {loading ? "Logging out..." : label}
    </button>
  );
};

export default LogoutButton;
