// components/ExpenseList.js
"use client";

import { useEffect, useState } from "react";
import { GetAllIncome } from "@/utils/helper";
export default function IncomeList() {
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const fetchIncome = async () => {
      const data = await GetAllIncome();
      setIncomes(data);
    };

    fetchIncome();
  }, []);

  return (
    <div className="p-4 mb-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold">Income</h2>
      {incomes.length > 0 ? (
        incomes.map((income, index) => (
          <div key={index} className="mb-2">
            <div className="font-semibold">{income.title}</div>
            <div className="text-gray-600">{income.amount}</div>
          </div>
        ))
      ) : (
        <div>No income found</div>
      )}
    </div>
  );
}
