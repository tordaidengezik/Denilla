"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div
      className="flex flex-col md:flex-row items-center justify-center h-screen text-white px-4 md:px-8 space-y-8 md:space-y-0 md:space-x-8 lg:space-x-16 xl:space-x-24"
      style={{
        background: "linear-gradient(45deg, #000000 45%, #F84F08 45%)",
      }}
    >
      <div className="flex flex-col items-center space-y-4 mt-8 md:mt-0">
        <div className="w-48 md:w-64 lg:w-72">
          <Image 
            src="/Denilla.png" 
            alt="Denilla Logo" 
            width={300} 
            height={300}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 px-4 md:px-0 pb-8 md:pb-0 w-full max-w-2xl md:translate-x-12 lg:translate-x-24">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black text-center">
          Denilla
        </h1>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 text-center">
          Next generation social network platform.
        </h1>

        {message && (
          <div className={`bg-black text-white p-3 rounded-lg w-full max-w-md mx-auto animate-fade-in backdrop-blur-sm ${
            message.includes("Sikeres") ? "text-green-400" : "text-red-400"
          }`}>
            {message.includes("Sikeres") ? "✅ " : "⚠️ "}{message}
          </div>
        )}

        <div className="bg-gradient-to-r from-gray-900 to-orange-900/70 p-5 rounded-lg shadow-xl md:p-6 w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              name="email"
              data-testid="email-input"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
            />
            <input
              type="password"
              name="password"
              data-testid="password-input"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
            />
            <button
              type="submit"
              data-testid="login-button"
              className="bg-black text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold"
            >
              Sign In
            </button>
          </form>
        </div>

        <h1 className="text-sm text-black text-center px-4 md:px-0 font-bold">
          By signing up, you agree to the Terms of Service <br /> 
          and Privacy Policy, including Cookie Use.
        </h1>
      </div>
    </div>
  );
}
