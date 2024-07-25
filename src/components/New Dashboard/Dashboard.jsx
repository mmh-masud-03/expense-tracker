"use client";
import BalanceOverview from "./BalanceOverview";
import ExpenseIncomes from "./ExpenseIncomes";
import AllSavings from "../Savings/AllSavings";
import {
  BudgetVsActualChart,
  IncomeVsExpensesChart,
} from "../Dashboard/ChartComponents";
import useFinancialData from "@/utils/useFinancialData";
import RecentTransactionTable from "./RecentTransactionTable";

export default function NewDashboard() {
  const { data, loading, error } = useFinancialData();
  return (
    <div className="rounded-lg grid grid-cols-1 lg:grid-cols-12 gap-4 container mx-auto min-h-screen bg-slate-50 p-4">
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <BalanceOverview />
          <ExpenseIncomes />
        </div>
        <AllSavings />
        <RecentTransactionTable />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4">
        <BudgetVsActualChart data={data} />
        <IncomeVsExpensesChart data={data} />
      </div>
    </div>
  );
}
