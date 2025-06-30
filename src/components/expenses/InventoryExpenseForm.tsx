import React from "react";
import SelectField from "../field/SelectField";
import InventoryDetailsCard from "../inventory/InventoryDetailsCard";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  unitOfPrice: string;
  quantity: number;
  addedBy: string;
};

type InventoryExpenseFormProps = {
  inventoryList: InventoryItem[];
  selectedInventoryId: string;
  setSelectedInventoryId: (id: string) => void;
  selectedInventory: InventoryItem | null;
  error?: string;
};

const InventoryExpenseForm: React.FC<InventoryExpenseFormProps> = ({
  inventoryList,
  selectedInventoryId,
  setSelectedInventoryId,
  selectedInventory,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInventoryId(e.target.value);
  };

  return (
    <>
      <SelectField
        label="Select Inventory"
        value={selectedInventoryId}
        onChange={handleChange}
        options={inventoryList.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        error={error} 
      />
      <InventoryDetailsCard inventory={selectedInventory} />
    </>
  );
};

export default InventoryExpenseForm;

