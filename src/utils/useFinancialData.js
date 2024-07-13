import { useState, useEffect } from "react";

export default function useFinancialData() {
  const [data, setData] = useState({
    incomeData: [],
    expenseData: [],
    budgetData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, budgetRes] = await Promise.all([
          fetch("/api/income?limit=100"),
          fetch("/api/expenses?limit=100"),
          fetch("/api/budget?limit=12"),
        ]);

        const incomeJson = await incomeRes.json();
        const expenseJson = await expenseRes.json();
        const budgetJson = await budgetRes.json();

        setData({
          incomeData: incomeJson.incomes,
          expenseData: expenseJson.expenses,
          budgetData: budgetJson.data,
        });
      } catch (err) {
        setError("Failed to fetch financial data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
