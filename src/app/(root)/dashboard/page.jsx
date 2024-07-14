import FinancialDashboard from "@/components/FinancialDashboard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import NewDashboard from "@/components/New Dashboard/Dashboard";
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-y-7">
      {/* <FinancialDashboard /> */}
      <NewDashboard />
      <DashboardLayout />
    </div>
  );
}
