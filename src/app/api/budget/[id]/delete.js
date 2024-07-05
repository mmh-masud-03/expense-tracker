import Budget from "@/models/Budget";
import { ConnectToDB } from "@/utils/connect";
export const DELETE = async (req, { params }) => {
  try {
    const { id } = params.id;
    await ConnectToDB();
    const deleteBudget = await Budget.findByIdAndDelete(id);
    if (!deleteBudget) {
      return new Response(JSON.stringify("Error Deleting Budget"), {
        status: 300,
      });
    }
  } catch (err) {
    return new Response(JSON.stringify("Server Error"), {
      status: 500,
    });
  }
};
