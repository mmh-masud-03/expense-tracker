import { getTokenFromRequest } from "@/utils/authHelper";
import Budget from "@/models/Budget";
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

    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;

    const query = { user: token.id };
    if (month) query.month = month;
    if (year) query.year = year;

    const allBudgets = await Budget.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBudgets = await Budget.countDocuments(query);

    return new Response(
      JSON.stringify({
        data: allBudgets,
        total: totalBudgets,
        page,
        pages: Math.ceil(totalBudgets / limit),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET budget route:", err);
    return new Response(JSON.stringify({ error: "Error getting budgets" }), {
      status: 500,
    });
  }
};
