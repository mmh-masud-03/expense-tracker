import Budget from "@/models/Budget";
import { ConnectToDB } from "@/utils/connect";
export const GET = async () => {
  try {
    await ConnectToDB();
    const allBudgets = await Budget.find();
    return new Response(JSON.stringify(allBudgets), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify("Error getting budgets"), {
      status: 500,
    });
  }
};
