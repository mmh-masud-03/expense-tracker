import mongoose from "mongoose";
import User from "./User";

const IncomeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Business", "Job", "Project", "Freelance"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Income = mongoose.models.Income || mongoose.model("Income", IncomeSchema);
export default Income;
