import { ConnectToDB } from "@/utils/connect";
import Income from "@/models/Income";
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
    const { user, title, amount, category, date } = body;

    if (!user || !title || !amount || !category) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    const newIncome = await Income.create({
      user,
      title,
      amount,
      category,
      date,
    });

    return new Response(JSON.stringify(newIncome), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error creating Income" }), {
      status: 500,
    });
  }
};
