import React from "react";
import { Transaction } from "../../types/Transaction";

type Props = {
  transactions: Transaction[];
  viewType: "income" | "expense";
};

const formatDate = (timestamp?: { seconds: number }) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-GB");
};

const groupByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: Record<string, Transaction[]>, t) => {
    const date = formatDate(t.recordedAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});
};

const ReportGroup: React.FC<Props> = ({ transactions, viewType }) => {
  const grouped = groupByDate(transactions);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, entries]) => (
        <div key={date}>
          <h3 className="text-lg font-bold mb-2 border-b">{date}</h3>
          <table className="min-w-full table-auto border border-gray-300 mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((t) => {
                const amount =
                  viewType === "income"
                    ? t.Total_price
                    : t.totalAmount ?? t["inventory-price"] ?? 0;

                return (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.category}</td>
                    <td className="px-4 py-2">Rs.{amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ReportGroup;
