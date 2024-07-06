"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export default function BudgetForm({ id }) {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      user: "66879847549a77c835e4254f", // Replace with dynamic user ID
      amount,
      month,
      year,
    };

    const res = await fetch("/api/budget/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.error);
    } else {
      setAmount("");
      setMonth("");
      setYear("");
      mutate("/api/budget"); // Trigger a revalidation of the budget data
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-white rounded shadow-md"
    >
      {error && <span className="text-red-300">{error}</span>}
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
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
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
