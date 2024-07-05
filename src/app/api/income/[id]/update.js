import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, amount, category, date } = body;

    await ConnectToDB();
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { title, amount, category, date },
      { new: true }
    );

    if (!updatedIncome) {
      return new Response(JSON.stringify({ error: "Income not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedIncome), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error updating Income" }), {
      status: 500,
    });
  }
};
