"use client";
import useSWR from "swr";
import {
  AiOutlineDollarCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { useSession } from "next-auth/react";
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default function DashboardSummary() {
  const session = useSession();
  const { data } = session;
  console.log(data?.user?.email);

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
      <div className="container mx-auto p-6 mb-6 bg-red-100 rounded-lg shadow-lg flex items-center">
        <AiOutlineExclamationCircle className="text-red-500 w-8 h-8 mr-4" />
        <span className="text-red-700 font-semibold">
          Error: Failed to fetch data. Please try again later.
        </span>
      </div>
    );
  }

  if (!budgetData || !expenseData || !incomeData) {
    return (
      <div className="container mx-auto p-6 mb-6 bg-white rounded-lg shadow-lg flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-8 h-8 mr-4 text-blue-500 animate-spin" />
        <span className="text-gray-700 font-semibold">
          Loading dashboard data...
        </span>
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

  const summaryItems = [
    {
      title: "Total Budget",
      amount: totalBudget,
      icon: AiOutlineDollarCircle,
      color: "green",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: FaMoneyBillWave,
      color: "red",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: FaWallet,
      color: "purple",
    },
  ];

  return (
    <div className="p-6 mb-8 bg-slate-100/80 rounded-xl shadow-lg container mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Dashboard Summary {session.user?.email}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`p-6 bg-${item.color}-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center mb-4">
              <item.icon className={`text-${item.color}-500 w-10 h-10 mr-4`} />
              <h3 className={`text-lg font-semibold text-${item.color}-700`}>
                {item.title}
              </h3>
            </div>
            <p className={`text-xl font-bold text-${item.color}-600`}>
              {item.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "BDT",
              })}
            </p>
          </div>
        ))}
        {remainingBudget >= 0 ? (
          <div
            className={`p-6 bg-blue-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center mb-4">
              <BsFillCheckCircleFill
                className={`text-blue-500 w-10 h-10 mr-4`}
              />
              <h3 className={`text-lg font-semibold text-blue-700`}>
                Remaining Budget
              </h3>
            </div>
            <p className={`text-xl font-bold text-blue-600`}>
              {remainingBudget.toLocaleString("en-US", {
                style: "currency",
                currency: "BDT",
              })}
            </p>
          </div>
        ) : (
          <div
            className={`p-6 bg-red-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center mb-4">
              <AiOutlineExclamationCircle
                className={`text-red-500 w-10 h-10 mr-4`}
              />
              <h3 className={`text-lg font-semibold text-red-700`}>
                Over Budget
              </h3>
            </div>
            <p className={`text-xl font-bold text-red-600`}>
              {Math.abs(remainingBudget).toLocaleString("en-US", {
                style: "currency",
                currency: "BDT",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
