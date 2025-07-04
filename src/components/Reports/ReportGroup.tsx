import React from "react";
import { Transaction } from "../../types/Transaction";
import formatDate from "../../utils/FormatDate";

type Props = {
  transactions: Transaction[];
  viewType: "income" | "expense";
};

const ReportGroup: React.FC<Props> = ({ transactions, viewType }) => {
  return (
    <div className="overflow-x-auto shadow bg-white rounded-lg">
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Purpose</th>
            <th className="p-2 text-left">Total Amount</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Added By</th>
            <th className="p-2 text-left">Recorded At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const name =
              viewType === "income"
                ? t.menuName
                : t["inventory-name"] || t.to;

            const amount =
              viewType === "income"
                ? t.Total_price
                : t.totalAmount ?? t["inventory-price"] ?? 0;

            const purpose =
              viewType === "income"
                ? t.purpose || "-"
                : t.purpose || "-"

            const quantity =
              viewType === "income"
                ? t.quantity || t["inventory-quantity"] || "-"
                : t.quantity || t["inventory-quantity"] || "-";

            const status =
              viewType === "expense"
                ? t.status || "-"
                : t.status ?? "-"

            const addedBy = t.addedBy || t.added_by;

            return (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{name}</td>
                <td className="p-2">{t.category}</td>
                <td className="p-2">{quantity}</td>
                <td className="p-2">{purpose}</td>
                <td className="p-2">Rs. {amount}</td>
                <td className="p-2">{status}</td>
                <td className="p-2">{addedBy}</td>
                <td className="p-2">{formatDate(t.recordedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReportGroup;

