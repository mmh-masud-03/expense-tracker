export default function SummaryCards({
  totalIncome,
  totalExpenses,
  netSavings,
  exceededBudget,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">
          BDT {totalIncome.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-3xl font-bold text-red-600">
          BDT {totalExpenses.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Net Savings</h3>
        {exceededBudget ? (
          <p className="text-3xl font-bold text-red-600">Budget Exceeded</p>
        ) : (
          <p
            className={`text-3xl font-bold ${
              netSavings < 0 ? "text-red-600" : "text-blue-600"
            }`}
          >
            BDT {netSavings.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
