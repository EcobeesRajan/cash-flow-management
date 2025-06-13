import { useState } from "react";
import BackButton from "../components/buttons/BackButton";
import { useTransaction } from "../components/transaction/useTransaction";
import { groupByDate } from "../components/transaction/GroupByDate";
import TransactionCard from "../components/transaction/TransactionCard";
import TransactionFilters from "../components/transaction/TransactionFilters";

const Transaction = () => {
  const { transactions, loading } = useTransaction();

  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const isWithinDateRange = (date) => {
    if (!date?.toDate) return false;
    const d = date.toDate();
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate)) return false;
    return true;
  };

  const filtered = transactions.filter((t) => {
    const category = (t.category || t.type || "").toLowerCase();
    return (
      (typeFilter === "all" || category === typeFilter.toLowerCase()) &&
      isWithinDateRange(t.recordedAt)
    );
  });

  const grouped = groupByDate(filtered);
  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex justify-start md:flex-1">
          <BackButton to="/dashboard" />
        </div>

        <h2 className="text-2xl font-bold text-center md:flex-1">
          Transaction Records
        </h2>

        <TransactionFilters
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      {(startDate || endDate || typeFilter !== "all") && (
        <div className="text-center text-sm text-gray-600 mb-4">
          Showing <strong>{typeFilter !== "all" ? typeFilter : "all types"}</strong>{" "}
          from <strong>{startDate || "beginning"}</strong> to{" "}
          <strong>{endDate || "today"}</strong>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="animate-pulse bg-white p-4 rounded shadow">
              <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-500 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([dateLabel, records]) => (
            <div key={dateLabel}>
              <h3 className="text-lg font-semibold mb-2">{dateLabel}</h3>
              <div className="space-y-4">
                {records.map((t) => (
                  <TransactionCard
                    key={t.id}
                    transaction={t}
                    expandedId={expandedId}
                    toggleExpand={toggleExpand}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transaction;
