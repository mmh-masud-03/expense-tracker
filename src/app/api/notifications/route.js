// app/api/notifications/route.js
import { ConnectToDB } from "@/utils/connect";
import Notification from "@/models/Notification";
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

    const notifications = await Notification.find({ user: token.id }).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Error fetching notifications" }),
      {
        status: 500,
      }
    );
  }
};
