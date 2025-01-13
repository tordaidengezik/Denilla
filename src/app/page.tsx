"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formVisible, setFormVisible] = useState<"register" | "login" | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');

    try {
      const endpoint = formVisible === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        router.push('/foryou');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen text-white px-8 space-x-72"
      style={{
        background: "linear-gradient(45deg, #000000 45%, #F84F08 45%)",
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

        {formVisible === "login" ? (
          <div className="bg-[#1f1f1f] bg-opacity-50 p-6 rounded-lg shadow-lg w-96 mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <button
                type="submit"
                className="bg-black text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-800 transition-all font-semibold"
              >
                Sign In
              </button>
            </form>
            {/* Toggle to Create Account */}
            <button
              onClick={() => setFormVisible("register")}
              className="text-sm text-orange-650 mt-4 hover:underline"
            >
              Don not have an account? Create one here.
            </button>
          </div>
        ) : formVisible === "register" ? (
          <div className="bg-[#1f1f1f] bg-opacity-50 p-6 rounded-lg shadow-lg w-96">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <button
                type="submit"
                className="bg-white text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold"
              >
                Create Account
              </button>
            </form>
            {/* Toggle to Sign In */}
            <button
              onClick={() => setFormVisible("login")}
              className="text-sm text-orange-650 mt-4 hover:underline"
            >
              Already have an account? Sign in here.
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 w-80">
            <button
              onClick={() => setFormVisible("login")}
              className="bg-black text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-800 font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => setFormVisible("register")}
              className="bg-white text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Create Account
            </button>
          </div>
        )}

        <h1 className="text-sm text-black">
          By signing up, you agree to the Terms of Service <br /> and Privacy Policy, including Cookie Use.
        </h1>
      </div>
    </div>
  );
}
