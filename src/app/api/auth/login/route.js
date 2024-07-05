import { ConnectToDB } from "@/utils/connect";
import User from "@/models/User";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import Cookies from "js-cookie";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export async function POST(req) {
  try {
    await ConnectToDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify("Username and password required"), {
        status: 400,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify("Invalid credentials"), {
        status: 400,
      });
    }

    const isMatched = await compare(password, user?.password);

    if (!isMatched) {
      return new Response(JSON.stringify("Invalid credentials"), {
        status: 400,
      });
    }

    if (isMatched) {
      const token = generateToken(user);
      //   const cookieOptions = {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === "production",
      //     sameSite: "strict",
      //     maxAge: 60 * 60,
      //     path: "/",
      //   };
      //   cookies().set("authToken", token, cookieOptions);
      //   Cookies.set("user", user);
      return new Response(JSON.stringify(user, token), { status: 200 });
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
