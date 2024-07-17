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
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

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
    if (startDate && endDate) {
      filterCriteria.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const expensesQuery = Expense.find(filterCriteria).sort(sortCriteria);

    if (startDate && endDate) {
      expensesQuery.skip((page - 1) * limit).limit(limit);
    }

    const expenses = await expensesQuery;
    const totalExpenses = await Expense.countDocuments(filterCriteria);

    // Calculate total expense amount
    const totalExpenseAmount = await Expense.aggregate([
      { $match: filterCriteria },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalAmount =
      totalExpenseAmount.length > 0 ? totalExpenseAmount[0].total : 0;

    return new Response(
      JSON.stringify({
        expenses,
        totalPages: startDate && endDate ? Math.ceil(totalExpenses / limit) : 1,
        currentPage: page,
        totalExpenses,
        totalAmount,
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
