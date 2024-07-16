import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  theme: { type: String, default: "light" },
  emailNotifications: { type: Boolean, default: true },
  // Add more settings as needed
});

export default mongoose.models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);
