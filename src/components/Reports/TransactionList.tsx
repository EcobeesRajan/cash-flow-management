import { Transaction } from "../../types/Transaction";

type Props = {
  transactions: Transaction[];
};

const TransactionList = ({ transactions }: Props) => {
  if (!transactions.length) {
    return <p className="text-gray-500">No records found.</p>;
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="p-4 border rounded shadow-sm bg-gray-50">
          <div className="font-bold text-lg">{tx.menuName}</div>

          <div className="text-sm text-gray-700">
            Category: {tx.category}
          </div>

          <div className="text-sm text-gray-600">
            Quantity: {tx.quantity} × Rs.{tx.menuUnitPrice} = Rs.{tx.Total_price}
          </div>

          <div className="text-sm text-gray-500">
            Payment: <span className="font-medium">{tx.status}</span>
          </div>

          <div className="text-sm text-gray-500">
            Added By: {tx.added_by}
          </div>

          {tx.recordedAt && (
            <div className="text-sm text-gray-400">
              Date: {new Date(tx.recordedAt.seconds * 1000).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
