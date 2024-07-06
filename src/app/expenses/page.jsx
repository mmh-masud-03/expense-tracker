// app/expenses/index.js
import ExpenseList from "@/components/ExpenseList";
import AddExpenseButton from "@/components/AddExpenseButton";
export default function Expenses() {
  return (
    <div className="p-6">
      <AddExpenseButton />
      <ExpenseList />
    </div>
  );
}
