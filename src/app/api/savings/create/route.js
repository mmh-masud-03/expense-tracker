import { ConnectToDB } from "@/utils/connect";
import Savings from "@/models/Savings";
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
    const { goalTitle, goalAmount, savedAmount, targetDate } = body;

    if (!goalTitle || !goalAmount || !targetDate) {
      return new Response(
        JSON.stringify({
          error: "Goal title, amount, and target date are required",
        }),
        { status: 400 }
      );
    }

    const newSavings = await Savings.create({
      user: token.id,
      goalTitle,
      goalAmount,
      savedAmount: savedAmount || 0,
      targetDate,
      createdDate: new Date(),
    });

    return new Response(JSON.stringify({ success: true, data: newSavings }), {
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error creating Savings" }), {
      status: 500,
    });
  }
};
