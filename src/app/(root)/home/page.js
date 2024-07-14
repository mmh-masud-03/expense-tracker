// app/page.js
import DashboardSummary from "@/components/DashboardSummary";
import RecentTransactions from "@/components/RecentTransactions";
import BudgetOverview from "@/components/BudgetOverview";
import IncomeList from "@/components/IncomeList";
import ExpenseList from "@/components/ExpenseList";

export default function Home() {
  return (
    <div className="p-6 flex flex-col overflow-clip container mx-auto">
      <BudgetOverview />

      <div className="flex flex-row">
        <IncomeList />
        <ExpenseList />
      </div>
    </div>
  );
}
