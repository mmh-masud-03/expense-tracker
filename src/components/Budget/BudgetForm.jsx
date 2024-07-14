"use client";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { getUserId } from "@/utils/UtilityFunction";
export default function BudgetForm({ budget, onClose }) {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const userId = getUserId();
  useEffect(() => {
    if (budget) {
      setAmount(budget.amount);
      setMonth(budget.month);
      setYear(budget.year);
    }
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      user: userId, // Replace with dynamic user ID
      amount: parseFloat(amount),
      month,
      year: parseInt(year),
    };

    const url = budget ? `/api/budget/${budget._id}` : "/api/budget/create";
    const method = budget ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        mutate("/api/budget"); // Trigger a revalidation of the budget data
        onClose();
        toast(budget ? "Budget Updated" : "Budget Created", {
          type: "success",
        });
      } else {
        const errorData = await res.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error("Error processing budget", error);
      setError("An unexpected error occurred");
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
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-base h-8 outline-none border-b-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 border-gray-300 rounded-md"
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
          className="mt-1 outline-none block w-full pl-6 pr-10 py-2 text-base border-b-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
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
          className="mt-1 h-8 pl-7 text-base outline-none border-b-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 rounded-md"
          placeholder="Enter year (YYYY)"
          required
          min="2000"
          max="2100"
        />
      </div>
      <div className="pt-2 flex justify-between">
        <button
          type="submit"
          className="flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          {budget ? "Update Budget" : "Add Budget"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 ml-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
