import { ConnectToDB } from "@/utils/connect";
import Savings from "@/models/Savings";
import { getTokenFromRequest } from "@/utils/authHelper";

export const GET = async (req) => {
  try {
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await ConnectToDB();

    const userId = token.id;
    const latestSavings = await Savings.find({ user: userId })
      .sort({ createdDate: -1 })
      .limit(4);

    if (!latestSavings.length) {
      return new Response(JSON.stringify({ error: "No savings found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: latestSavings }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Error fetching latest Savings" }),
      {
        status: 500,
      }
    );
  }
};
