"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formVisible, setFormVisible] = useState<"register" | "login" | null>(null);

  return (
    <div
      className="flex items-center justify-center h-screen text-white px-8 space-x-72"
      style={{
        background: "linear-gradient(45deg, #111827 45%, #f97316 45%)",
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <Image 
          src="/Denilla.png" 
          alt="Denilla Logo" 
          width={300} 
          height={300} 
          className="mb-4"
        />
      </div>

      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-6xl font-bold text-black">
          Denilla
        </h1>
        <h1 className="text-4xl font-semibold text-white text-opacity-90">
          Next generation social network platform.
        </h1>

        {formVisible === "register" && (
          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg max-w-md w-full mb-6">
            <form className="flex flex-col space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-white text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Create Account
              </button>
            </form>
          </div>
        )}

        {formVisible === "login" && (
          <div className="bg-gray-900 bg-opacity-60 p-6 rounded-lg shadow-lg max-w-md w-full mb-6">
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-black text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold"
              >
                Sign In
              </button>
            </form>
          </div>
        )}

        {formVisible !== "register" && (
          <button
            onClick={() => setFormVisible("register")}
            className="bg-white text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold w-64 text-center"
          >
            Create Account
          </button>
        )}

        {formVisible !== "login" && (
          <button
            onClick={() => setFormVisible("login")}
            className="bg-black text-orange-500 px-6 py-2 rounded-lg hover:bg-gray-800 font-semibold w-64 text-center"
          >
            Sign In
          </button>
        )}

        <h1 className="text-xs text-black">
          By signing up, you agree to the Terms of Service <br /> and Privacy Policy, including Cookie Use.
        </h1>
      </div>
    </div>
  );
}