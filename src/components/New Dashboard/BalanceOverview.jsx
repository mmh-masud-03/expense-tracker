"use client";
import { FiInfo } from "react-icons/fi";
import useFinancialData from "@/utils/useFinancialData";
// components/BalanceOverview.js
export default function BalanceOverview() {
  const { data, error } = useFinancialData();
  const { incomeData, expenseData } = data;
  if (error) {
    return <div>Error loading data</div>;
  }
  if (!incomeData || !expenseData) {
    return <div>Loading...</div>;
  }
  const totalIncome = incomeData.reduce(
    (acc, income) => acc + income.amount,
    0
  );
  const totalExpense = expenseData.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const savingsRate =
    totalIncome - totalExpense > 0
      ? ((totalIncome - totalExpense) / totalIncome) * 100
      : 0;
  const totalBalance =
    totalIncome - totalExpense > 0 ? totalIncome - totalExpense : 0;
  return (
    <div className="relative w-full shadow-lg shadow-slate-300 bg-gradient-to-br from-[#1e293b] to-[#3b4252] rounded-lg p-6 text-slate-200 lg:w-1/2 h-44">
      <h2 className="text-2xl font-bold mb-2">Balance overview</h2>
      <p className="text-4xl font-bold mb-2">BDT {totalBalance}</p>
      <p className="text-base">
        Your current savings rate is{" "}
        <span className="text-green-400">{savingsRate.toFixed(2)}% </span>
      </p>
      <p className="text-xs mb-4">Combination of bank accounts</p>
      <div className="flex space-x-2">{/* Add bank icons here */}</div>
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
}
