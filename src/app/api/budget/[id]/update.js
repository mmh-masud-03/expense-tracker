import Budget from "@/models/Budget";
import { getTokenFromRequest } from "@/utils/authHelper";
import { ConnectToDB } from "@/utils/connect";

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { amount, month, year } = body;
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    if (!id || !amount || !month || !year) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    await ConnectToDB();
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      { amount, month, year },
      { new: true }
    );

    if (!updatedBudget) {
      return new Response(JSON.stringify({ error: "Budget not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedBudget), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error updating budget" }), {
      status: 500,
    });
  }
};
