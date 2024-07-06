import { ConnectToDB } from "@/utils/connect";
import Expense from "@/models/Expense";
import jwt from "jsonwebtoken";

export const GET = async (req) => {
  try {
    await ConnectToDB();

    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authorizationHeader.split(" ")[1];
    let userId;
    try {
      const decoded = jwt.verify(token, "your-secret-key");
      userId = decoded.id;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const category = url.searchParams.get("category");

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

    const expenses = await Expense.find(query);

    const responseData = expenses.map((expense) => ({
      id: expense._id,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.toISOString(),
    }));

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
};
