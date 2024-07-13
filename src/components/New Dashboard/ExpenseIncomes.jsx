// components/ExpenseIncomes.js
export default function ExpenseIncomes() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Expense & Incomes</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Total incomes this month
            </span>
            <span className="text-green-500 font-bold">+$2,992.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Total outcomes this month
            </span>
            <span className="text-red-500 font-bold">-$1,419.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-500 h-2.5 rounded-full"
              style={{ width: "35%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
