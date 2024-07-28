"use client";
import { FiInfo } from "react-icons/fi";
import { useEffect, useState } from "react";
import LoadingMessage from "../Budget/LoadingMessage";
const ExpenseIncomes = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [expenseData, setExpenseData] = useState(null);
  const [error, setError] = useState(null);

  const fetchIncomeData = async () => {
    try {
      const res = await fetch("/api/income");
      if (!res.ok) {
        throw new Error("Failed to fetch income data");
      }
      const data = await res.json();
      setIncomeData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchExpenseData = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (!res.ok) {
        throw new Error("Failed to fetch expense data");
      }
      const data = await res.json();
      setExpenseData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
  }, []);

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  if (!incomeData || !expenseData) {
    return <LoadingMessage />;
  }

  const totalIncome = incomeData.totalAmount || 0;
  const totalExpense = expenseData.expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  return (
    <div className="bg-slate-100 rounded-lg shadow-lg shadow-gray-300 p-4 lg:w-1/2 w-full h-44 relative">
      <h2 className="text-xl font-semibold mb-2">Expense & Incomes</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#ddd"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#3498db"
                strokeWidth="2"
                strokeDasharray="65,35"
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-green-500 font-semibold text-lg">
              BDT {totalIncome.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Total incomes you have made</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 mr-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#ddd"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#e74c3c"
                strokeWidth="2"
                strokeDasharray="50,50"
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-purple-500 font-semibold text-lg">
              BDT {totalExpense.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Total expenses</p>
          </div>
        </div>
      </div>
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
};

export default ExpenseIncomes;
