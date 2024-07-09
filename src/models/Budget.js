import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    enum: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

// Add a compound unique index
BudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
export default Budget;
