import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { prepareChartData } from "@/utils/UtilityFunction";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function IncomeVsExpensesChart({ data }) {
  const chartData = prepareChartData(data, "incomeVsExpenses");
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Income vs Expenses
      </h2>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export function SavingsRateChart({ savingsRate }) {
  const chartData = prepareChartData({ savingsRate }, "savingsRate");
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">Savings Rate</h2>
      <div className="h-64 w-64">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.label}: ${context.raw.toFixed(2)}%`,
                },
              },
            },
          }}
        />
      </div>
      <p className="text-center mt-4 text-2xl font-bold text-green-600">
        {savingsRate.toFixed(2)}%
      </p>
    </div>
  );
}

export function BudgetVsActualChart({ data }) {
  const chartData = prepareChartData(data, "budgetVsActual");
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Budget vs Actual Expenses
      </h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: { x: { stacked: true }, y: { stacked: true } },
        }}
      />
    </div>
  );
}

export function ExpensesByCategoryChart({ data }) {
  const chartData = prepareChartData(data, "expensesByCategory");
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Expenses by Category
      </h2>
      <div className="h-80 w-80">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "right" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `${context.label}: ${context.raw.toLocaleString("en-US", {
                      style: "currency",
                      currency: "BDT",
                    })}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
