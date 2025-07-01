import React from "react";

type RadioGroupProps = {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
  disabled?: boolean;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  error,
  name,
  disabled = false,
}) => {
  // If no name provided, generate a unique one to link radio buttons
  const groupName = name || `radio-group-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mb-4 flex flex-col">
      <label className="mb-1 font-medium text-gray-800">{label}</label>
      <div className="flex gap-4 flex-wrap">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-1 cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <input
              type="radio"
              name={groupName}
              value={opt}
              checked={selected === opt}
              onChange={() => onChange(opt)}
              disabled={disabled}
              className={`form-radio accent-blue-600 ${error ? "border-red-500" : ""
                }`}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {error && <span className="mt-1 text-sm text-red-600">{error}</span>}
    </div>
  );
};

export default RadioGroup;

