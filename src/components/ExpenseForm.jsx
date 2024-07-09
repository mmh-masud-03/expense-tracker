"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExpenseForm({ id }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const data = {
    user: "66879847549a77c835e4254f",
    title,
    amount,
    category,
    date,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/expenses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("Expense Created");
      // You can redirect or update UI after successful creation
      router.push("/expenses"); // Redirect to expenses list page
    } else {
      const errorData = await res.json();
      setError(errorData.error);
      console.error("Error creating expense");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-300/80 rounded p-6 max-h-[80vh] max-w-[30vw]"
    >
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
          htmlFor="title"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 pl-7 pr-12 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base outline-none border-b-2 border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div> */}
          <input
            type="number"
            name="amount"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7  text-base outline-none border-b-2 border-gray-300 rounded-md"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 pl-6 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 outline-none border-b-2 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {[
            "Food",
            "Travel",
            "Bills",
            "Entertainment",
            "Education",
            "Healthcare",
            "Shopping",
            "Utilities",
            "Transport",
            "Housing",
            "Clothing",
            "Insurance",
            "Debt Repayment",
            "Personal Care",
            "Gifts & Donations",
            "Childcare",
            "Pet Care",
            "Subscriptions",
            "Emergency",
            "Festivals & Celebrations",
            "Technology",
            "Miscellaneous",
            "Others",
          ].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-base font-medium text-gray-700 mb-1"
        >
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 pl-7  focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-base outline-none border-b-2 border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
        >
          {id ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
