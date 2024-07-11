import { useSession } from "next-auth/react";

export const getUserId = () => {
  const { data: session } = useSession();
  return session?.user?.id;
};
export function calculateFinancialSummary(data) {
  const totalIncome = data.incomeData.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const totalExpenses = data.expenseData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const netSavings = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const exceededIncome = totalExpenses > totalIncome;
  const exceededBudget = data.budgetData.some(
    (budget, index) =>
      data.expenseData[index] && data.expenseData[index].amount > budget.amount
  );

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    exceededIncome,
    exceededBudget,
  };
}
export function prepareChartData(data, chartType) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  switch (chartType) {
    case "incomeVsExpenses":
      const incomeByMonth = months.map((month) =>
        data.incomeData
          .filter(
            (income) =>
              new Date(income.date).getMonth() === months.indexOf(month)
          )
          .reduce((sum, income) => sum + income.amount, 0)
      );
      const expensesByMonth = months.map((month) =>
        data.expenseData
          .filter(
            (expense) =>
              new Date(expense.date).getMonth() === months.indexOf(month)
          )
          .reduce((sum, expense) => sum + expense.amount, 0)
      );
      return {
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeByMonth,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
          {
            label: "Expenses",
            data: expensesByMonth,
            borderColor: "rgba(255, 99, 132, 1)",
            fill: false,
          },
        ],
      };

    case "savingsRate":
      const { savingsRate } = data;
      return {
        labels: ["Savings", "Expenses"],
        datasets: [
          {
            data: [savingsRate, 100 - savingsRate],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
          },
        ],
      };

    case "budgetVsActual":
      const sortedBudgetData = data.budgetData
        .sort(
          (a, b) =>
            new Date(a.year, months.indexOf(a.month)) -
            new Date(b.year, months.indexOf(b.month))
        )
        .reduce((acc, curr) => {
          const key = `${curr.month} ${curr.year}`;
          if (!acc[key]) acc[key] = { ...curr, amount: 0 };
          acc[key].amount += curr.amount;
          return acc;
        }, {});

      const labels = Object.keys(sortedBudgetData);
      const budgetAmounts = labels.map((key) => sortedBudgetData[key].amount);
      const actualExpenses = labels.map((key) => {
        const [month, year] = key.split(" ");
        const monthIndex = months.indexOf(month.slice(0, 3));
        return data.expenseData
          .filter(
            (expense) =>
              new Date(expense.date).getMonth() === monthIndex &&
              new Date(expense.date).getFullYear().toString() === year
          )
          .reduce((sum, expense) => sum + expense.amount, 0);
      });

      return {
        labels,
        datasets: [
          {
            label: "Budget",
            data: budgetAmounts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Actual Expenses",
            data: actualExpenses,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      };

    case "expensesByCategory":
      const expenseCategories = [
        "Food",
        "Travel",
        "Bills",
        "Entertainment",
        "Education",
        "Healthcare",
        "Shopping",
        "Utilities",
        "Transport",
        "Housing",
        "Clothing",
        "Insurance",
        "Debt Repayment",
        "Personal Care",
        "Gifts & Donations",
        "Childcare",
        "Pet Care",
        "Subscriptions",
        "Emergency",
        "Festivals & Celebrations",
        "Technology",
        "Miscellaneous",
        "Others",
      ];

      const categoryData = expenseCategories.map((category) =>
        data
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0)
      );

      const backgroundColors = [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(199, 199, 199, 0.6)",
        "rgba(83, 102, 255, 0.6)",
        "rgba(220, 20, 60, 0.6)",
        "rgba(60, 179, 113, 0.6)",
        "rgba(244, 164, 96, 0.6)",
        "rgba(127, 255, 212, 0.6)",
        "rgba(186, 85, 211, 0.6)",
        "rgba(70, 130, 180, 0.6)",
        "rgba(255, 215, 0, 0.6)",
        "rgba(255, 69, 0, 0.6)",
        "rgba(34, 139, 34, 0.6)",
        "rgba(218, 112, 214, 0.6)",
        "rgba(95, 158, 160, 0.6)",
        "rgba(240, 230, 140, 0.6)",
        "rgba(210, 105, 30, 0.6)",
        "rgba(147, 112, 219, 0.6)",
        "rgba(0, 191, 255, 0.6)",
      ];

      return {
        labels: expenseCategories,
        datasets: [
          {
            data: categoryData,
            backgroundColor: backgroundColors,
          },
        ],
      };

    default:
      return null;
  }
}
