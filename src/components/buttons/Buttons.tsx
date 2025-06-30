import React, { ComponentProps } from "react";

type Variant = "login" | "logout" | "submit";

type ButtonProps = {
  label?: string;
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
} & ComponentProps<"button">;

const Button: React.FC<ButtonProps> = ({
  label,
  loading = false,
  variant = "submit",
  fullWidth = true,
  disabled = false,
  ...rest }) => {
  const baseStyles = "py-2 px-4 rounded text-white font-semibold transition duration-200";
  const widthStyle = fullWidth ? "w-full" : "";

  const variantStyles = {
    login: {
      defaultLabel: "Login",
      loadingLabel: "Logging in...",
      enabledClass: "bg-green-600 hover:bg-gray-600",
      disabledClass: "bg-gray-700 cursor-not-allowed",
    },
    logout: {
      defaultLabel: "Logout",
      loadingLabel: "Logging out...",
      enabledClass: "bg-red-500 hover:bg-red-700",
      disabledClass: "bg-red-400 cursor-not-allowed",
    },
    submit: {
      defaultLabel: "Save",
      loadingLabel: "Submitting...",
      enabledClass: "bg-blue-600 hover:bg-blue-700",
      disabledClass: "bg-gray-400 cursor-not-allowed",
    },
  };

  const current = variantStyles[variant];
  const buttonClass = disabled ? current.disabledClass : current.enabledClass;

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${widthStyle} ${buttonClass}`}
      {...rest}
    >
      {loading ? current.loadingLabel : label || current.defaultLabel}
    </button>
  );
};

export default Button;

