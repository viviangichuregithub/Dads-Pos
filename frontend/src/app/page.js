"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <section className="text-center px-6">
        {/* Circular Logo */}
<div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-600 shadow-lg">
  <Image
    src="/shoe_logo.jpg"
    alt="Shoe World Logo"
    width={160}
    height={160}
    className="object-cover w-full h-full"
    priority
  />
</div>

        <h1 className="text-orange-400 text-5xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-blue-500">Shoe World Base</span> POS System
        </h1>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          A modern, secure, and professional Point of Sale solution.  
          Manage your sales, inventory, and reports all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
          <Button
            className="text-black bg-orange-400 hover:bg-gray-400 hover:text-white px-6 py-3 rounded-xl text-lg"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Shoe World Base. All rights reserved.
      </footer>
    </main>
  );
}
