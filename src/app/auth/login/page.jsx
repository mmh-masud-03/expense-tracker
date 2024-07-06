// app/auth/login.js
import AuthForm from "@/components/AuthForm";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm type="login" />
    </div>
  );
}
