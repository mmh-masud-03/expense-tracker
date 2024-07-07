// /pages/api/budget/recent.js
import { ConnectToDB } from "@/utils/connect";
import Budget from "@/models/Budget";

export async function handler(req, res) {
  try {
    await ConnectToDB();
    const budget = await Budget.find().sort({ date: -1 }).limit(10);
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ error: "Error fetching budget" });
  }
}
