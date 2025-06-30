import React from "react";
import RadioGroup from "../RadioGroup";

type StatusSelectorProps = {
  selected: string;
  onChange: (value: string) => void;
  error?: string;
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ selected, onChange, error }) => (
  <RadioGroup
    label="Status"
    options={["Paid", "Unpaid"]}
    selected={selected}
    onChange={onChange}
    error={error}
  />
);

export default StatusSelector;







