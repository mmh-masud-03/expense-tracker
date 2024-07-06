"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IncomeForm({ id }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const data = {
    user: "66879847549a77c835e4254f", // Replace with dynamic user ID
    title,
    amount,
    category,
    date,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/income/create", {
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
      router.push("/income");
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
          <option value="Business">Business</option>
          <option value="Job">Job</option>
          <option value="Project">Project</option>
          <option value="Freelance">Freelance</option>
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
        {id ? "Update Income" : "Add Income"}
      </button>
    </form>
  );
}
