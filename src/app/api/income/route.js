import Income from "@/models/Income";
import { ConnectToDB } from "@/utils/connect";
export const GET = async () => {
  try {
    await ConnectToDB();
    const allIncome = await Income.find();
    return new Response(JSON.stringify(allIncome), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify("Server Error"), { status: 500 });
  }
};
