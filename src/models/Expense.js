import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Bills",
        "Entertainment",
        "Education",
        "Healthcare",
        "Shopping",
        "Utilities",
        "Transport",
        "Housing",
        "Clothing",
        "Insurance",
        "Debt Repayment",
        "Personal Care",
        "Gifts & Donations",
        "Childcare",
        "Pet Care",
        "Subscriptions",
        "Emergency",
        "Festivals & Celebrations",
        "Technology",
        "Miscellaneous",
        "Others",
      ],
      default: "Others",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.index({ user: 1, date: 1 });

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
export default Expense;
