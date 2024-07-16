import { ConnectToDB } from "@/utils/connect";
import UserSettings from "@/models/UserSettings";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await ConnectToDB();

  switch (req.method) {
    case "GET":
      try {
        let settings = await UserSettings.findOne({ user: session.user.id });
        if (!settings) {
          settings = await UserSettings.create({ user: session.user.id });
        }
        res.status(200).json(settings);
      } catch (error) {
        res.status(400).json({ error: "Failed to fetch settings" });
      }
      break;

    case "PUT":
      try {
        const settings = await UserSettings.findOneAndUpdate(
          { user: session.user.id },
          req.body,
          { new: true, upsert: true }
        );
        res.status(200).json(settings);
      } catch (error) {
        res.status(400).json({ error: "Failed to update settings" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
