import Budget from "@/models/Budget";
import { getTokenFromRequest } from "@/utils/authHelper";
import { ConnectToDB } from "@/utils/connect";

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    await ConnectToDB();
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const deleteBudget = await Budget.findByIdAndDelete(id);

    if (!deleteBudget) {
      return new Response(JSON.stringify({ error: "Budget not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Budget deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
