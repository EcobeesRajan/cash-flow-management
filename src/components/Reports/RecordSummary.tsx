import { useState } from "react";
import SummaryGrid from "./SummaryGrid";
import ReportPDFDownload from "./ReportPDFDownload";
import {Transaction} from "@/app/types/transaction/index";

import toJSDate from "@/app/utils/date/jsDate";

type RecordProps = {
  transactions: Transaction[];
};

const getMonthName = (month: number) =>
  new Date(0, month).toLocaleString("default", { month: "long" });

const getMonthKey = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${year}-${month}`;
};

const Record = ({ transactions }: RecordProps) => {
  const grouped: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    const date = toJSDate(t.recordedAt);
    const key = getMonthKey(date);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

  const sortedMonthKeys = Object.keys(grouped).sort((a, b) => {
    const [yearA, monthA] = a.split("-").map(Number);
    const [yearB, monthB] = b.split("-").map(Number);
    return new Date(yearB, monthB).getTime() - new Date(yearA, monthA).getTime();
  });

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth()}`;

  const [openMonths, setOpenMonths] = useState<string[]>([prevMonthKey]);

  const filteredMonthKeys = sortedMonthKeys.filter((key) => key !== currentMonthKey);

  const toggleMonth = (key: string) => {
    setOpenMonths((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-4">
      {filteredMonthKeys.map((key) => {
        const [year, month] = key.split("-").map(Number);
        const monthName = `${getMonthName(month)} ${year}`;
        const monthTransactions = grouped[key];

        const income = monthTransactions.filter((t) => t.type === "income");
        const expense = monthTransactions.filter((t) => t.type === "expense");

        const summary = {
          totalIncome: income.reduce((sum, t) => sum + (t.Total_price || 0), 0),
          totalExpense: expense.reduce(
            (sum, t) => sum + (t.totalAmount ?? t["inventory-price"] ?? 0),
            0
          ),
          totalReceived: income.reduce(
            (sum, t) => sum + ((t.cash || 0) + (t.online || 0)),
            0
          ),
          totalProfit:
            income.reduce((sum, t) => sum + (t.Total_price || 0), 0) -
            expense.reduce(
              (sum, t) => sum + (t.totalAmount ?? t["inventory-price"] ?? 0),
              0
            ),
          soldqty: income.reduce((sum, t) => sum + (t.quantity || 0), 0),
          soldItems: new Set(income.map((t) => t.menuName)).size,
          paidCount: monthTransactions.filter((t) => t.status === "Paid").length,
          unpaidCount: monthTransactions.filter((t) => t.status === "Unpaid").length,
          totalInvoices: monthTransactions.length,
        };

        const isOpen = openMonths.includes(key);

        return (
          <div key={key} className="border-1 p-2 rounded-2xl shadow-sm">
            <button
              onClick={() => toggleMonth(key)}
              className="w-full text-left font-semibold text-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded"
            >
              {monthName} {isOpen ? "<-" : "->"}
            </button>

            {isOpen && (
              <div className="pt-4 px-2 space-y-4">
                {/* PDF Download*/}
                <ReportPDFDownload
                  transactions={monthTransactions}
                  summary={summary}
                  monthTitle={monthName}
                />

                <SummaryGrid
                  totalIncome={summary.totalIncome}
                  totalExpenses={summary.totalExpense}
                  totalReceived={summary.totalReceived}
                  totalProfit={summary.totalProfit}
                  totalInvoices={summary.totalInvoices}
                  soldItems={summary.soldItems}
                  soldqty={summary.soldqty}
                  paidCount={summary.paidCount}
                  unpaidCount={summary.unpaidCount}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Record;