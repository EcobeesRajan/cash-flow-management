import React from "react";
import RadioGroup from "../RadioGroup";

export type Status = "Paid" | "Unpaid";

type StatusSelectorProps = {
  selected: Status;
  onChange: (value: Status) => void;
  error?: string;
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ selected, onChange, error }) => (
  <RadioGroup
    label="Status"
    options={["Paid", "Unpaid"]}
    selected={selected}
    onChange={(val) => onChange(val as Status)}
    error={error}
  />
);

export default StatusSelector;