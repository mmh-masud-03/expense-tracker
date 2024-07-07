import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(url.searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(url.searchParams.get("limit")) || 10; // Default to 10 items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Fetch paginated income data
    const incomes = await Income.find().skip(skip).limit(limit);

    // Calculate total income and overview stats
    const totalIncomeAmount = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalAmount =
      totalIncomeAmount.length > 0 ? totalIncomeAmount[0].total : 0;

    // Count total number of income documents
    const totalDocuments = await Income.countDocuments();

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
    console.error(err);
    return new Response(JSON.stringify("Server Error"), { status: 500 });
  }
};
