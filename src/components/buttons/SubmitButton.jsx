const SubmitButton = ({
  onClick = null,
  disabled = false,
  loading = false,
  label = "Save",
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
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading ? "Saving..." : label}
    </button>
  );
};

export default SubmitButton;
