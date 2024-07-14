// app/expenses/edit/[id].js
import { useRouter } from "next/router";
import ExpenseForm from "@/components/Expense/ExpenseForm";

export default function EditExpense() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ExpenseForm id={id} />
    </div>
  );
}
