// app/page.js
import DashboardSummary from "@/components/DashboardSummary";
import RecentTransactions from "@/components/RecentTransactions";
import BudgetOverview from "@/components/Budget/BudgetOverview";
import IncomeList from "@/components/Income/IncomeList";
import ExpenseList from "@/components/Expense/ExpenseList";
import AllTransactionsDetailsPage from "@/components/All Transactions/AllTransactionsDetailsPage";
import BudgetTable from "@/components/Tables/BudgetTable";
import BudgetTableWithoutOverview from "@/components/Tables/BudgetTable";
import IncomeTable from "@/components/Tables/IncomeTable";
import ExpenseTable from "@/components/Tables/ExpenseTable";

export default function Home() {
  return (
    // <div className="p-6 flex flex-col overflow-clip container mx-auto">
    //   <BudgetOverview />

    //   <div className="flex flex-row gap-2 overflow-hidden w-full">
    //     <div className="w-[50%]">
    //       <IncomeList />
    //     </div>
    //     <div className="w-[50%]">
    //       {" "}
    //       <ExpenseList />
    //     </div>
    //   </div>
    // </div>
    <>
      <AllTransactionsDetailsPage />
      <BudgetTableWithoutOverview />
      <IncomeTable />
      <ExpenseTable />
    </>
  );
}
