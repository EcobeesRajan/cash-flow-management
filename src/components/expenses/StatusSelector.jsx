import RadioGroup from "../RadioGroup";

const StatusSelector = ({ selected, onChange }) => (
  <RadioGroup
    label="Status"
    options={["Paid", "Unpaid"]}
    selected={selected}
    onChange={onChange}
  />
);

export default StatusSelector;
