// models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
export default Notification;
