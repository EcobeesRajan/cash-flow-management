'use client';

import { useState, useEffect } from "react";
import BackButton from "@/components/buttons/BackButton";
import { useTransaction } from "@/app/hooks/transaction/useTransaction";
import { groupByDate } from "@/components/transaction/GroupByDate";
import TransactionCard from "@/components/transaction/TransactionCard";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import Pagination from "@/components/field/Pagination";
import { TransactionRecord } from "@/app/types/transaction/record";

const Transaction = () => {
  const { transactions, loading } = useTransaction();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check the date range for filtering
  const isWithinDateRange = (timestamp?: TransactionRecord["recordedAt"]): boolean => {
    if (!timestamp?.toDate) return false;
    const date = timestamp.toDate();
    if (startDate && date < new Date(startDate)) return false;
    if (endDate && date > new Date(endDate)) return false;
    return true;
  };

  // Helper to convert value to lowercase string
  const toLowerString = (val: unknown): string =>
    typeof val === "string" ? val.toLowerCase() : "";

  // Filter transactions by type and date
  const filtered: TransactionRecord[] = transactions.filter((t) => {
    const category = toLowerString(t.category);
    const type = toLowerString(t.type);
    const filterLower = typeFilter.toLowerCase();
    const matchesType =
      filterLower === "all" || category === filterLower || type === filterLower;
    return matchesType && isWithinDateRange(t.recordedAt);
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Group paginated items by date label
  const grouped = groupByDate<TransactionRecord>(paginatedItems);

  // Toggle expand/collapse of a transaction card
  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // Reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, startDate, endDate]);

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
          Showing <strong>{typeFilter !== "all" ? typeFilter : "all types"}</strong> from{" "}
          <strong>{startDate || "beginning"}</strong> to{" "}
          <strong>{endDate || "today"}</strong>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white p-4 rounded shadow"
            >
              <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-500 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <>
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Transaction;
