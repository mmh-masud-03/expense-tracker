import { ConnectToDB } from "@/utils/connect";
import User from "@/models/User";
import { hash } from "bcryptjs";
export const POST = async (req, res) => {
  const body = await req.json();
  const { username, email, password } = body;
  try {
    await ConnectToDB();
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return new Response(JSON.stringify("User already exists"), {
        status: 409,
      });
    }
    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify("Failed to create user", { status: 500 })
    );
  }
};
