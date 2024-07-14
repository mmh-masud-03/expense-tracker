export default function BudgetProgressBar({ totalBudget, remainingBudget }) {
  const isOverBudget = remainingBudget < 0;
  const percentage =
    totalBudget > 0 ? Math.min((remainingBudget / totalBudget) * 100, 100) : 0;
  const progressColor = isOverBudget ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="relative pt-1 mt-6">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span
            className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${
              isOverBudget ? "red" : "blue"
            }-600 bg-${isOverBudget ? "red" : "blue"}-200`}
          >
            {isOverBudget ? "Over Budget" : "Remaining"}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-semibold inline-block text-${
              isOverBudget ? "red" : "blue"
            }-600`}
          >
            {isOverBudget ? "0.00" : percentage.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div
          style={{ width: `${percentage}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor} transition-all duration-500 ease-in-out`}
        ></div>
      </div>
    </div>
  );
}
