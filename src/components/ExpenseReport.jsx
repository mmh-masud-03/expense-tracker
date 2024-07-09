"use client";
import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { GetAllExpenses } from "@/utils/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define colors for each category
const categoryColors = {
  Food: "#FF6384", // Red
  Travel: "#36A2EB", // Blue
  Bills: "#FFCE56", // Yellow
  Entertainment: "#4BC0C0", // Teal
  Education: "#9966FF", // Purple
  Healthcare: "#FF9F40", // Orange
  Shopping: "#E7E9AC", // Light Green
  Utilities: "#C9CBCF", // Gray
  Transport: "#FF6347", // Tomato
  Housing: "#40E0D0", // Turquoise
  Clothing: "#FFD700", // Gold
  Insurance: "#ADFF2F", // Green Yellow
  Debt_Repayment: "#FF69B4", // Hot Pink
  Personal_Care: "#7B68EE", // Medium Slate Blue
  Gifts_and_Donations: "#FF4500", // Orange Red
  Childcare: "#DA70D6", // Orchid
  Pet_Care: "#C71585", // Medium Violet Red
  Subscriptions: "#00FA9A", // Medium Spring Green
  Emergency: "#FF1493", // Deep Pink
  Festivals_and_Celebrations: "#1E90FF", // Dodger Blue
  Technology: "#32CD32", // Lime Green
  Miscellaneous: "#8A2BE2", // Blue Violet
  Others: "#A9A9A9", // Dark Gray
};

export default function ExpenseReport() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const { expenses } = await GetAllExpenses({
          sortBy: "amount", // Adjust sorting criteria as needed
          sortOrder: "desc", // Sort in descending order
        });
        setExpenseData(expenses);
      } catch (err) {
        setError("Failed to fetch expense data.");
        console.error("Error fetching expense data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded shadow-md">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md text-red-500">
        Error: {error}
      </div>
    );
  }

  if (expenseData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        No expense data available
      </div>
    );
  }

  // Prepare data for charts
  const categories = [
    ...new Set(expenseData.map((expense) => expense.category)),
  ];
  const categoryTotals = categories.map((category) =>
    expenseData
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  );

  const totalExpense = categoryTotals.reduce((sum, total) => sum + total, 0);
  const highestExpenseCategory =
    categories[categoryTotals.indexOf(Math.max(...categoryTotals))];

  const colors = categories.map(
    (category) => categoryColors[category] || "#A9A9A9"
  ); // Default color if not found

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categoryTotals,
        backgroundColor: colors,
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categoryTotals,
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Expense Report</h2>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded shadow">
            <p className="text-lg font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded shadow">
            <p className="text-lg font-medium">Highest Expense Category</p>
            <p className="text-2xl font-bold text-red-600">
              {highestExpenseCategory}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            Bar Chart
          </h3>
          <div className="relative h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `Amount: $${tooltipItem.raw}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            Pie Chart
          </h3>
          <div className="relative h-64">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `Amount: $${tooltipItem.raw}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
