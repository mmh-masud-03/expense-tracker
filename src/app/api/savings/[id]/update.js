import Savings from "@/models/Savings";
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
    const { goalTitle, goalAmount, savedAmount, targetDate } = body;

    await ConnectToDB();

    const updatedSavings = await Savings.findByIdAndUpdate(
      id,
      { goalTitle, goalAmount, savedAmount, targetDate },
      { new: true }
    );

    if (!updatedSavings) {
      return new Response(JSON.stringify({ error: "Savings not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedSavings }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error updating Savings" }), {
      status: 500,
    });
  }
};
