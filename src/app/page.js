// app/page.js
import DashboardSummary from "@/components/DashboardSummary";
import RecentTransactions from "@/components/RecentTransactions";
import BudgetOverview from "@/components/BudgetOverview";

export default function Home() {
  return (
    <div className="p-6">
      <DashboardSummary />
      <RecentTransactions />
      <BudgetOverview />
    </div>
  );
}
