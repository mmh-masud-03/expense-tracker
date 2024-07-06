// components/ExpenseForm.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function ExpenseForm({ id }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
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
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
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
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded"
      >
        {id ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
