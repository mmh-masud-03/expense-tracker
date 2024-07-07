import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get("limit"), 10) || 5; // Default to 5 recent transactions

    if (limit < 1) {
      return new Response(JSON.stringify({ error: "Invalid limit value" }), {
        status: 400,
      });
    }

    // Fetch recent income transactions
    const recentIncomes = await Income.find()
      .sort({ date: -1 }) // Sort by date in descending order to get recent transactions
      .limit(limit); // Limit the number of results

    return new Response(
      JSON.stringify({
        recentIncomes,
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
