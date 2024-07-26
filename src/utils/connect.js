import mongoose from "mongoose";
let isConnected = false;
export const ConnectToDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  } catch (err) {
    console.log(err);
    console.log("could not connect to database");
  }
};
