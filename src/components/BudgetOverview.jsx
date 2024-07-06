"use client";
import useSWR from "swr";
import { GetAllBudget } from "@/utils/helper";
import { useEffect, useState } from "react";
import {
  AiOutlineDollarCircle,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";

const fetcher = async () => {
  const data = await GetAllBudget();
  return data;
};

export default function BudgetOverview() {
  const { data: budgetData, error } = useSWR("/api/budget", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000,
  });

  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (budgetData) {
      const calculatedExpenses = budgetData.reduce(
        (acc, budget) => acc + (budget.expenses || 0),
        0
      );
      setTotalExpenses(calculatedExpenses);
    }
  }, [budgetData]);

  if (error) {
    return (
      <div className="p-4 mb-6 bg-red-100 rounded-lg shadow-md flex items-center">
        <AiOutlineExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
        <span>Error: Failed to fetch budget data.</span>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center justify-center">
        <AiOutlineLoading3Quarters className="w-6 h-6 mr-2 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (budgetData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded-lg shadow-md flex items-center">
        <AiOutlineExclamationCircle className="text-gray-500 w-6 h-6 mr-2" />
        <span>No budget data available</span>
      </div>
    );
  }

  const totalBudget = budgetData.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="relative pt-1 mt-6">
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
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Details</h3>
        <ul className="list-disc list-inside space-y-2">
          {budgetData.map((budget) => (
            <li key={budget._id} className="flex items-center">
              <Tooltip id={`tooltip-${budget._id}`} />
              <span
                data-tooltip-id={`tooltip-${budget._id}`}
                data-tooltip-content={`Budget for ${budget.month} ${budget.year}`}
                className="mr-2 cursor-pointer"
              >
                {budget.month} {budget.year}:
              </span>
              <span className="font-bold">${budget.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
