"use client";
import useFinancialData from "./useFinancialData";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const { data, loading, error } = useFinancialData();

  useEffect(() => {
    if (error) {
      setNotification({ type: "error", message: "Error loading data" });
    } else if (loading) {
      setNotification({ type: "loading", message: "Loading data" });
    } else if (data) {
      const { budgetData, incomeData, expenseData } = data;
      const totalIncome = incomeData.reduce(
        (acc, income) => acc + income.amount,
        0
      );
      const totalExpense = expenseData.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      const totalBudget = budgetData.reduce(
        (acc, budget) => acc + budget.amount,
        0
      );
      const exceededBudget =
        totalBudget - totalExpense < 0 ? totalExpense - totalBudget : 0;
      const exceededExpense =
        totalExpense - totalIncome > 0 ? totalExpense - totalIncome : 0;

      if (exceededBudget !== 0) {
        toast.warning(`You have exceeded your budget by BDT ${exceededBudget}`);
        setNotification({
          type: "warning",
          message: `You have exceeded your budget by BDT ${exceededBudget}`,
        });
      } else if (exceededExpense !== 0) {
        toast.warning(
          `You have exceeded your income by BDT ${exceededExpense}`
        );
        setNotification({
          type: "warning",
          message: `You have exceeded your income by BDT ${exceededExpense}`,
        });
      } else {
        setNotification({
          type: "empty",
          message: `No notifications`,
        });
      }
    }
  }, [data, loading, error]);

  return (
    <BudgetContext.Provider value={{ notification }}>
      {children}
    </BudgetContext.Provider>
  );
};
