"use client"; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('Sikeres bejelentkezés!');
        localStorage.setItem('token', data.token); 
        router.push('/post');
      } else{
        const error = await res.json();
        setMessage(error.error || 'Érvénytelen bejelentkezés.');
      }   
      }
     catch (err) {
      setMessage('Failed to connect to the server.');
      console.error(err); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark-gray text-white">
      <h1 className="text-4xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="bg-orange-650 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}