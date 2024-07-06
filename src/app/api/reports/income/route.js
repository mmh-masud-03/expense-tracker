import { ConnectToDB } from "@/utils/connect";
import Income from "@/models/Income";
import jwt from "jsonwebtoken";

export const GET = async (req) => {
  try {
    // Connect to the database
    await ConnectToDB();

    // Extract Authorization header
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authorizationHeader.split(" ")[1];
    let userId;
    try {
      // Verify the token (replace 'your-secret-key' with your actual secret key)
      const decoded = jwt.verify(token, "your-secret-key");
      userId = decoded.id;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    // Extract query parameters
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const category = url.searchParams.get("category");

    // Build query object
    const query = { user: userId };
    if (startDate) {
      query.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.date = query.date || {};
      query.date.$lte = new Date(endDate);
    }
    if (category) {
      query.category = category;
    }

    // Fetch income entries based on query
    const incomeEntries = await Income.find(query);

    // Format response data
    const responseData = incomeEntries.map((income) => ({
      id: income._id,
      title: income.title,
      amount: income.amount,
      category: income.category,
      date: income.date.toISOString(),
    }));

    // Send response
    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
