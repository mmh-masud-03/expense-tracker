import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  user: {
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
    enum: [
      "Business",
      "Job",
      "Project",
      "Freelance",
      "Investment",
      "Rental",
      "Savings",
      "Gift",
      "Pension",
      "Consulting",
      "Tutoring",
      "Government Benefits",
      "Scholarship",
      "Lottery & Prize",
      "Part-Time Job",
      "Sale of Assets",
      "Agriculture",
      "Transportation Services",
      "Crafts & Homemade Goods",
      "Others",
    ],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Income = mongoose.models.Income || mongoose.model("Income", IncomeSchema);
export default Income;
