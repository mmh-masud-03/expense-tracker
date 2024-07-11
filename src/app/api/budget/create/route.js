import { ConnectToDB } from "@/utils/connect";
import Budget from "@/models/Budget";
import { getTokenFromRequest } from "@/utils/authHelper";

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
    const { user, amount, month, year } = body;

    if (!user || !amount || !month || !year) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { user, month, year },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );

    return new Response(JSON.stringify(updatedBudget), { status: 200 });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return new Response(
        JSON.stringify({
          error: "Budget for this month and year already exists",
        }),
        {
          status: 409,
        }
      );
    }
    return new Response(
      JSON.stringify({ error: "Error creating/updating budget" }),
      {
        status: 500,
      }
    );
  }
};
