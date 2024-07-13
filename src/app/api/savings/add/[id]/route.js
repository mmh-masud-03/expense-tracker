import { ConnectToDB } from "@/utils/connect";
import Savings from "@/models/Savings";
import { getTokenFromRequest } from "@/utils/authHelper";

export const PATCH = async (req, { params }) => {
  try {
    const token = await getTokenFromRequest(req);

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { id } = params;
    const { amountToAdd } = await req.json();

    if (typeof amountToAdd !== "number") {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
      });
    }

    await ConnectToDB();

    const saving = await Savings.findById(id);

    if (!saving) {
      return new Response(JSON.stringify({ error: "Savings not found" }), {
        status: 404,
      });
    }

    saving.savedAmount += amountToAdd;
    await saving.save();

    return new Response(JSON.stringify(saving), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error updating savings" }), {
      status: 500,
    });
  }
};
