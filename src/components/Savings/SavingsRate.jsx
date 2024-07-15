"use client";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SavingsRate({ incomeData, expenseData }) {
  const [savingsRateData, setSavingsRateData] = useState({
    labels: ["Savings", "Expenses"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  });
  const [savingsRate, setSavingsRate] = useState(0);

  useEffect(() => {
    const totalIncome = incomeData.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const totalExpenses = expenseData.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const savingsRateValue =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    setSavingsRateData({
      labels: ["Savings", "Expenses"],
      datasets: [
        {
          data: [savingsRateValue, 100 - savingsRateValue],
          backgroundColor: ["#4ade80", "#f87171"],
          borderColor: ["#22c55e", "#ef4444"],
          borderWidth: 1,
        },
      ],
    });
    setSavingsRate(savingsRateValue);
  }, [incomeData, expenseData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Savings Rate
      </h2>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full aspect-square max-w-[250px]">
          <Doughnut
            data={savingsRateData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: "circle",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.label}: ${context.raw.toFixed(2)}%`,
                  },
                  titleFont: {
                    size: 14,
                    weight: "bold",
                  },
                  bodyFont: {
                    size: 12,
                  },
                  padding: 10,
                },
              },
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-3xl font-extrabold text-gray-800">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Total Savings</p>
        <p className="text-xl font-bold text-green-600">
          $
          {(
            incomeData.reduce((sum, income) => sum + income.amount, 0) -
            expenseData.reduce((sum, expense) => sum + expense.amount, 0)
          ).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
