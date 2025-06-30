import React, { ComponentProps } from "react";

type InputFieldProps = {
  label: string;
  error?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-800">{label}</label>
      <input
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-md border transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;

















// import React from "react";

// type InputFieldProps = {
//   label: string;
//   name: string;
//   type?: string;
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   min?: number;
//   step?: number | string;
//   error?: string;
//   required?: boolean; 
// };

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   type = "text",
//   value,
//   name,
//   onChange,
//   placeholder,
//   min,
//   step,
//   error,
//   required = false, 
// }) => (
//   <div>
//     <label className="block font-medium mb-1">{label}</label>
//     <input
//       name={name}
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       min={min}
//       step={step}
//       required={required} 
//       className={`w-full border px-3 py-2 rounded ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//     />
//     {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
//   </div>
// );

// export default InputField;
