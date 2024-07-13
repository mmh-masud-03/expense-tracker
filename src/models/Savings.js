import mongoose from "mongoose";

const SavingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalTitle: {
    type: String,
    required: true,
  },
  goalAmount: {
    type: Number,
    required: true,
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Savings =
  mongoose.models.Savings || mongoose.model("Savings", SavingsSchema);
export default Savings;
