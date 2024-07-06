// components/ExpenseReport.js
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

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const data = await GetAllExpenses();
        setExpenseData(data);
      } catch (err) {
        setError("Failed to fetch expense data.");
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

  if (!expenseData || expenseData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        No expense data available
      </div>
    );
  }

  const categories = [
    ...new Set(expenseData.map((expense) => expense.category)),
  ];
  const categoryTotals = categories.map((category) => {
    return expenseData
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

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
      <h2 className="text-xl font-bold">Expense Report</h2>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Bar Chart</h3>
        <Bar data={barData} />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Pie Chart</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}
