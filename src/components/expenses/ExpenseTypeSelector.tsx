import React from "react";
import RadioGroup from "../RadioGroup";

type ExpenseTypeSelectorProps = {
  selected: string;
  onChange: (value: string) => void;
  error?: string; 
};

const ExpenseTypeSelector: React.FC<ExpenseTypeSelectorProps> = ({ selected, onChange, error }) => (
  <RadioGroup
    label="Expense Type"
    options={["Inventory", "Wages", "Rent"]}
    selected={selected}
    onChange={onChange}
    error={error} 
  />
);

export default ExpenseTypeSelector;

