import React from "react";
import SelectField from "../field/SelectField";
import InputField from "../field/InputField";
import TextAreaField from "../field/TextAreaField";
import Submit from "../buttons/Buttons";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
};

type IncomeFormProps = {
  menuItems: MenuItem[];
  selectedItemId: string;
  setSelectedItemId: (value: string) => void;
  selectedItem?: MenuItem;
  quantity: number;
  setQuantity: (value: number) => void;
  paymentType: string;
  setPaymentType: (value: string) => void;
  cashAmount: string;
  setCashAmount: (value: string) => void;
  onlineAmount: string;
  setOnlineAmount: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  saving: boolean;
  handleSave: () => void;
  total: number;
  errors?: Record<string, string>;
} & React.FormHTMLAttributes<HTMLFormElement>;

const PAYMENT_OPTIONS = [
  { label: "Cash", value: "Cash" },
  { label: "Online", value: "Online" },
  { label: "Cash + Online", value: "Cash + Online" },
];

const IncomeForm: React.FC<IncomeFormProps> = ({
  menuItems,
  selectedItemId,
  setSelectedItemId,
  selectedItem,
  quantity,
  setQuantity,
  paymentType,
  setPaymentType,
  cashAmount,
  setCashAmount,
  onlineAmount,
  setOnlineAmount,
  note,
  setNote,
  saving,
  handleSave,
  total,
  errors = {},
  ...rest
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
      className="space-y-5"
      {...rest}
    >
      <SelectField
        label="Select Menu Item"
        value={selectedItemId}
        onChange={(e) => setSelectedItemId(e.target.value)}
        options={menuItems.map((item) => ({
          label: `${item.name} - Rs.${item.price}`,
          value: item.id,
        }))}
        error={errors.selectedItemId}
      />

      {selectedItem && (
        <>
          <InputField
            label={`Quantity (${selectedItem.unit})`}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Enter quantity"
            error={errors.quantity}
          />
          <div className="text-lg font-semibold">Total: Rs.{total}</div>
        </>
      )}

      <SelectField
        label="Payment Type"
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
        options={PAYMENT_OPTIONS}
        error={errors.paymentType}
      />

      {(paymentType === "Cash" || paymentType === "Cash + Online") && (
        <InputField
          label="Cash Amount"
          type="number"
          min={1}
          value={cashAmount}
          onChange={(e) => setCashAmount(e.target.value)}
          placeholder="Enter cash amount"
          error={errors.cashAmount}
        />
      )}

      {(paymentType === "Online" || paymentType === "Cash + Online") && (
        <InputField
          label="Online Amount"
          type="number"
          min={1}
          value={onlineAmount}
          onChange={(e) => setOnlineAmount(e.target.value)}
          placeholder="Enter online amount"
          error={errors.onlineAmount}
        />
      )}

      <TextAreaField
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter optional note"
        error={errors.note}
      />

      <Submit loading={saving} disabled={saving} label="Save" type="submit" />
    </form>
  );
};

export default IncomeForm;