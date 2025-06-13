const InputField = ({ label, type = "text", value, onChange, placeholder, min, step }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      step={step}
      className="w-full border px-3 py-2 rounded"
      required
    />
  </div>
);

export default InputField;

