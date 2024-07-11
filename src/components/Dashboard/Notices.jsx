export default function Notices({
  exceededIncome,
  exceededBudget,
  totalIncome,
  totalExpenses,
}) {
  return (
    <>
      {exceededIncome && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Warning: Your total expenses (Tk {totalExpenses.toFixed(2)}) have
          exceeded your total income (Tk {totalIncome.toFixed(2)}) by Tk{" "}
          {(totalExpenses - totalIncome).toFixed(2)}.
        </div>
      )}
      {exceededBudget && (
        <div className="p-4 mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Notice: Your expenses have exceeded the budget for one or more months.
        </div>
      )}
    </>
  );
}
