const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <textarea
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded"
    />
  </div>
);

export default TextAreaField;
