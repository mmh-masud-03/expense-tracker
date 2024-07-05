import Expense from "@/models/Expense";
import { ConnectToDB } from "@/utils/connect";
export const GET = async () => {
  try {
    await ConnectToDB();
    const allExpenses = await Expense.find();
    return new Response(JSON.stringify(allExpenses), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify("Error getting expenses"), {
      status: 500,
    });
  }
};
