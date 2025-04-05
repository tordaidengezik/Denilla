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
        router.push("/foryou");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-orange-500 to-black">
      <div className="w-full max-w-lg bg-black rounded-lg shadow-lg p-8 border border-orange-500">
        {/* Fejléc */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-500">Denilla</h1>
          <p className="text-gray-400 text-sm">Next generation social network platform.</p>
        </div>

        {/* Bejelentkezési űrlap */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email mező */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              data-testid="email-input"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Jelszó mező */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              data-testid="password-input"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Bejelentkezés gomb */}
          <button
            type="submit"
            data-testid="login-button"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-400"
          >
            Sign In
          </button>
        </form>

        {/* Üzenetek */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Sikeres") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Lábjegyzet */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            By signing in, you agree to the{" "}
            <a href="#" className="text-orange-500 hover:text-orange-400">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-500 hover:text-orange-400">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}