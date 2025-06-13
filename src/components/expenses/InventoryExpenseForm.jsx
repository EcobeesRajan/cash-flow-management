import SelectField from "../field/SelectField";
import InventoryDetailsCard from "../inventory/InventoryDetailsCard";

const InventoryExpenseForm = ({
  inventoryList,
  selectedInventoryId,
  setSelectedInventoryId,
  selectedInventory
}) => (
  <>
    <SelectField
      label="Select Inventory"
      value={selectedInventoryId}
      onChange={(e) => setSelectedInventoryId(e.target.value)}
      options={inventoryList.map(item => ({ value: item.id, label: item.name }))}
    />
    <InventoryDetailsCard inventory={selectedInventory} />
  </>
);

export default InventoryExpenseForm;
