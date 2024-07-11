import FinancialDashboard from "@/components/FinancialDashboard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-y-7">
      {/* <FinancialDashboard /> */}
      <DashboardLayout />
    </div>
  );
}
