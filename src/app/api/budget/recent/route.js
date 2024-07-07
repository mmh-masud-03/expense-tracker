import Budget from "@/models/Budget";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const query = {};
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
    return new Response(JSON.stringify("Error getting budgets"), {
      status: 500,
    });
  }
};
