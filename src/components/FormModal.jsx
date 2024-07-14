"use client";
import { useState } from "react";
import { FaBriefcase, FaMoneyBillWave, FaCoins } from "react-icons/fa";
import BudgetForm from "./Budget/BudgetForm";
import IncomeForm from "./Income/IncomeForm";
import ExpenseForm from "./Expense/ExpenseForm";

export default function FormModal({ isOpen, onClose }) {
  const [activeForm, setActiveForm] = useState("budget");

  if (!isOpen) return null;

  const formTypes = [
    { id: "budget", icon: <FaBriefcase />, label: "Budget" },
    { id: "expense", icon: <FaMoneyBillWave />, label: "Expense" },
    { id: "income", icon: <FaCoins />, label: "Income" },
  ];

  const renderForm = () => {
    switch (activeForm) {
      case "budget":
        return <BudgetForm />;
      case "expense":
        return <ExpenseForm />;
      case "income":
        return <IncomeForm />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Add New {activeForm === "budget" && <span>Budget</span>}{" "}
            {activeForm === "expense" && <span>Expense</span>}{" "}
            {activeForm === "income" && <span>Income</span>}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            {formTypes.map((form) => (
              <button
                key={form.id}
                onClick={() => setActiveForm(form.id)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2
                  ${
                    activeForm === form.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <span>{form.icon}</span>
                <span>{form.label}</span>
              </button>
            ))}
          </div>
          {renderForm()}
        </div>
      </div>
    </div>
  );
}
