// app/dashboard/index.js
import DashboardSummary from "@/components/DashboardSummary";
import RecentTransactions from "@/components/RecentTransactions";
import BudgetOverview from "@/components/BudgetOverview";

export default function Dashboard() {
  return (
    <div className="p-6">
      <DashboardSummary />
      <RecentTransactions />
      <BudgetOverview />
    </div>
  );
}
