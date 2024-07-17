import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";
import { getTokenFromRequest } from "@/utils/authHelper";
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
    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Prepare the query object
    let query = { user: new mongoose.Types.ObjectId(token.id) };

    // Add date range to query if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Initialize the incomes query
    let incomesQuery = Income.find(query).sort({ date: -1 });

    // Apply pagination only if the date range is specified
    if (startDate && endDate) {
      const skip = (page - 1) * limit;
      incomesQuery = incomesQuery.skip(skip).limit(limit);
    }

    // Fetch incomes based on the constructed query
    const incomes = await incomesQuery;

    // Calculate total income amount
    const totalIncomeAmount = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalAmount =
      totalIncomeAmount.length > 0 ? totalIncomeAmount[0].total : 0;

    // Count total number of income documents
    const totalDocuments = await Income.countDocuments(query);

    // Return response with income data, pagination info, and total amount
    return new Response(
      JSON.stringify({
        incomes,
        totalPages:
          startDate && endDate ? Math.ceil(totalDocuments / limit) : 1,
        currentPage: page,
        totalAmount,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
