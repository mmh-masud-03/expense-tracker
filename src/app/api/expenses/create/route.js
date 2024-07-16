// app/api/expenses/route.js
import { ConnectToDB } from "@/utils/connect";
import Expense from "@/models/Expense";
import { getTokenFromRequest } from "@/utils/authHelper";
import { checkBudgetExceedance } from "@/utils/budgetCheck";
export const POST = async (req) => {
  try {
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    await ConnectToDB();
    const body = await req.json();
    const { user, title, amount, category, date } = body;

    if (!user || !title || !amount || !category) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const newExpense = await Expense.create({
      user,
      title,
      amount,
      category,
      date,
    });

    // Check budget exceedance after creating new expense
    await checkBudgetExceedance(user);

    return new Response(JSON.stringify(newExpense), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error creating Expense" }), {
      status: 500,
    });
  }
};
