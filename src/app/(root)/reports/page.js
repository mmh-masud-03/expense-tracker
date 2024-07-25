import ExpenseReport from "@/components/Expense/ExpenseReport";
import IncomeReport from "@/components/Income/IncomeReport";

export default function Reports() {
  return (
    <div className="flex flex-col gap-y-8">
      <ExpenseReport />
      <IncomeReport />
    </div>
  );
}
