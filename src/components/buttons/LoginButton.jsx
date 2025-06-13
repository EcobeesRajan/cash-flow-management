const LoginButton = ({
  onClick = null,
  disabled = false,
  loading = false,
  label = "Login",
  type = "submit",
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
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-green-600 hover:bg-gray-600"
      }`}
    >
      {loading ? "Logging in..." : label}
    </button>
  );
};

export default LoginButton;
