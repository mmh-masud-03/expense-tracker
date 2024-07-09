"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IncomeForm({ income, onClose }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (income) {
      setTitle(income.title);
      setAmount(income.amount);
      setCategory(income.category);
      setDate(new Date(income.date).toISOString().split("T")[0]);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      user: "66879847549a77c835e4254f", // Replace with dynamic user ID
      title,
      amount,
      category,
      date,
    };

    const url = income ? `/api/income/${income._id}` : "/api/income/create";
    const method = income ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log(income ? "Income Updated" : "Income Created");
        onClose();
      } else {
        const errorData = await res.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error("Error processing income", error);
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
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 pl-7 h-8 text-base outline-none border-b-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm  border-gray-300 rounded-md"
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
            className="text-base h-8 outline-none border-b-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7  border-gray-300 rounded-md"
            placeholder="Enter amount"
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
          className="mt-1 outline-none block w-full pl-6 pr-10 py-2 text-base border-b-2 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500  rounded-md"
          required
        >
          <option value="">Select Category</option>
          {[
            "Business",
            "Job",
            "Project",
            "Freelance",
            "Investment",
            "Rental",
            "Savings",
            "Gift",
            "Pension",
            "Consulting",
            "Tutoring",
            "Government Benefits",
            "Scholarship",
            "Lottery & Prize",
            "Part-Time Job",
            "Sale of Assets",
            "Agriculture",
            "Transportation Services",
            "Crafts & Homemade Goods",
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
          className="mt-1 h-8 pl-7 text-base outline-none border-b-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="pt-2 flex justify-between">
        <button
          type="submit"
          className="flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          {income ? "Update Income" : "Add Income"}
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
