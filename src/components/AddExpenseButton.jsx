// components/AddExpenseButton.js
import { useRouter } from "next/router";

export default function AddExpenseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/expenses/add")}
      className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded"
    >
      Add Expense
    </button>
  );
}
