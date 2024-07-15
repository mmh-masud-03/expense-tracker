import { AiOutlineExclamationCircle } from "react-icons/ai";
import SummaryCard from "./SummaryCard";
import { BsFillCheckCircleFill } from "react-icons/bs";

export default function BudgetSummary({
  totalBudget,
  totalExpenses,
  remainingBudget,
}) {
  const isOverBudget = remainingBudget < 0;
  const displayRemainingBudget = isOverBudget ? 0 : remainingBudget;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <SummaryCard
        title="Total Budget"
        amount={totalBudget}
        bgColor="bg-green-100"
        iconColor="text-green-500"
      />
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        bgColor="bg-red-100"
        iconColor="text-red-500"
      />
      <SummaryCard
        title="Remaining Budget"
        amount={displayRemainingBudget}
        bgColor={isOverBudget ? "bg-red-100" : "bg-blue-100"}
        iconColor={isOverBudget ? "text-red-500" : "text-blue-500"}
        Icon={isOverBudget ? AiOutlineExclamationCircle : BsFillCheckCircleFill}
      />
      {isOverBudget && (
        <div className="col-span-1 md:col-span-3 p-4 bg-red-200 text-red-800 rounded-lg shadow-md mt-4">
          <AiOutlineExclamationCircle className="inline w-6 h-6 mr-2" />
          Warning: Expenses exceed the budget by{" "}
          {Math.abs(remainingBudget).toFixed(2)} TK.
        </div>
      )}
    </div>
  );
}
