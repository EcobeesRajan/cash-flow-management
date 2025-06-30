import React, { ComponentProps } from "react";

type Option = { label: string; value: string } | string;

type SelectFieldProps = {
  label?: string;
  options: Option[];
  includePlaceholder?: boolean;
  placeholderText?: string;
  error?: string;
} & Omit<ComponentProps<"select">, "value" | "onChange"> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  includePlaceholder = true,
  placeholderText = "-- Select --",
  error,
  ...rest
}) => (
  <div className="mb-4">
    {label && <label className="block font-medium mb-1">{label}</label>}
    <select
      className={`w-full border px-3 py-2 rounded ${
        error ? "border-red-500" : "border-gray-300"
      }
      `}
      {...rest}
    >
      {includePlaceholder && <option value="">{placeholderText}</option>}
      {options.map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default SelectField;

