"use client";
import useFinancialData from "@/utils/useFinancialData";
function AllTransactionsDetailsPage() {
  const { data, loading, error } = useFinancialData();
  const { incomeData, expenseData, budgetData } = data;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
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
  const remainingBudget = budgetTotal - expensesTotal;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        All Transactions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Income</h2>
          <p className="text-3xl font-bold text-green-500">
            ${incomesTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses</h2>
          <p className="text-3xl font-bold text-red-500">
            ${expensesTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Budget</h2>
          <p className="text-3xl font-bold text-blue-500">
            ${budgetTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AllTransactionsDetailsPage;
