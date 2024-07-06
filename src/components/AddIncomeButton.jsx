// components/AddIncomeButton.js
"use client";
import { useRouter } from "next/navigation";

export default function AddIncomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/income/add")}
      className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded"
    >
      Add Income
    </button>
  );
}
