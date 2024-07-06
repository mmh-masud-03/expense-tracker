// components/ExpenseList.js
"use client";

import { useEffect, useState } from "react";
import { GetAllExpenses } from "@/utils/helper";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await GetAllExpenses();
      setExpenses(data);
    };

    fetchExpenses();
  }, []);

  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold">Expenses</h2>
      {expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <div key={index} className="mb-2">
            <div className="font-semibold">{expense.title}</div>
            <div className="text-gray-600">{expense.amount}</div>
          </div>
        ))
      ) : (
        <div>No expenses found</div>
      )}
    </div>
  );
}
