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
import { GetAllIncome } from "@/utils/helper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function IncomeReport() {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch("/api/income?page=1&limit=100"); // Fetching a larger set of data
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setIncomeData(data.incomes); // Adjust based on the response structure
      } catch (err) {
        setError("Failed to fetch income data.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
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

  if (!incomeData || incomeData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        No income data available
      </div>
    );
  }

  // Dynamic categories based on the available data
  const categories = [...new Set(incomeData.map((income) => income.category))];
  const categoryTotals = categories.map((category) =>
    incomeData
      .filter((income) => income.category === category)
      .reduce((sum, income) => sum + income.amount, 0)
  );

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Income by Category",
        data: categoryTotals,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Income by Category",
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
      <h2 className="text-xl font-bold mb-4">Income Report</h2>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
        <Bar
          data={barData}
          options={{
            responsive: true,
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
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
        <Pie
          data={pieData}
          options={{
            responsive: true,
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
  );
}
