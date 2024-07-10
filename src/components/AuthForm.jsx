"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AuthForm({ type }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });

      if (res.ok) {
        console.log("Registered");
        toast("Registered", { type: "success" });
        router.push("/dashboard");
      } else {
        console.error("Error:", res.statusText);
        toast(res.statusText, { type: "error" });
      }
    } else {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Error:", result.error);
        toast(result.error, { type: "error" });
      } else {
        console.log("Logged in");
        toast("Logged in", { type: "success" });
        router.push("/dashboard");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-white rounded shadow-md"
    >
      {type === "register" && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded"
      >
        {type === "login" ? "Login" : "Register"}
      </button>
      <div className="mt-3 flex">
        {type === "register" ? (
          <Link className="text-blue-600 m-auto " href={"/auth/login"}>
            Already have an account? Login here.
          </Link>
        ) : (
          <Link className="text-blue-600 m-auto" href={"/auth/register"}>
            Don&apos;t have an account? Register here
          </Link>
        )}
      </div>
    </form>
  );
}
