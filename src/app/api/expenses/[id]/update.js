import Expense from "@/models/Expense";
import { getTokenFromRequest } from "@/utils/authHelper";
import { ConnectToDB } from "@/utils/connect";

export const PUT = async (req, { params }) => {
  try {
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const { id } = params;
    const body = await req.json();
    const { title, amount, category, date } = body;

    await ConnectToDB();
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category, date },
      { new: true }
    );

    if (!updatedExpense) {
      return new Response(JSON.stringify({ error: "Expense not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedExpense), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error updating Expense" }), {
      status: 500,
    });
  }
};
