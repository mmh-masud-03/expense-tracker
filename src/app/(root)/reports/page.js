// app/reports/index.js
import ReportFilters from "@/components/ReportFilters";
import ExpenseReport from "@/components/ExpenseReport";
import IncomeReport from "@/components/IncomeReport";

export default function Reports() {
  return (
    <div className="p-6 bg-slate-100 flex flex-col gap-y-16">
      {/* <ReportFilters /> */}
      <ExpenseReport />
      <IncomeReport />
    </div>
  );
}
