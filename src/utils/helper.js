// utils/helper.js
export const GetAllExpenses = async () => {
  const res = await fetch("/api/expenses");
  const data = await res.json();
  return data;
};
export const GetAllIncome = async () => {
  const res = await fetch("/api/income");
  const data = await res.json();
  return data;
};
export const GetAllBudget = async () => {
  const res = await fetch("/api/budget");
  const data = await res.json();
  return data;
};
