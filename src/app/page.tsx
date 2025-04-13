"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formVisible, setFormVisible] = useState<"register" | "login" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        router.push('/foryou');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const endpoint = formVisible === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
  
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Ismeretlen hiba');
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Sikeres üzenet kezelése
      if (data.message) {
        setSuccessMessage(data.message);
      }
    } catch (error) {
      // Hibaüzenet kezelése
      setErrorMessage(error instanceof Error ? error.message : 'Váratlan hiba');
    }
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
  
        {successMessage && (
          <div className="bg-black text-white p-3 rounded-lg w-full max-w-md mx-auto animate-fade-in backdrop-blur-sm">
            ✅ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-black text-white p-3 rounded-lg w-full max-w-md mx-auto animate-fade-in backdrop-blur-sm">
            ⚠️ {errorMessage}
          </div>
        )}
  
        {formVisible === "login" ? (
          <div className="bg-gradient-to-r from-gray-900 to-orange-900/70 p-5 rounded-lg shadow-xl md:p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="email"
                name="email"
                data-testid="email-input"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="password"
                name="password"
                data-testid="password-input"
                placeholder="Password"
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
            <button
              onClick={() => setFormVisible("register")}
              className="text-base text-orange-650 mt-4 hover:underline font-bold"
            >
              Dont have an account? Create one here.
            </button>
          </div>
        ) : formVisible === "register" ? (
          <div className="bg-gradient-to-r from-gray-900 to-orange-900/70 p-5 rounded-lg shadow-xl md:p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                name="username"
                data-testid="register-username"
                placeholder="Username"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="email"
                name="email"
                data-testid="register-email"
                placeholder="Email"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <input
                type="password"
                name="password"
                data-testid="register-password"
                placeholder="Password"
                className="px-4 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-650"
              />
              <button
                type="submit"
                data-testid="register-submit"
                className="bg-white text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all font-semibold"
              >
                Create Account
              </button>
            </form>
            <button
              onClick={() => setFormVisible("login")}
              className="text-base text-orange-650 mt-4 hover:underline font-bold"
            >
              Already have an account? Sign in here.
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button
              onClick={() => setFormVisible("login")}
              className="bg-black text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-800 font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => setFormVisible("register")}
              data-testid="create-account-button"
              className="bg-white text-orange-650 px-6 py-2 rounded-lg hover:bg-gray-200 font-semibold"
            >
              Create Account
            </button>
          </div>
        )}
  
        <h1 className="text-sm text-black text-center px-4 md:px-0 font-bold">
          By signing up, you agree to the Terms of Service <br /> 
          and Privacy Policy, including Cookie Use.
        </h1>
      </div>
    </div>
  );
}






