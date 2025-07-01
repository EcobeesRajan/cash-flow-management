import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import BackButton from "../components/buttons/BackButton";
import ReportToggle from "../components/Reports/ToggleButtons";
import ReportGroup from "../components/Reports/ReportGroup";
import Pagination from "../components/field/Pagination";
import { Transaction } from "../types/Transaction";

const Reports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"income" | "expense">("income");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(collection(db, "transaction"), orderBy("recordedAt", "desc"));
        const snapshot = await getDocs(q);
        const data: Transaction[] = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            type: docData.type,
            category: docData.category,
            recordedAt: docData.recordedAt,
            Total_price: docData.Total_price,
            totalAmount: docData.totalAmount,
            ...docData,
          };
        });
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter by income or expense
  const filtered = transactions.filter((t) => t.type === viewType);

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total amount calculation
  const total = filtered.reduce((sum, t) => {
    if (viewType === "income") {
      return sum + (t.Total_price || 0);
    } else {
      return sum + (t.totalAmount ?? t["inventory-price"] ?? 0);
    }
  }, 0);

  // Reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [viewType]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 relative">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <div className="flex flex-col items-center mt-12 space-y-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Reports</h2>

          <ReportToggle viewType={viewType} setViewType={setViewType} />

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <>
              <div className="text-center text-lg font-semibold mb-4">
                {viewType === "income" ? (
                  <span>
                    Total Income: <span className="text-green-600">Rs.{total}</span>
                  </span>
                ) : (
                  <span>
                    Total Expenses: <span className="text-red-600">Rs.{total}</span>
                  </span>
                )}
              </div>

              <ReportGroup transactions={paginatedItems} viewType={viewType} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  if (page >= 1 && page <= totalPages) setCurrentPage(page);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
