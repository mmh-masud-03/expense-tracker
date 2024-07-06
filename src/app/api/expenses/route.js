import Expense from "@/models/Expense";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    // Get query parameters for sorting, pagination
    const url = new URL(req.url, `http://${req.headers.host}`);
    const sortBy = url.searchParams.get("sortBy") || "date";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit")) || 10; // Default to 10 items per page

    // Define sorting criteria
    const sortCriteria = {};
    if (sortBy === "amount") {
      sortCriteria.amount = sortOrder === "asc" ? 1 : -1;
    } else {
      sortCriteria.date = sortOrder === "asc" ? 1 : -1;
    }

    // Fetch sorted and paginated expenses
    const expenses = await Expense.find()
      .sort(sortCriteria)
      .skip((page - 1) * limit) // Pagination offset
      .limit(limit); // Limit the number of items

    // Count total number of expenses
    const totalExpenses = await Expense.countDocuments();

    return new Response(
      JSON.stringify({
        expenses,
        totalPages: Math.ceil(totalExpenses / limit),
        currentPage: page,
        totalExpenses,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify("Error getting expenses"), {
      status: 500,
    });
  }
};
