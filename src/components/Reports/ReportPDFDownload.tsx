import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {Transaction} from "@/app/types/transaction/index";
import SalesPieChart from "./SalesPieChart";

type Props = {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    totalReceived: number;
    totalProfit: number;
    soldqty: number;
    soldItems: number;
    paidCount: number;
    unpaidCount: number;
    totalInvoices: number;
  };
  monthTitle: string;
};

const ReportPDFDownload: React.FC<Props> = ({ transactions, summary, monthTitle }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const getDateString = (recordedAt?: { seconds: number; nanoseconds: number }) =>
    recordedAt ? new Date(recordedAt.seconds * 1000).toLocaleDateString() : "Unknown";

  const generatePDF = async () => {
    if (!chartRef.current) return;

    const pdf = new jsPDF("p", "pt", "a4");
    const margin = 40;
    const baseLineHeight = 22;
    const maxY = 780;
    let y = margin;

    pdf.setFontSize(18);
    pdf.text(`${monthTitle} Report Summary`, margin, y);
    y += 36;

    pdf.setFontSize(12);
    const lines = [
      `Total Income: Rs. ${summary.totalIncome.toFixed(0)}`,
      `Total Expense: Rs. ${summary.totalExpense.toFixed(0)}`,
      `Profit: Rs. ${summary.totalProfit.toFixed(0)}`,
      `Sold Qty: ${summary.soldqty}`,
      `Sold Items: ${summary.soldItems}`,
      `Paid Invoices: ${summary.paidCount}`,
      `Unpaid Invoices: ${summary.unpaidCount}`,
      `Total Invoices: ${summary.totalInvoices}`,
    ];

    lines.forEach((line) => {
      pdf.text(line, margin, y);
      y += baseLineHeight;
    });

    y += 10;

    // Chart capture
    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", margin, y, pdfWidth, pdfHeight);

    // New page
    pdf.addPage();
    y = margin;

    const income = transactions.filter((t) => t.type === "income");
    const expense = transactions.filter((t) => t.type === "expense");

    const drawTableWithBorders = (
      title: string,
      headers: string[],
      data: string[][],
      startY: number,
      xPositions: number[],
      totalsRow?: string[]
    ) => {
      pdf.setFontSize(14);
      pdf.text(title, margin, startY);
      let yPos = startY + baseLineHeight;

      const columnWidths = xPositions.map((x, i) =>
        i === xPositions.length - 1
          ? 80
          : xPositions[i + 1] - x
      );

      const drawRow = (row: string[], yPos: number, isHeader = false, isTotals = false) => {
        const fontSize = isHeader ? 11 : 10;
        pdf.setFont("helvetica", isHeader || isTotals ? "bold" : "normal");
        pdf.setFontSize(fontSize);

        // Wrap each cell's content
        const wrapped = row.map((cell, i) =>
          pdf.splitTextToSize(cell, columnWidths[i] - 6)
        );

        // Determine row height (based on tallest cell)
        const maxLines = Math.max(...wrapped.map((lines) => lines.length));
        const rowHeight = maxLines * baseLineHeight;

        // Page break check
        if (yPos + rowHeight > maxY) {
          pdf.addPage();
          yPos = margin;
          drawRow(headers, yPos, true);
          yPos += rowHeight;
        }

        // Draw cells
        wrapped.forEach((lines, i) => {
          const x = xPositions[i];
          const w = columnWidths[i];

          pdf.rect(x, yPos, w, rowHeight);
          lines.forEach((line: string, idx: number) => {
            pdf.text(line, x + 3, yPos + baseLineHeight * (idx + 1) - 6);
          });
        });

        return yPos + rowHeight;
      };

      yPos = drawRow(headers, yPos, true);

      for (const row of data) {
        yPos = drawRow(row, yPos);
      }

      // Draw totals row if provided
      if (totalsRow) {
        yPos = drawRow(totalsRow, yPos, false, true);
      }

      return yPos + 20;
    };

    // Prepare income table data
    const incomeHeaders = ["Menu", "Qty", "Total", "Cash", "Online","status", "Added By", "Date"];
    const incomeX = [margin, margin + 80, margin + 120, margin + 160, margin + 200, margin + 250, margin + 340, margin + 450];
    const incomeData = income.map((t) => [
      t.menuName || "-",
      String(t.quantity || 0),
      `Rs. ${(t.Total_price || 0).toFixed(0)}`,
      `Rs. ${(t.cash || 0).toFixed(0)}`,
      `Rs. ${(t.online || 0).toFixed(0)}`,
      t.status || "-",
      t.added_by || "-",
      getDateString(t.recordedAt),
    ]);

    // Calculate totals for income columns: Total, Cash, Online
    const incomeTotals = income.reduce(
      (acc, t) => {
        acc.total += t.Total_price || 0;
        acc.cash += t.cash || 0;
        acc.online += t.online || 0;
        return acc;
      },
      { total: 0, cash: 0, online: 0 }
    );

    // Create totals row for income
    const incomeTotalsRow = [
      "Total","",
      `Rs. ${incomeTotals.total.toFixed(0)}`,
      `Rs. ${incomeTotals.cash.toFixed(0)}`,
      `Rs. ${incomeTotals.online.toFixed(0)}`,"","",
    ];

    y = drawTableWithBorders("Income Details", incomeHeaders, incomeData, y, incomeX, incomeTotalsRow);

    // Prepare expense table data
    const expenseHeaders = ["Name", "Qty", "Category", "Purpose", "Amount", "status", "Added By", "Date"];
    const expenseX = [margin, margin + 80, margin + 120, margin + 180, margin + 230, margin + 280, margin + 340, margin + 450];
    const expenseData = expense.map((t) => [
      t.ExpensesName || t["inventory-name"] || "W/R",
      String(t["inventory-quantity"] || 0),
      t.category || "-",
      t.purpose || "-",
      `Rs. ${(t.totalAmount || t["inventory-price"] || 0).toFixed(0)}`,
      t.status || "-",
      t.addedBy || "-",
      getDateString(t.recordedAt),
    ]);

    // Calculate total amount for expenses
    const expenseTotalAmount = expense.reduce(
      (acc, t) => acc + (t.totalAmount || t["inventory-price"] || 0),
      0
    );

    // Create totals row for expense
    const expenseTotalsRow = [
      "Total", "", "", "",
      `Rs. ${expenseTotalAmount.toFixed(0)}`, "", "",
    ];

    drawTableWithBorders("Expense Details", expenseHeaders, expenseData, y, expenseX, expenseTotalsRow);

    pdf.save(`${monthTitle.replace(/\s+/g, "-").toLowerCase()}-report.pdf`);
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        className="mb-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }} ref={chartRef}>
        <SalesPieChart income={summary.totalIncome} expenses={summary.totalExpense} />
      </div>
    </div>
  );
};

export default ReportPDFDownload;

