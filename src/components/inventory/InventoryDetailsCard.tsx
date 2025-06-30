import React from "react";

type Inventory = {
  name: string;
  category: string;
  price: number;
  unitOfPrice: string;
  quantity: number;
  addedBy: string;
};

type InventoryDetailsCardProps = {
  inventory: Inventory | null;
};

const InventoryDetailsCard: React.FC<InventoryDetailsCardProps> = ({ inventory }) => {
  if (!inventory) return null;

  return (
    <div className="bg-gray-50 p-3 rounded border text-sm mt-4 space-y-1">
      <p><strong>Name:</strong> {inventory.name}</p>
      <p><strong>Category:</strong> {inventory.category}</p>
      <p><strong>Price:</strong> Rs. {inventory.price}</p>
      <p><strong>Unit:</strong> {inventory.unitOfPrice}</p>
      <p><strong>Quantity:</strong> {inventory.quantity}</p>
      <p><strong>Added By:</strong> {inventory.addedBy}</p>
    </div>
  );
};

export default InventoryDetailsCard;
