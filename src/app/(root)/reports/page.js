// app/reports/index.js
import ReportFilters from "@/components/ReportFilters";
import ExpenseReport from "@/components/Expense/ExpenseReport";
import IncomeReport from "@/components/Income/IncomeReport";

export default function Reports() {
  return (
    <div className="p-6  flex flex-col gap-y-8">
      {/* <ReportFilters /> */}
      <ExpenseReport />
      <IncomeReport />
    </div>
  );
}
