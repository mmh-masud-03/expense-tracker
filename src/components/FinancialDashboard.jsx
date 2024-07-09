"use client";
import { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import FormModal from "./FormModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const incomeByMonth = months.map((month) =>
    incomeData
      .filter(
        (income) => new Date(income.date).getMonth() === months.indexOf(month)
      )
      .reduce((sum, income) => sum + income.amount, 0)
  );

  const expensesByMonth = months.map((month) =>
    expenseData
      .filter(
        (expense) => new Date(expense.date).getMonth() === months.indexOf(month)
      )
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
  const netSavings = totalIncome - totalExpenses;
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

  // Sort and deduplicate budget data
  const sortedBudgetData = budgetData
    .sort(
      (a, b) =>
        new Date(a.year, months.indexOf(a.month)) -
        new Date(b.year, months.indexOf(b.month))
    )
    .reduce((acc, curr) => {
      const key = `${curr.month} ${curr.year}`;
      if (!acc[key]) acc[key] = { ...curr, amount: 0 };
      acc[key].amount += curr.amount;
      return acc;
    }, {});

  // Prepare data for budget vs actual expenses chart
  const labels = Object.keys(sortedBudgetData);
  const budgetAmounts = labels.map((key) => sortedBudgetData[key].amount);
  const actualExpenses = labels.map((key) => {
    const [month, year] = key.split(" ");
    const monthIndex = months.indexOf(month.slice(0, 3));
    return expensesByMonth[monthIndex] || 0;
  });

  const budgetVsActualData = {
    labels,
    datasets: [
      {
        label: "Budget",
        data: budgetAmounts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Actual Expenses",
        data: actualExpenses,
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
    "Education",
    "Healthcare",
    "Shopping",
    "Utilities",
    "Transport",
    "Housing",
    "Clothing",
    "Insurance",
    "Debt Repayment",
    "Personal Care",
    "Gifts & Donations",
    "Childcare",
    "Pet Care",
    "Subscriptions",
    "Emergency",
    "Festivals & Celebrations",
    "Technology",
    "Miscellaneous",
    "Others",
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
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(83, 102, 255, 0.6)",
          "rgba(220, 20, 60, 0.6)",
          "rgba(60, 179, 113, 0.6)",
          "rgba(244, 164, 96, 0.6)",
          "rgba(127, 255, 212, 0.6)",
          "rgba(186, 85, 211, 0.6)",
          "rgba(70, 130, 180, 0.6)",
          "rgba(255, 215, 0, 0.6)",
          "rgba(255, 69, 0, 0.6)",
          "rgba(34, 139, 34, 0.6)",
          "rgba(218, 112, 214, 0.6)",
          "rgba(95, 158, 160, 0.6)",
          "rgba(240, 230, 140, 0.6)",
          "rgba(210, 105, 30, 0.6)",
          "rgba(147, 112, 219, 0.6)",
          "rgba(0, 191, 255, 0.6)",
        ],
      },
    ],
  };
  // Calculate notices
  const exceededIncome = totalExpenses > totalIncome;
  const exceededBudget = actualExpenses.some(
    (expense, index) => expense > budgetAmounts[index]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Financial Dashboard
      </h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded w-20 place-self-end"
      >
        Add
      </button>
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {exceededIncome && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Warning: Your total expenses (Tk {totalExpenses.toFixed(2)}) have
          exceeded your total income (Tk {totalIncome.toFixed(2)}) by Tk{" "}
          {(totalExpenses - totalIncome).toFixed(2)}.
        </div>
      )}

      {exceededBudget && (
        <div className="p-4 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Notice: Your expenses have exceeded the budget for one or more months.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[60vh]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Income vs Expenses
          </h2>
          <Line data={incomeVsExpensesData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Savings Rate
          </h2>
          <div className="h-64 w-64">
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
          </div>
          <p className="text-center mt-4 text-2xl font-bold text-green-600">
            {savingsRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Budget vs Actual Expenses
          </h2>
          <Bar
            data={budgetVsActualData}
            options={{
              responsive: true,
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Expenses by Category
          </h2>
          <div className="h-80 w-80">
            <Doughnut
              data={expensesByCategoryData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "right" },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.label}: ${context.raw.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "BDT",
                          }
                        )}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            BDT {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            BDT {totalExpenses.toFixed(2)}
          </p>
        </div>
        {exceededBudget ? (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Net Savings</h3>
            <p
              className={`text-3xl font-bold ${
                netSavings < 0 ? "text-red-600" : "text-blue-600"
              }`}
            >
              Budget Exceeded
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Net Savings</h3>
            <p
              className={`text-3xl font-bold ${
                netSavings < 0 ? "text-red-600" : "text-blue-600"
              }`}
            >
              BDT {netSavings.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
