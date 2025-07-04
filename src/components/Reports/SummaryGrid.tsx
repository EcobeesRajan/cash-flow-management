import SummaryCard from "./SummaryCard";

type Props = {
  totalIncome: number;
  totalExpenses: number;
  totalReceived: number;
  totalProfit: number;
  totalInvoices: number;
  soldItems: number;
  soldqty: number;
  paidCount: number;
  unpaidCount: number;
};

const SummaryGrid = ({
  totalIncome,
  totalExpenses,
  totalReceived,
  totalProfit,
  totalInvoices,
  soldItems,
  soldqty,
  paidCount,
  unpaidCount,
}: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard title="Total Expenses" value={`Rs. ${totalExpenses}`} color="red" />
      <SummaryCard title="Total Received Amount" value={`Rs. ${totalReceived}`} color="blue" />
      <SummaryCard title="Total Revenue" value={`Rs. ${totalIncome}`} color="green" />
      <SummaryCard title="Net Profit" value={`Rs. ${totalProfit}`} color="orange" />

      <SummaryCard title="Total Invoices" value={totalInvoices} />
      <SummaryCard title="Sold Products" value={soldItems} />

      <SummaryCard title="Total Quantity Sold" value={soldqty} />
      <SummaryCard title="Paid" value={paidCount} />
      <SummaryCard title="Unpaid" value={unpaidCount} />
    </div>
  );
};

export default SummaryGrid;