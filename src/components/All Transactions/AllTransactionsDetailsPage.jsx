"use client";
import useFinancialData from "@/utils/useFinancialData";
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

import {
  FaWallet,
  FaChartLine,
  FaMoneyBillWave,
  FaShoppingCart,
  FaPiggyBank,
  FaTrophy,
} from "react-icons/fa";
import SavingsRate from "../Savings/SavingsRate";

function AllTransactionsDetailsPage() {
  const { data, loading, error } = useFinancialData();
  const [financialOverview, setFinancialOverview] = useState({
    incomesTotal: 0,
    expensesTotal: 0,
    budgetTotal: 0,
    remainingBudget: 0,
    categoryIncomeCounts: {},
    categoryExpenseCounts: {},
  });

  useEffect(() => {
    if (data) {
      const { incomeData, expenseData, budgetData } = data;

      const incomesTotal = incomeData.reduce(
        (acc, income) => acc + income.amount,
        0
      );
      const expensesTotal = expenseData.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      const budgetTotal = budgetData.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );
      const remainingBudget =
        budgetTotal - expensesTotal > 0 ? budgetTotal - expensesTotal : 0;

      const categoryIncomeCounts = incomeData.reduce((acc, income) => {
        acc[income.category] = (acc[income.category] || 0) + 1;
        return acc;
      }, {});

      const categoryExpenseCounts = expenseData.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + 1;
        return acc;
      }, {});

      setFinancialOverview({
        incomesTotal,
        expensesTotal,
        budgetTotal,
        remainingBudget,
        categoryIncomeCounts,
        categoryExpenseCounts,
      });
    }
  }, [data]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const topIncomeCategory = Object.entries(
    financialOverview.categoryIncomeCounts
  ).sort((a, b) => b[1] - a[1])[0];

  const topExpenseCategory = Object.entries(
    financialOverview.categoryExpenseCounts
  ).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      title: "Total Budget",
      value: financialOverview.budgetTotal,
      color: "from-blue-600 to-blue-400",
      icon: FaWallet,
    },
    {
      title: "Remaining Budget",
      value: financialOverview.remainingBudget,
      color: "from-green-600 to-green-400",
      icon: FaChartLine,
    },
    {
      title: "Total Expenses",
      value: financialOverview.expensesTotal,
      color: "from-red-600 to-red-400",
      icon: FaMoneyBillWave,
    },
    {
      title: "Top Expense Category",
      value: topExpenseCategory ? topExpenseCategory[0] : "N/A",
      color: "from-purple-600 to-purple-400",
      icon: FaShoppingCart,
    },
    {
      title: "Total Income",
      value: financialOverview.incomesTotal,
      color: "from-indigo-600 to-indigo-400",
      icon: FaPiggyBank,
    },
    {
      title: "Top Income Category",
      value: topIncomeCategory ? topIncomeCategory[0] : "N/A",
      color: "from-teal-600 to-teal-400",
      icon: FaTrophy,
    },
  ];

  return (
    <div className=" container rounded-lg mx-auto bg-gradient-to-br from-gray-100 to-gray-200 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Cards */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card, index) => (
                <div key={index} className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}
                  ></div>
                  <div className="py-9 relative bg-slate-100 shadow-xl rounded-xl leading-none flex items-top justify-start space-x-6 p-6 transform group-hover:scale-105 transition duration-300">
                    <span className="absolute top-4 right-4">
                      <FiMoreVertical />
                    </span>
                    <div
                      className={`text-${
                        card.color.split("-")[1]
                      }-600 rounded-full p-3 bg-${
                        card.color.split("-")[1]
                      }-100`}
                    >
                      <card.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900 text-sm">
                        {card.title}
                      </h2>
                      <p className="mt-2 text-xl font-bold text-gray-900">
                        {typeof card.value === "number"
                          ? `BDT ${card.value.toFixed(2)}`
                          : card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Savings Rate */}
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="w-full h-full">
              <SavingsRate
                incomeData={data.incomeData}
                expenseData={data.expenseData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllTransactionsDetailsPage;
