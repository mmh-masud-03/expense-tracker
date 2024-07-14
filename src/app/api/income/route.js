import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";
import { getTokenFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export const GET = async (req) => {
  try {
    await ConnectToDB();
    const token = await getTokenFromRequest(req);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const sortBy = url.searchParams.get("sortBy") || "date";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    const filterCriteria = { user: new mongoose.Types.ObjectId(token.id) };
    if (search) {
      filterCriteria.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filterCriteria.category = category;
    }

    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;

    const incomes = await Income.find(filterCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Income.countDocuments(filterCriteria);

    const totalIncomeAmount = await Income.aggregate([
      { $match: filterCriteria },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalAmount =
      totalIncomeAmount.length > 0 ? totalIncomeAmount[0].total : 0;

    const categoryCounts = await Income.aggregate([
      { $match: filterCriteria },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryCountsObj = Object.fromEntries(
      categoryCounts.map(({ _id, count }) => [_id, count])
    );

    return new Response(
      JSON.stringify({
        incomes,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
        totalAmount,
        categoryCounts: categoryCountsObj,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Income API Error:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
