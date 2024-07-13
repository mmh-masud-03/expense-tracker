import React from "react";
import { FiInfo } from "react-icons/fi";

const ExpenseIncomes = () => {
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 w-1/2 h-44 relative">
      <h2 className="text-xl font-semibold mb-2">Expense & Incomes</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#ddd"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#3498db"
                strokeWidth="2"
                strokeDasharray="65,35"
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-green-500 font-semibold text-lg">+$2,992.00</p>
            <p className="text-sm text-gray-500">Total incomes this month</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 mr-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#ddd"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#e74c3c"
                strokeWidth="2"
                strokeDasharray="50,50"
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-purple-500 font-semibold text-lg">-$1,419.00</p>
            <p className="text-sm text-gray-500">Total outcomes this month</p>
          </div>
        </div>
      </div>
      <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
        <FiInfo size={24} />
      </button>
    </div>
  );
};

export default ExpenseIncomes;
