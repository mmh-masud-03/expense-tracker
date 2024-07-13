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
    const savings = await Savings.find({ user: userId });

    return new Response(JSON.stringify({ success: true, data: savings }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error fetching Savings" }), {
      status: 500,
    });
  }
};
