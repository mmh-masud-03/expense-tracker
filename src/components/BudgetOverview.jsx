"use client";
import useSWR from "swr";
import { useState } from "react";
import {
  AiOutlineDollarCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function BudgetOverview() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: budgetData, error: budgetError } = useSWR(
    `/api/budget?month=${selectedMonth}&year=${selectedYear}&page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  const { data: expenseData, error: expenseError } = useSWR(
    `/api/expenses?month=${selectedMonth}&year=${selectedYear}&page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  const aggregateData = (data) => {
    if (!data) return [];
    const aggregated = data.reduce((acc, item) => {
      const key = `${item.month}-${item.year}`;
      if (!acc[key]) {
        acc[key] = { ...item, amount: 0 };
      }
      acc[key].amount += item.amount;
      return acc;
    }, {});
    return Object.values(aggregated);
  };

  const aggregatedBudgetData = aggregateData(budgetData?.data);
  const aggregatedExpenseData = aggregateData(expenseData?.data);

  const totalBudget = aggregatedBudgetData.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );
  const totalExpenses = aggregatedExpenseData.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const remainingBudget = totalBudget - totalExpenses;

  if (budgetError || expenseError) {
    return (
      <div className="p-4 mb-6 bg-red-100 rounded-lg shadow-md flex items-center">
        <AiOutlineExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
        <span>Error: Failed to fetch data.</span>
      </div>
    );
  }

  if (!budgetData || !expenseData) {
    return (
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-6 h-6 mr-2 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (aggregatedBudgetData.length === 0 && aggregatedExpenseData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center">
        <AiOutlineExclamationCircle className="text-gray-500 w-6 h-6 mr-2" />
        <span>No budget or expense data available</span>
      </div>
    );
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [
    ...new Set(
      [...(budgetData?.data || []), ...(expenseData?.data || [])].map(
        (item) => item.year
      )
    ),
  ];

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg shadow-sm flex items-center">
          <AiOutlineDollarCircle className="text-green-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Budget</p>
            <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow-sm flex items-center">
          <AiOutlineDollarCircle className="text-red-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-sm flex items-center">
          <BsFillCheckCircleFill className="text-blue-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Remaining Budget</p>
            <p className="text-2xl font-bold">${remainingBudget.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="relative pt-1 mb-6">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Remaining
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {((remainingBudget / totalBudget) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${(remainingBudget / totalBudget) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
      </div>

      <div className="mb-6 flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-lg shadow mb-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="py-3 px-4 uppercase text-sm text-left">Month</th>
              <th className="py-3 px-4 uppercase text-sm text-left">Year</th>
              <th className="py-3 px-4 uppercase text-sm text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {aggregatedBudgetData.map((budget, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-4">{budget.month}</td>
                <td className="py-3 px-4">{budget.year}</td>
                <td className="py-3 px-4">${budget.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {Math.ceil((budgetData?.total || 0) / limit)}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil((budgetData?.total || 0) / limit)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
