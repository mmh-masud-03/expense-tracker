// /pages/api/expenses/recent.js
import { ConnectToDB } from "@/utils/connect";
import Expense from "@/models/Expense";

export async function handler(req, res) {
  try {
    await ConnectToDB();
    const expenses = await Expense.find().sort({ date: -1 }).limit(10);
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
}
