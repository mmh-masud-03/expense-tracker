"use client";
import { useState } from "react";
import BudgetTableWithoutOverview from "./BudgetTable";
import IncomeTable from "./IncomeTable";
import ExpenseTable from "./ExpenseTable";

function TableNav() {
  const [activeTab, setActiveTab] = useState("budget");
  const tabs = [
    { name: "budget", label: "Budget Table" },
    { name: "income", label: "Income Table" },
    { name: "expense", label: "Expense Table" },
  ];

  const renderTable = () => {
    switch (activeTab) {
      case "budget":
        return <BudgetTableWithoutOverview />;
      case "income":
        return <IncomeTable />;
      case "expense":
        return <ExpenseTable />;
      default:
        return <IncomeTable />;
    }
  };

  return (
    <div className="mt-20 container mx-auto ">
      <div className="flex justify-center items-center mb-1 bg-slate-200 py-8 rounded">
        <div className="flex flex-row justify-center items-center border py-2 w-[46%] rounded-full border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 mx-2 rounded-full ${
                activeTab === tab.name
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 border hover:border-gray-600 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div>{renderTable()}</div>
    </div>
  );
}

export default TableNav;
