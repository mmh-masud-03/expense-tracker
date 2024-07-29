"use client";
import { FiInfo } from "react-icons/fi";
import { useEffect, useState } from "react";
import LoadingMessage from "../Budget/LoadingMessage";

export default function BalanceOverview() {
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
    return <div className="text-red-500">Error loading data: {error}</div>;
  }

  if (!incomeData || !expenseData) {
    return <LoadingMessage />;
  }

  const totalIncome = incomeData.totalAmount || 0;
  const totalExpense = expenseData.expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0;

  return (
    <div className="relative w-full shadow-lg shadow-slate-300 bg-gradient-to-br from-[#1e293b] to-[#3b4252] rounded-lg p-6 text-slate-200 lg:w-1/2 h-44">
      <h2 className="text-2xl font-bold mb-2">Balance overview</h2>
      <p className="text-4xl font-bold mb-2">BDT {totalBalance.toFixed(2)}</p>
      <p className="text-base">
        Your current savings rate is{" "}
        <span className="text-green-400">{savingsRate.toFixed(2)}% </span>
      </p>
      <p className="text-xs mb-4">Combination of bank accounts</p>
      <div className="flex space-x-2"></div>
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
}
