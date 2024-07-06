// utils/helper.js
// utils/helper.js
export const GetAllExpenses = async ({
  sortBy = "date",
  sortOrder = "desc",
  page = 1,
  limit = 10,
}) => {
  try {
    const url = new URL("/api/expenses", window.location.origin);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("sortOrder", sortOrder);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {
      expenses: [],
      totalPages: 0,
      currentPage: 1,
    }; // Return empty data if there's an error
  }
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
