// app/budget/index.js
import BudgetOverview from "@/components/BudgetOverview";
import BudgetForm from "@/components/BudgetForm";

export default function Budget() {
  return (
    <div className="p-6">
      <BudgetOverview />
      {/* <BudgetForm /> */}
    </div>
  );
}
