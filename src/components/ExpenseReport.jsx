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

export default function ExpenseReport() {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        // Fetching expenses with pagination and sorting
        const { expenses, totalPages, currentPage } = await GetAllExpenses({
          sortBy: "amount", // Adjust sorting criteria as needed
          sortOrder: "desc", // Sort in descending order
          page: 1, // Fetch first page
          limit: 10, // Fetch 10 items per page
        });
        setExpenseData(expenses);
        setPagination({ totalPages, currentPage });
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
      <div className="p-4 mb-6 bg-white rounded shadow-md">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">Error: {error}</div>
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

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categoryTotals,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
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
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Expense Report</h2>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
        <div className="relative">
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
        <div className="relative">
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
}
