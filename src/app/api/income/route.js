import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";
import { getTokenFromRequest } from "@/utils/authHelper";
import mongoose from "mongoose";

export const GET = async (req) => {
  try {
    await ConnectToDB();
    const token = await getTokenFromRequest(req);

    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit")) || 10; // Default to 10 items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Fetch paginated income data
    const incomes = await Income.find({ user: token.id })
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 }); // Sort by date, most recent first

    // Log incomes to verify correct documents are being fetched

    // Calculate total income amount
    const totalIncomeAmount = await Income.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(token.id) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalAmount =
      totalIncomeAmount.length > 0 ? totalIncomeAmount[0].total : 0;

    // Count total number of income documents
    const totalDocuments = await Income.countDocuments({ user: token.id });

    // Return response with income data, pagination info, and total amount
    return new Response(
      JSON.stringify({
        incomes,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
        totalAmount,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Aggregation Error:", err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
