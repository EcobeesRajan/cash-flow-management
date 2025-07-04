import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

type Props = {
  income: number;
  expenses: number;
};

const SalesPieChart = ({ income, expenses }: Props) => {
  const total = income + expenses;

  const incomePercent = total > 0 ? (income / total) * 100 : 0;
  const expensePercent = total > 0 ? (expenses / total) * 100 : 0;

  return (
    <div className="flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-1/2">
      <h2 className="text-xl font-semibold text-center mb-4">Chart View</h2>
      <Pie
        data={{
          datasets: [
            {
              data: [income, expenses],
              backgroundColor: ["#4CAF50", "#F44336"],
              hoverOffset: 20,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
        }}}
        
      />
      <div className="mt-4 text-center space-y-1 font-semibold">
        <p>Income: {incomePercent.toFixed(2)} % & Expense: {expensePercent.toFixed(2)} %
           </p>
      </div>
    </div>
    </div>
  );
};

export default SalesPieChart;
