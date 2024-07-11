import Budget from "@/models/Budget";
import { getTokenFromRequest } from "@/utils/authHelper";
import { ConnectToDB } from "@/utils/connect";
import mongoose from "mongoose";

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
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const query = { user: new mongoose.Types.ObjectId(token.id) }; // Ensure the user ID is correctly accessed from the token
    if (month) query.month = month;
    if (year) query.year = year;

    // Aggregate budgets by month and year
    const aggregatedBudgets = await Budget.aggregate([
      { $match: query },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }, // Sort by year and month descending
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const totalBudgets = await Budget.countDocuments(query);

    return new Response(
      JSON.stringify({
        data: aggregatedBudgets,
        total: totalBudgets,
        page,
        pages: Math.ceil(totalBudgets / limit),
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
