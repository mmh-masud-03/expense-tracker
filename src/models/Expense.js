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
      trim: true, // Ensure whitespace is trimmed
      minlength: 1, // Ensure title is not empty
      maxlength: 100, // Optional: Set a maximum length for title
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensure amount is non-negative
    },
    category: {
      type: String,
      enum: ["Food", "Travel", "Bills", "Entertainment", "Other"],
      default: "Other", // Optional: Default category if not specified
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create indexes to improve performance
ExpenseSchema.index({ user: 1 });
ExpenseSchema.index({ date: 1 });

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
export default Expense;
