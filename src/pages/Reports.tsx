import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import BackButton from "../components/buttons/BackButton";
import ReportGroup from "../components/Reports/ReportGroup";
import SummaryGrid from "../components/Reports/SummaryGrid";
import SalesPieChart from "../components/Reports/SalesPieChart";
import ViewToggle from "../components/Reports/ViewToggle";
import Pagination from "../components/field/Pagination";
import { Transaction } from "../types/Transaction";
import toJSDate from "../utils/JSDate";
import RecordSummary from "../components/Reports/RecordSummary";
import TransactionFilters from "../components/transaction/TransactionFilters";
import ReportPDFDownload from "../components/Reports/ReportPDFDownload";

const ITEMS_PER_PAGE = 10;

const Reports = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [viewMode, setViewMode] = useState<"summary" | "income" | "expense" | "Records">("summary");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Date filters (used by TransactionFilters)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "transaction"), orderBy("recordedAt", "desc"));
        const snapshot = await getDocs(q);
        const data: Transaction[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[];
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const isSameMonth = (date: Date, month: number, year: number) =>
    date.getMonth() === month && date.getFullYear() === year;

  const monthlyTransactions = transactions.filter((t) => {
    const recorded = toJSDate(t.recordedAt);
    return isSameMonth(recorded, currentMonth, currentYear);
  });

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthTransactions = transactions.filter((t) => {
    const recorded = toJSDate(t.recordedAt);
    return isSameMonth(recorded, previousMonth, previousYear);
  });

  const summarize = (list: Transaction[]) => {
    const income = list.filter((t) => t.type === "income");
    const expense = list.filter((t) => t.type === "expense");
    return {
      totalIncome: income.reduce((sum, t) => sum + (t.Total_price || 0), 0),
      totalExpense: expense.reduce((sum, t) => sum + (t.totalAmount ?? t["inventory-price"] ?? 0), 0),
      totalReceived: income.reduce((sum, t) => sum + ((t.cash || 0) + (t.online || 0)), 0),
      totalProfit:
        income.reduce((sum, t) => sum + (t.Total_price || 0), 0) -
        expense.reduce((sum, t) => sum + (t.totalAmount ?? t["inventory-price"] ?? 0), 0),
      soldqty: income.reduce((sum, t) => sum + (t.quantity || 0), 0),
      soldItems: new Set(income.map((t) => t.menuName)).size,
      paidCount: list.filter((t) => t.status === "Paid").length,
      unpaidCount: list.filter((t) => t.status === "Unpaid").length,
      totalInvoices: list.length,
    };
  };

  const current = summarize(monthlyTransactions);
  const previous = summarize(previousMonthTransactions);

  // Filtered transactions for income/expense based on date
  const filtered =
    viewMode === "income" || viewMode === "expense"
      ? transactions
        .filter((t) => t.type === viewMode)
        .filter((t) => {
          const date = toJSDate(t.recordedAt);
          if (startDate && date < new Date(startDate)) return false;
          if (endDate && date > new Date(endDate)) return false;
          return true;
        })
      : [];

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 mt-12">
        <h1 className="text-3xl font-bold text-center mb-4">Reports</h1>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "summary" && (
          <>
            {/* Download Button */}
            <ReportPDFDownload
              transactions={monthlyTransactions}
              summary={current}
              monthTitle={`${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`}
            />

            <SummaryGrid
              totalIncome={current.totalIncome}
              totalExpenses={current.totalExpense}
              totalReceived={current.totalReceived}
              totalProfit={current.totalProfit}
              totalInvoices={current.totalInvoices}
              soldItems={current.soldItems}
              soldqty={current.soldqty}
              paidCount={current.paidCount}
              unpaidCount={current.unpaidCount}
            />
            <SalesPieChart income={current.totalIncome} expenses={current.totalExpense} />
          </>
        )}

        {viewMode === "Records" && <RecordSummary transactions={transactions} />}

        {(viewMode === "income" || viewMode === "expense") && (
          <div className="w-full space-y-4">
            <TransactionFilters
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              showTypeFilter={false}
            />

            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                <ReportGroup transactions={paginatedTransactions} viewType={viewMode} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
