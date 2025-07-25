import React from "react";
import InputField from "../field/InputField";
import RadioGroup from "../RadioGroup";
import Submit from "../buttons/Buttons";
import type { AddMenuErrors } from "@/app/zod/menu/addMenuSchema";

type MenuFormProps = {
  name: string;
  setName: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors?: AddMenuErrors;
};

const CATEGORY_OPTIONS = ["Tea", "Snacks", "Drinks", "Others"];
const UNIT_OPTIONS = ["Pics", "Packet", "Cup"];

const MenuForm: React.FC<MenuFormProps> = ({
  name, setName,
  category, setCategory,
  price, setPrice,
  unit, setUnit,
  quantity, setQuantity,
  loading, handleSubmit,
  errors,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
        error={errors?.name}
      />

      <RadioGroup
        label="Category"
        options={CATEGORY_OPTIONS}
        selected={category}
        onChange={setCategory}
        error={errors?.category}
      />

      <InputField
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
        min={1}
        error={errors?.price}
      />

      <RadioGroup
        label="Unit"
        options={UNIT_OPTIONS}
        selected={unit}
        onChange={setUnit}
        error={errors?.unit}
      />

      <InputField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter quantity"
        min={1}
        error={errors?.quantity}
      />

      <Submit loading={loading} disabled={loading} label="Save" type="submit" />
    </form>
  );
};

export default MenuForm;

