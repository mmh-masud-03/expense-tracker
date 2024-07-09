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
        const { incomes } = await GetAllIncome({
          sortBy: "amount", // Adjust sorting criteria as needed
          sortOrder: "desc", // Sort in descending order
        });
        setIncomeData(incomes);
      } catch (err) {
        setError("Failed to fetch income data.");
        console.error("Error fetching income data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
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

  if (incomeData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        No income data available
      </div>
    );
  }

  // Prepare data for charts
  const categories = [...new Set(incomeData.map((income) => income.category))];
  const categoryTotals = categories.map((category) =>
    incomeData
      .filter((income) => income.category === category)
      .reduce((sum, income) => sum + income.amount, 0)
  );

  const totalIncome = categoryTotals.reduce((sum, total) => sum + total, 0);
  const highestIncomeCategory =
    categories[categoryTotals.indexOf(Math.max(...categoryTotals))];

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Income",
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
        label: "Income",
        data: categoryTotals,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFBD6B",
          "#C9CBCF",
          "#FF6F61",
          "#6B5B95",
          "#D3B8AE",
          "#FFB3E6",
          "#C4E17F",
          "#F7D6E0",
          "#C4E17F",
          "#D0E0D0",
          "#F3C6D0",
          "#E0B0FF",
          "#FF4D4D",
          "#7D8C7E",
          "#E6D5D5",
          "#9B9B77",
        ],
      },
    ],
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Income Report</h2>

      {/* Summary Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded shadow">
            <p className="text-lg font-medium">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded shadow">
            <p className="text-lg font-medium">Highest Income Category</p>
            <p className="text-2xl font-bold text-green-600">
              {highestIncomeCategory}
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
