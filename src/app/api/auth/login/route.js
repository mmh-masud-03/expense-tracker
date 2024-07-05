import User from "@/models/User";
export const POST = async (req) => {
  const { email, password } = await req.json();
  const user = User.findOne({ email });
  try {
    if (!user) {
      return new Response(JSON.stringify("User not found"), { status: 404 });
    }
    const 
  } catch (err) {}
};
