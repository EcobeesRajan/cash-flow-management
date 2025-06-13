import RadioGroup from "../RadioGroup";

const ExpenseTypeSelector = ({ selected, onChange }) => (
  <RadioGroup
    label="Expense Type"
    options={["Inventory", "Wages", "Rent"]}
    selected={selected}
    onChange={onChange}
  />
);

export default ExpenseTypeSelector;
