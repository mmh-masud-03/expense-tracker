// components/GeneralPayment.js
"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GeneralPayment() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Review done",
        data: [40000, 30000, 35000, 50000, 40000, 35000],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
      },
      {
        label: "Need to review",
        data: [20000, 5000, 15000, 20000, 20000, 10000],
        backgroundColor: "rgba(99, 102, 241, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => `${value / 1000}k`,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const transactions = [
    {
      id: 1,
      name: "Spotify",
      description: "Spotify Premium",
      amount: 25.0,
      date: "16 oct 2023 / 21:32:12",
      status: "Success",
    },
    {
      id: 2,
      name: "Netflix",
      description: "Netflix Premium",
      amount: 45.25,
      date: "17 oct 2023 / 09:27:45",
      status: "Success",
    },
    {
      id: 3,
      name: "Pratama Arhan",
      description: "pratama@gmail.com",
      amount: 19.5,
      date: "17 oct 2023 / 13:11:27",
      status: "Failed",
    },
    {
      id: 4,
      name: "Sketch",
      description: "Annually membership",
      amount: 50.0,
      date: "18 oct 2023 / 10:55:39",
      status: "Failed",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">General payment</h2>
        <div className="text-sm font-medium">
          <span className="text-green-500">$21,847.00</span>
        </div>
      </div>
      <div className="h-64 mb-8">
        <Bar data={data} options={options} />
      </div>
      <div>
        <h3 className="font-bold mb-4">List of transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`/${transaction.name
                            .toLowerCase()
                            .replace(" ", "-")}.png`}
                          alt={transaction.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
