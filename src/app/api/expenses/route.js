import Expense from "@/models/Expense";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    const url = new URL(req.url, `http://${req.headers.host}`);
    const sortBy = url.searchParams.get("sortBy") || "date";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";

    const sortCriteria = {};
    if (sortBy === "amount") {
      sortCriteria.amount = sortOrder === "asc" ? 1 : -1;
    } else {
      sortCriteria.date = sortOrder === "asc" ? 1 : -1;
    }

    const filterCriteria = {};
    if (search) {
      filterCriteria.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filterCriteria.category = category;
    }

    const expenses = await Expense.find(filterCriteria)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments(filterCriteria);

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
