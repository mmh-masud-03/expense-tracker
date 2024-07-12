"use client";
import { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaMoneyBillWave,
  FaCoins,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import BudgetForm from "./BudgetForm";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AddFinanceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/budget") {
      setActiveForm("budget");
    } else if (pathname === "/expenses") {
      setActiveForm("expense");
    } else if (pathname === "/income") {
      setActiveForm("income");
    } else {
      setActiveForm("expense");
    }
  }, [pathname]);

  const toggleModal = () => setIsOpen(!isOpen);

  const formTypes = [
    { id: "budget", icon: <FaBriefcase />, label: "Budget" },
    { id: "expense", icon: <FaMoneyBillWave />, label: "Expense" },
    { id: "income", icon: <FaCoins />, label: "Income" },
  ];

  const renderForm = () => {
    switch (activeForm) {
      case "budget":
        return <BudgetForm onClose={toggleModal} />;
      case "expense":
        return <ExpenseForm onClose={toggleModal} />;
      case "income":
        return <IncomeForm onClose={toggleModal} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={toggleModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">
                  Add New{" "}
                  {activeForm &&
                    activeForm.charAt(0).toUpperCase() + activeForm.slice(1)}
                </h2>
                <button
                  onClick={toggleModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes size={24} />
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleModal}
        className={
          "fixed bottom-6 right-6 p-4 bg-slate-700 text-white rounded-full shadow-lg hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        }
        aria-label="Add finance item"
      >
        <FaPlus size={24} />
      </motion.button>
    </>
  );
}
