// app/dashboard/index.js
import DashboardSummary from "@/components/DashboardSummary";
import RecentTransactions from "@/components/RecentTransactions";
import BudgetOverview from "@/components/BudgetOverview";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-y-7">
      <DashboardSummary />
      <RecentTransactions />
      <BudgetOverview />
    </div>
  );
}