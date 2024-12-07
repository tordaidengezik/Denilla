import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-dark-gray text-white px-8 space-x-72">
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
        <h1 className="text-6xl font-bold">
          Denilla
        </h1>
        <h1 className="text-4xl font-semibold text-gray-500 text-opacity-90">
          Next generation social network platform.
        </h1>
        
        <Link 
          href="/register" 
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold w-64 text-center"
        >
          Create Account
        </Link>
        <Link 
          href="/login" 
          className="bg-black text-orange-500 px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-900 font-semibold w-64 text-center"
        >
          Sign in
        </Link>
        <h1 className="text-xs">
          By signing up, you agree to the Terms of Service <br /> and Privacy Policy, including Cookie Use.
        </h1>
      </div>
    </div>
  );
}
