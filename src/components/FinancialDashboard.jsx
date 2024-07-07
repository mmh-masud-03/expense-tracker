"use client";
import { useState, useEffect } from "react";
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

export default function FinancialDashboard() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, budgetRes] = await Promise.all([
          fetch("/api/income?limit=100"),
          fetch("/api/expenses?limit=100"),
          fetch("/api/budget?limit=12"), // Fetch last 12 months
        ]);

        const incomeJson = await incomeRes.json();
        const expenseJson = await expenseRes.json();
        const budgetJson = await budgetRes.json();

        setIncomeData(incomeJson.incomes);
        setExpenseData(expenseJson.expenses);
        setBudgetData(budgetJson.data);
      } catch (err) {
        setError("Failed to fetch financial data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  // Prepare data for charts
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const incomeByMonth = months.map((month, index) =>
    incomeData
      .filter((income) => new Date(income.date).getMonth() === index)
      .reduce((sum, income) => sum + income.amount, 0)
  );

  const expensesByMonth = months.map((month, index) =>
    expenseData
      .filter((expense) => new Date(expense.date).getMonth() === index)
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  const totalIncome = incomeData.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalExpenses = expenseData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const incomeVsExpensesData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeByMonth,
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "Expenses",
        data: expensesByMonth,
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  const savingsRateData = {
    labels: ["Savings", "Expenses"],
    datasets: [
      {
        data: [savingsRate, 100 - savingsRate],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  const budgetVsActualData = {
    labels: budgetData.map((budget) => `${budget.month} ${budget.year}`),
    datasets: [
      {
        label: "Budget",
        data: budgetData.map((budget) => budget.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Actual Expenses",
        data: budgetData.map((budget) => {
          const monthIndex = months.indexOf(budget.month.slice(0, 3));
          return expensesByMonth[monthIndex] || 0;
        }),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Prepare data for expense categories
  const expenseCategories = [
    "Food",
    "Travel",
    "Bills",
    "Entertainment",
    "Other",
  ];
  const expensesByCategoryData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseCategories.map((category) =>
          expenseData
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0)
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Financial Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
          <Line data={incomeVsExpensesData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Savings Rate</h2>
          <Doughnut
            data={savingsRateData}
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
          <p className="text-center mt-4 text-2xl font-bold text-green-600">
            {savingsRate.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Budget vs Actual Expenses
          </h2>
          <Bar
            data={budgetVsActualData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(
                        2
                      )}`,
                  },
                },
              },
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2 flex justify-center items-center">
          <div className="w-96 h-96">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            <Doughnut
              data={expensesByCategoryData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "right" },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Net Savings</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
