"use client";
import useSWR from "swr";
import {
  AiOutlineDollarCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default function DashboardSummary() {
  const { data: budgetData, error: budgetError } = useSWR(
    "/api/budget",
    fetcher
  );
  const { data: expenseData, error: expenseError } = useSWR(
    "/api/expenses",
    fetcher
  );
  const { data: incomeData, error: incomeError } = useSWR(
    "/api/income",
    fetcher
  );

  if (budgetError || expenseError || incomeError) {
    return (
      <div className="p-4 mb-6 bg-red-100 rounded-lg shadow-md flex items-center">
        <AiOutlineExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
        <span>Error: Failed to fetch data.</span>
      </div>
    );
  }

  if (!budgetData || !expenseData || !incomeData) {
    return (
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-6 h-6 mr-2 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  const aggregateBudgetData = (data) => {
    const aggregated = data.reduce((acc, budget) => {
      const key = `${budget.month}-${budget.year}`;
      if (!acc[key]) {
        acc[key] = { ...budget, amount: 0 };
      }
      acc[key].amount += budget.amount;
      return acc;
    }, {});
    return Object.values(aggregated);
  };

  const aggregatedBudgetData = aggregateBudgetData(budgetData.data);
  const totalBudget = aggregatedBudgetData.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );
  const totalExpenses = expenseData.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncome = incomeData.incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Dashboard Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-green-100 rounded-lg shadow-sm flex items-center">
          <AiOutlineDollarCircle className="text-green-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Budget</p>
            <p className="text-2xl font-bold">{totalBudget.toFixed(2)} TK</p>
          </div>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow-sm flex items-center">
          <AiOutlineDollarCircle className="text-red-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold">{totalExpenses.toFixed(2)} TK</p>
          </div>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg shadow-sm flex items-center">
          <BsFillCheckCircleFill className="text-blue-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Remaining Budget</p>
            <p className="text-2xl font-bold">
              {remainingBudget.toFixed(2)} TK
            </p>
          </div>
        </div>
        <div className="p-4 bg-purple-100 rounded-lg shadow-sm flex items-center">
          <AiOutlineDollarCircle className="text-purple-500 w-10 h-10 mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Income</p>
            <p className="text-2xl font-bold">{totalIncome.toFixed(2)} TK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
