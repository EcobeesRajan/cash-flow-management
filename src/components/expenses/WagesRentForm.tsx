import React from "react";
import InputField from "../field/InputField";

type WagesRentFormProps = {
  type: string;
  to: string;
  setTo: (value: string) => void;
  purpose: string;
  setPurpose: (value: string) => void;
  totalAmount: string;
  setTotalAmount: (value: string) => void;
  paidAmount: string;
  setPaidAmount: (value: string) => void;
  dueAmount: number;
  errors?: {
    to?: string;
    purpose?: string;
    totalAmount?: string;
    paidAmount?: string;
  };
};

const WagesRentForm: React.FC<WagesRentFormProps> = ({
  type,
  to,
  setTo,
  purpose,
  setPurpose,
  totalAmount,
  setTotalAmount,
  paidAmount,
  setPaidAmount,
  dueAmount,
  errors = {},
}) => (
  <>
    <InputField
      label={`${type} To`}
      value={to}
      onChange={(e) => setTo(e.target.value)}
      placeholder={`${type} given to`}
      error={errors.to}
    />

    <div className="mb-4">
      <label className="block font-medium mb-1">{`Purpose`}</label>
      <textarea
        rows={2}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        className={`w-full border px-3 py-2 rounded ${
          errors.purpose ? "border-red-600" : ""
        }`}
        placeholder={`${type} reason`}
      />
      {errors.purpose && (
        <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <InputField
        label="Total Amount (Rs.)"
        type="number"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        error={errors.totalAmount}
      />
      <InputField
        label="Paid Amount (Rs.)"
        type="number"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
        error={errors.paidAmount}
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

