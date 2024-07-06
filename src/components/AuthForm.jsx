// components/AuthForm.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function AuthForm({ type }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
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
    </form>
  );
}
