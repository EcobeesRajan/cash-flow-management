import React, { ComponentProps } from "react";

type TextAreaFieldProps = {
  label: string;
  error?: string;  
} & ComponentProps<"textarea">;

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  value,
  ...rest
}) => (
  <div className="mb-4 flex flex-col">
    <label className="block font-medium mb-1 text-gray-800">{label}</label>
    <textarea
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      value={value}
      {...rest}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default TextAreaField;






