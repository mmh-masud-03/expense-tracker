import Income from "@/models/Income";
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
    const deleteIncome = await Income.findByIdAndDelete(id);

    if (!deleteIncome) {
      return new Response(JSON.stringify({ error: "Income not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Income deleted successfully" }),
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
