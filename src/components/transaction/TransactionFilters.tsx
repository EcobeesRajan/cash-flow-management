import React from "react";

type TransactionFiltersProps = {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  showTypeFilter?: boolean;
  typeFilter?: string;
  setTypeFilter?: (value: string) => void;
};

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showTypeFilter = true,
  typeFilter = "all",
  setTypeFilter = () => {},
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex gap-2 justify-end md:flex-1 flex-wrap">
      {showTypeFilter && (
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="Income">Income</option>
          <option value="Rent">Rent</option>
          <option value="Wages">Wages</option>
          <option value="Inventory">Inventory</option>
        </select>
      )}

      <input
        type="date"
        max={today}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        max={today}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default TransactionFilters;
