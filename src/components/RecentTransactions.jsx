"use client";
import { useEffect, useState } from "react";

export default function RecentTransactions() {
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        // Fetch recent budgets
        const budgetResponse = await fetch("/api/budget/recent?limit=5");
        if (!budgetResponse.ok) {
          throw new Error("Error fetching recent budgets");
        }
        const budgetData = await budgetResponse.json();
        setRecentBudgets(budgetData.data);

        // Fetch recent incomes
        const incomeResponse = await fetch("/api/income/recent?limit=5");
        if (!incomeResponse.ok) {
          throw new Error("Error fetching recent incomes");
        }
        const incomeData = await incomeResponse.json();
        setRecentIncomes(incomeData.recentIncomes);

        // Fetch recent expenses
        const expenseResponse = await fetch("/api/expenses/recent?limit=5");
        if (!expenseResponse.ok) {
          throw new Error("Error fetching recent expenses");
        }
        const expenseData = await expenseResponse.json();
        setRecentExpenses(expenseData.recentExpenses);
      } catch (error) {
        setError("Error fetching recent transactions");
        console.error(error);
      }
    };

    fetchRecentData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Budgets */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Recent Budgets</h3>
          {recentBudgets.length > 0 ? (
            <ul className="space-y-2">
              {recentBudgets.map((budget) => (
                <li key={budget._id} className="border-b py-2">
                  <p className="font-medium text-gray-700">{`Amount: $${budget.totalAmount}`}</p>
                  <p className="text-gray-500">{`${budget._id.month} ${budget._id.year}`}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent budgets found.</p>
          )}
        </div>

        {/* Recent Incomes */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Recent Incomes</h3>
          {recentIncomes.length > 0 ? (
            <ul className="space-y-2">
              {recentIncomes.map((income) => (
                <li key={income._id} className="border-b py-2">
                  <p className="font-medium text-gray-700">{`Amount: $${income.amount}`}</p>
                  <p className="text-gray-500">{income.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent incomes found.</p>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Recent Expenses</h3>
          {recentExpenses.length > 0 ? (
            <ul className="space-y-2">
              {recentExpenses.map((expense) => (
                <li key={expense._id} className="border-b py-2">
                  <p className="font-medium text-gray-700">{`Amount: $${expense.amount}`}</p>
                  <p className="text-gray-500">{expense.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent expenses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
