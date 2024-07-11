import { getTokenFromRequest } from "@/utils/authHelper";
import Expense from "@/models/Expense";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

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

    const filterCriteria = { user: token.id };
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
    console.error("Error in GET expense route:", err);
    return new Response(JSON.stringify({ error: "Error getting expenses" }), {
      status: 500,
    });
  }
};
