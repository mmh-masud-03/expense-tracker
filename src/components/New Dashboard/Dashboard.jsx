// pages/index.js
import BalanceOverview from "./BalanceOverview";
import ExpenseIncomes from "./ExpenseIncomes";
import GeneralPayment from "./GeneralPayment";
import SavingsPlans from "./SavingsPlans";
import ActiveCards from "./ActiveCards";

export default function NewDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      <BalanceOverview />
      <ExpenseIncomes />
      <div className="lg:col-span-2">
        <GeneralPayment />
      </div>
      <SavingsPlans />
      <ActiveCards />
    </div>
  );
}
