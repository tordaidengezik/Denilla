import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">    
      <h1 className="text-4xl font-bold mb-6">Welcome to Denilla!</h1>
      <div className="flex space-x-4">
        <Link 
          href="/post" 
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Register
        </Link>
        <Link 
          href="/post" 
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Login
        </Link>
      </div>
    </div>
  );
}