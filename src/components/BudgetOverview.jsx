// components/BudgetOverview.js
"use client";
import useSWR from "swr";
import { GetAllBudget } from "@/utils/helper";

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

  if (error) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        Error: Failed to fetch budget data.
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">Loading...</div>
    );
  }

  if (budgetData.length === 0) {
    return (
      <div className="p-4 mb-6 bg-white rounded shadow-md">
        No budget data available
      </div>
    );
  }

  const totalBudget = budgetData.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );
  const totalExpenses = 0; // Add logic to calculate total expenses if needed
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold">Budget Overview</h2>
      <div className="mt-4">
        <p>Total Budget: ${totalBudget.toFixed(2)}</p>
        <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p>Remaining Budget: ${remainingBudget.toFixed(2)}</p>
        {/* Add more detailed budget items as needed */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <ul>
            {budgetData.map((budget) => (
              <li key={budget._id} className="mt-2">
                {budget.month} {budget.year}: ${budget.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
