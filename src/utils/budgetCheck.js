// utils/budgetCheck.js
import Budget from "@/models/Budget";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import Notification from "@/models/Notification";
export async function checkBudgetExceedance(userId) {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();

  const budget = await Budget.findOne({
    user: userId,
    month: currentMonth,
    year: currentYear,
  });

  if (!budget) {
    return; // No budget set for this month, can't check for exceedance
  }

  const startOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentYear, currentDate.getMonth() + 1, 0);

  const totalExpenses = await Expense.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalIncome = await Income.aggregate([
    {
      $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const monthlyExpenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
  const monthlyIncome = totalIncome.length > 0 ? totalIncome[0].total : 0;

  if (monthlyExpenses > budget.amount) {
    await Notification.create({
      user: userId,
      message: `Your expenses (${monthlyExpenses}) have exceeded your budget (${budget.amount}) for ${currentMonth} ${currentYear}.`,
    });
  }

  if (monthlyExpenses > monthlyIncome) {
    await Notification.create({
      user: userId,
      message: `Your expenses (${monthlyExpenses}) have exceeded your income (${monthlyIncome}) for ${currentMonth} ${currentYear}.`,
    });
  }
}
