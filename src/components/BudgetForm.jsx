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
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 w-full px-4">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label
          htmlFor="amount"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm"></span>
          </div> */}
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-b-2 outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 text-base border-gray-300 rounded-md h-10"
            placeholder="Enter amount"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="month"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Month
        </label>
        <select
          id="month"
          name="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="mt-1 border-b-2 block w-full pl-6 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500  rounded-md"
          required
        >
          <option value="">Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="year"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Year
        </label>
        <input
          type="number"
          name="year"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="mt-1 border-b-2 outline-none  focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base border-gray-300 rounded-md pl-7 h-10"
          placeholder="Enter year (YYYY)"
          required
          maxLength={4}
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          {id ? "Update Budget" : "Add Budget"}
        </button>
      </div>
    </form>
  );
}
