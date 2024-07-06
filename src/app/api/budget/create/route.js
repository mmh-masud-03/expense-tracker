import { ConnectToDB } from "@/utils/connect";
import Budget from "@/models/Budget";

export const POST = async (req) => {
  try {
    await ConnectToDB();
    const body = await req.json();
    const { user, amount, month, year } = body;

    if (!user || !amount || !month || !year) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    const newBudget = await Budget.create({ user, amount, month, year });
    return new Response(JSON.stringify(newBudget), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error creating budget" }), {
      status: 500,
    });
  }
};
