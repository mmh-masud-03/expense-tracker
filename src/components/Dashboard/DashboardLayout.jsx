"use client";
import useFinancialData from "../../utils/useFinancialData";
import {
  IncomeVsExpensesChart,
  SavingsRateChart,
  BudgetVsActualChart,
  ExpensesByCategoryChart,
} from "./ChartComponents";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import Notices from "./Notices";
import { calculateFinancialSummary } from "@/utils/UtilityFunction";
export default function DashboardLayout() {
  const { data, loading, error } = useFinancialData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  const {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    exceededIncome,
    exceededBudget,
  } = calculateFinancialSummary(data);

  return (
    <div className="p-6 container mx-auto bg-slate-100 min-h-screen flex flex-col gap-y-8">
      <DashboardHeader />
      <Notices
        exceededIncome={exceededIncome}
        exceededBudget={exceededBudget}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-[60vh]">
        <IncomeVsExpensesChart data={data} />
        <SavingsRateChart savingsRate={savingsRate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-20 md:mt-8">
        <BudgetVsActualChart data={data} />
        <ExpensesByCategoryChart data={data.expenseData} />
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netSavings={netSavings}
        exceededBudget={exceededBudget}
        exceededIncome={exceededIncome}
      />
    </div>
  );
}
