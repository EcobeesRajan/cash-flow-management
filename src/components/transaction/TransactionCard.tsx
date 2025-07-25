import React from "react";
import { TransactionRecord } from "@/app/types/transaction/record";

type TransactionCardProps = {
  transaction: TransactionRecord;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  expandedId,
  toggleExpand,
}) => {
  const isExpanded = expandedId === transaction.id;
  const displayDate =
    transaction.recordedAt?.toDate?.().toLocaleDateString() || "";

  return (
    <div
      className="bg-white p-4 rounded shadow border border-gray-300 cursor-pointer transition hover:shadow-lg"
      onClick={() => toggleExpand(transaction.id)}
    >
      <div className="flex justify-center items-center">
        <h4 className="font-bold text-lg capitalize px-5">
          {transaction.category || "Unknown"}
        </h4>
        <span className="text-sm text-gray-700 px-5">{displayDate}</span>
      </div>

      {isExpanded && (
        <div className="text-sm space-y-1 mt-3 text-gray-800">
          {Object.entries(transaction)
            .filter(([key]) => !["id", "recordedAt"].includes(key))
            .map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong>{" "}
                {typeof value === "number" ? `Rs.${value}` : String(value)}
              </p>
            ))}
          {transaction.recordedAt && (
            <p>
              <strong>Recorded At:</strong>{" "}
              {transaction.recordedAt.toDate().toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
