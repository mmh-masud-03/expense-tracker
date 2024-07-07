"use client";
import { useEffect, useState } from "react";
import { FaWallet, FaMoneyBillWave, FaChartBar } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function RecentTransactions() {
  const [recentBudgets, setRecentBudgets] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const [budgetResponse, incomeResponse, expenseResponse] =
          await Promise.all([
            fetch("/api/budget/recent?limit=5"),
            fetch("/api/income/recent?limit=5"),
            fetch("/api/expenses/recent?limit=5"),
          ]);

        if (!budgetResponse.ok || !incomeResponse.ok || !expenseResponse.ok) {
          throw new Error("Error fetching recent transactions");
        }

        const [budgetData, incomeData, expenseData] = await Promise.all([
          budgetResponse.json(),
          incomeResponse.json(),
          expenseResponse.json(),
        ]);

        setRecentBudgets(budgetData.data);
        setRecentIncomes(incomeData.recentIncomes);
        setRecentExpenses(expenseData.recentExpenses);
      } catch (error) {
        setError("Error fetching recent transactions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentData();
  }, []);

  const TransactionCard = ({ title, icon: Icon, data, color }) => (
    <div
      className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${color}-500`}
    >
      <div className="flex items-center mb-4">
        <Icon className={`text-${color}-500 w-8 h-8 mr-3`} />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      {data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((item) => (
            <li key={item._id} className="border-b border-gray-200 pb-2">
              <p className={`font-medium text-${color}-600`}>
                {item.amount
                  ? `BDT ${item.amount.toFixed(2)}`
                  : `BDT ${item.totalAmount?.toFixed(2)}`}
              </p>
              <p className="text-sm text-gray-500">
                {item.title || `${item._id?.month} ${item._id?.year}`}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">
          No recent {title.toLowerCase()} found.
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <AiOutlineLoading3Quarters className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 rounded-xl shadow-lg text-red-700">
        <p className="font-semibold">{error}</p>
        <p>
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Recent Transactions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransactionCard
          title="Recent Budgets"
          icon={FaChartBar}
          data={recentBudgets}
          color="blue"
        />
        <TransactionCard
          title="Recent Incomes"
          icon={FaWallet}
          data={recentIncomes}
          color="green"
        />
        <TransactionCard
          title="Recent Expenses"
          icon={FaMoneyBillWave}
          data={recentExpenses}
          color="red"
        />
      </div>
    </div>
  );
}
