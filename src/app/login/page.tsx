"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("Sikeres bejelentkezés!");
        localStorage.setItem("token", data.token);
        router.push("/post");
      } else {
        const error = await res.json();
        setMessage(error.error || "Érvénytelen bejelentkezés.");
      }
    } catch (err) {
      setMessage("Failed to connect to the server.");
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-500">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-400"
          >
            Login
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes("Sikeres") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
