"use client";
import BalanceOverview from "./BalanceOverview";
import ExpenseIncomes from "./ExpenseIncomes";
import GeneralPayment from "./GeneralPayment";
import SavingsPlans from "./SavingsPlans";
import ActiveCards from "./ActiveCards";
import AllSavings from "../Savings/AllSavings";
import { BudgetVsActualChart } from "../Dashboard/ChartComponents";
import useFinancialData from "@/utils/useFinancialData";
import RecentTransactions from "../RecentTransactions";
import RecentTransactionTable from "./RecentTransactionTable";

export default function NewDashboard() {
  const { data, loading, error } = useFinancialData();
  return (
    <div className="mt-2 flex flex-row gap-x-2 container mx-auto max-h-svh bg-slate-50">
      <div className="flex flex-col justify-start items-center gap-y-2 w-[55%]">
        <div className="flex flex-row justify-between gap-x-3 w-full">
          <BalanceOverview />
          <ExpenseIncomes />
        </div>

        <AllSavings />
        <RecentTransactionTable />
      </div>
      <div className="flex flex-col w-[45%] h-full overflow-scroll">
        <BudgetVsActualChart data={data} />
      </div>
    </div>
  );
}
