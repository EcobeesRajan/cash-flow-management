const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  required = true,
  includePlaceholder = true,
  placeholderText = "-- Select --",
  error = "", // new prop
}) => {
  return (
    <div className="mb-4">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        required={required}
      >
        {includePlaceholder && <option value="">{placeholderText}</option>}
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
