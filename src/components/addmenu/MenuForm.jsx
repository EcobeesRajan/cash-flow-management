import InputField from "../field/InputField";
import RadioGroup from "../RadioGroup";
import SubmitButton from "../buttons/SubmitButton";

const CATEGORY_OPTIONS = ["Tea", "Snacks", "Drinks", "Others"];
const UNIT_OPTIONS = ["Pics", "Packet", "Cup"];

const MenuForm = ({
  name,
  setName,
  type,
  setType,
  price,
  setPrice,
  unit,
  setUnit,
  quantity,
  setQuantity,
  loading,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
      />

      <RadioGroup
        label="Category"
        options={CATEGORY_OPTIONS}
        selected={type}
        onChange={setType}
      />

      <InputField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
        min={0}
        step="any"
      />

      <RadioGroup
        label="Unit"
        options={UNIT_OPTIONS}
        selected={unit}
        onChange={setUnit}
      />

      <InputField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter quantity"
        min={0}
        step="any"
      />

      <SubmitButton loading={loading} disabled={loading} label="Save" type="submit" />
    </form>
  );
};

export default MenuForm;
