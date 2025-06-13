import InputField from "../field/InputField";

const WagesRentForm = ({
  type, to, setTo, purpose, setPurpose,
  totalAmount, setTotalAmount,
  paidAmount, setPaidAmount,
  dueAmount
}) => (
  <>
    <InputField
      label={`${type} To`}
      value={to}
      onChange={(e) => setTo(e.target.value)}
      placeholder={`${type} given to`}
    />

    <div className="mb-4">
      <label className="block font-medium mb-1">Purpose</label>
      <textarea
        rows={2}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder={`${type} reason`}
      />
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <InputField
        label="Total Amount (Rs.)"
        type="number"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <InputField
        label="Paid Amount (Rs.)"
        type="number"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block font-medium mb-1">Due Amount (Rs.)</label>
      <input
        type="number"
        readOnly
        value={dueAmount}
        className={`w-full border px-3 py-2 rounded bg-gray-100 ${
          dueAmount < 0 ? "text-red-600 font-bold" : ""
        }`}
      />
      {dueAmount < 0 && (
        <p className="text-red-600 text-sm mt-1">
          Overpaid by Rs. {Math.abs(dueAmount).toFixed(2)}
        </p>
      )}
    </div>
  </>
);

export default WagesRentForm;
