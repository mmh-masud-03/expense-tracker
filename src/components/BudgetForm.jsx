// components/BudgetForm.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function BudgetForm({ id }) {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-white rounded shadow-md"
    >
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Month
        </label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Year
        </label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded"
      >
        {id ? "Update Budget" : "Add Budget"}
      </button>
    </form>
  );
}
