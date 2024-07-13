import Savings from "@/models/Savings";
import { getTokenFromRequest } from "@/utils/authHelper";
import { ConnectToDB } from "@/utils/connect";

export const DELETE = async (req, { params }) => {
  try {
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { id } = params;
    await ConnectToDB();

    const deleteSavings = await Savings.findByIdAndDelete(id);

    if (!deleteSavings) {
      return new Response(JSON.stringify({ error: "Savings not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Savings deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error deleting Savings" }), {
      status: 500,
    });
  }
};
