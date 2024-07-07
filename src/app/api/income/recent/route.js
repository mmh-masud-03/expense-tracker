// /pages/api/income/recent.js
import { ConnectToDB } from "@/utils/connect";
import Income from "@/models/Income";

export async function handler(req, res) {
  try {
    await ConnectToDB();
    const income = await Income.find().sort({ date: -1 }).limit(10);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ error: "Error fetching income" });
  }
}
