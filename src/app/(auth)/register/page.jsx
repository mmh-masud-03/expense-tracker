// app/auth/register.js
import AuthForm from "@/components/AuthForm";

export default function Register() {
  return (
    <div className="flex flex-col gap-y-2 items-center justify-center p-5 m-auto w-[30vw] bg-gray-100">
      <p className="text-xl font-semibold">Register</p>
      <AuthForm type="register" />
    </div>
  );
}
