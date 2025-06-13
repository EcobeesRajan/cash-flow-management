import SelectField from "../field/SelectField";
import InputField from "../field/InputField";
import TextAreaField from "../field/TextAreaField";
import SubmitButton from "../buttons/SubmitButton";

const PAYMENT_TYPES = [
  { label: "Cash", value: "Cash" },
  { label: "Online", value: "Online" },
  { label: "Cash + Online", value: "Cash + Online" },
];

const IncomeForm = ({
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
}) => (
  <form className="space-y-4">
    <SelectField
      label="Select Menu Item"
      value={selectedItemId}
      onChange={(e) => setSelectedItemId(e.target.value)}
      options={menuItems.map((item) => ({
        label: `${item.name} - Rs.${item.price}`,
        value: item.id,
      }))}
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
        />
        <div className="mb-4 text-lg font-semibold">Total: Rs.{total}</div>
      </>
    )}

    <SelectField
      label="Payment Type"
      value={paymentType}
      onChange={(e) => setPaymentType(e.target.value)}
      options={PAYMENT_TYPES}
    />

    {paymentType === "Cash + Online" && (
      <div className="space-y-4 mb-4">
        <InputField
          label="Cash Amount"
          type="number"
          min={1}
          value={cashAmount}
          onChange={(e) => setCashAmount(e.target.value)}
          placeholder="Enter cash amount"
        />
        <InputField
          label="Online Amount"
          type="number"
          min={1}
          value={onlineAmount}
          onChange={(e) => setOnlineAmount(e.target.value)}
          placeholder="Enter online amount"
        />
      </div>
    )}

    <TextAreaField
      label="Note"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Enter note"
    />

    <SubmitButton
      loading={saving}
      disabled={saving}
      label="Save"
      onClick={handleSave}
      type="button"
    />
  </form>
);

export default IncomeForm;
