import { ConnectToDB } from "@/utils/connect";
import Expense from "@/models/Expense";
export const POST = async (req) => {
  try {
    await ConnectToDB();
    const body = await req.json();
    const { title, amount, category, date } = body;

    if (!title || !amount || !category || !date) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    const newExpense = await Expense.create({ title, amount, category, date });
    return new Response(JSON.stringify(newExpense), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error creating Expense" }), {
      status: 500,
    });
  }
};
