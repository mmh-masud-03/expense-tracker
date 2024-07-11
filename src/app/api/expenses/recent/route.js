import Expense from "@/models/Expense";
import { getTokenFromRequest } from "@/utils/authHelper";
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
    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit"), 10) || 5; // Default to 5 recent transactions

    if (limit < 1) {
      return new Response(JSON.stringify({ error: "Invalid limit value" }), {
        status: 400,
      });
    }

    // Fetch recent expense transactions
    const recentExpenses = await Expense.find({ user: token.id })
      .sort({ date: -1 }) // Sort by date in descending order to get recent transactions
      .limit(limit); // Limit the number of results

    return new Response(
      JSON.stringify({
        recentExpenses,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
