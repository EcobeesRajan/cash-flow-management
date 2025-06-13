const RadioGroup = ({ label, options, selected, onChange }) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">{label}</label>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

export default RadioGroup;
