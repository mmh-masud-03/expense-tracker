// app/income/index.js
import IncomeList from "@/components/IncomeList";
import AddIncomeButton from "@/components/AddIncomeButton";

export default function Income() {
  return (
    <div className="p-6">
      <AddIncomeButton />
      <IncomeList />
    </div>
  );
}
